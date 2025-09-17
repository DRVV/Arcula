
from fastapi import FastAPI, Request
import os, httpx, json, time, copy

app = FastAPI(title="Coordinator Agent")
from common import JSONRPCRequest, make_result, make_error, validate_request, respond_with_prompt

ECHO_URL = os.environ.get("ECHO_URL", "http://worker-echo:8001/a2a")
MATH_URL = os.environ.get("MATH_URL", "http://worker-math:8002/a2a")
SERVICE_BASE_URL = os.environ.get("SERVICE_BASE_URL", "http://localhost:8000")

@app.get("/.well-known/agent.json")
def agent_card():
    return {
        "id": "coordinator-agent",
        "name": "Coordinator Agent",
        "description": "Sequentially calls Echo and Math agents via A2A and combines results.",
        "protocolVersion": "0.3.0",
        "endpoints": {"jsonrpc": {"url": f"{SERVICE_BASE_URL}/a2a", "transport": "http"}},
        "authentication": {"type": "none"},
        "capabilities": {"message": ["send"]}
    }

async def call_a2a(name: str, url: str, text: str, trace: list):
    payload = {
        "jsonrpc": "2.0",
        "method": "message/send",
        "id": "1",
        "params": {"message": {"parts": [{"text": text}], "role": "user"}}
    }
    # trace send
    trace.append({
        "source": "coordinator",
        "target": name,
        "action": "send",
        "method": "message/send",
        "text": text[:120],
        "rpc": {"request": payload},
        "ts": time.time(),
    })
    started = time.time()
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()
        parts = (data.get("result") or {}).get("parts", [])
        out_text = parts[0]["text"] if (parts and "text" in parts[0]) else str(data)
        # merge any worker-provided internal events (e.g., MCP tool calls)
        try:
            worker_events = (
                (data.get("result") or {}).get("meta", {}).get("events")
            )
            if isinstance(worker_events, list):
                for ev in worker_events:
                    if isinstance(ev, dict):
                        # ensure minimal fields
                        ev.setdefault("source", name)
                        ev.setdefault("target", "tool")
                        ev.setdefault("action", "call")
                        ev.setdefault("method", "tool/call")
                        ev.setdefault("ts", time.time())
                        trace.append(ev)
        except Exception:
            pass
        # trace recv
        trace.append({
            "source": name,
            "target": "coordinator",
            "action": "recv",
            "method": "message/send",
            "text": str(out_text)[:120],
            "duration_ms": int((time.time() - started) * 1000),
            "rpc": {"response": data},
            "ts": time.time(),
        })
        return out_text

@app.post("/a2a")
async def a2a_endpoint(req: JSONRPCRequest):
    validate_request(req)
    if req.method in ["message/send", "message.send"]:
        text = ""
        try:
            parts = (req.params or {}).get("message", {}).get("parts", [])
            if parts and "text" in parts[0]:
                text = parts[0]["text"]
        except Exception:
            pass
        trace: list = [{
            "source": "client",
            "target": "coordinator",
            "action": "recv",
            "method": req.method,
            "text": str(text)[:120],
            "rpc": {"request": req.model_dump()},
            "ts": time.time(),
        }]
        # Ask LLM how to route this request.
        decision_prompt = (
            "You are a coordinator. Decide which workers to call for the "
            "user input. Return STRICT JSON ONLY with keys: 'targets' (array "
            "of any of ['echo','math']), and 'strategy' ('sequential'). No prose."
        )
        decision_text = await respond_with_prompt(decision_prompt + f"\nUser: {text}")
        print(f"DECISION_RAW {decision_text}")
        targets = ["echo", "math"]
        try:
            parsed = json.loads(decision_text)
            cand = parsed.get("targets")
            if isinstance(cand, list) and cand:
                targets = [t for t in cand if t in ("echo", "math")]
                if not targets:
                    targets = ["echo", "math"]
        except Exception:
            pass
        results = []
        if "echo" in targets:
            results.append(("echo", await call_a2a("echo", ECHO_URL, text, trace)))
        if "math" in targets:
            results.append(("math", await call_a2a("math", MATH_URL, text, trace)))
        combined = " | ".join([f"[{name}] {val}" for name, val in results])
        # Prepare the final JSON-RPC response object
        response_obj = make_result({
            "parts": [{"text": combined}],
            "role": "agent",
            "meta": {"trace": None},  # temporarily None to avoid echoing trace inside itself
        }, req.id)
        # Snapshot the response for trace (avoid recursive reference)
        response_snapshot = copy.deepcopy(response_obj)
        # And trace it outwards to the client
        trace.append({
            "source": "coordinator",
            "target": "client",
            "action": "send",
            "method": req.method,
            "text": combined[:120],
            "rpc": {"response": response_snapshot},
            "ts": time.time(),
        })
        # Now embed the full trace (without recursive response echo)
        response_obj["result"]["meta"]["trace"] = trace
        return response_obj
    return make_error(-32601, f"Method not found: {req.method}", req.id)

# =========================
# Topology Apply -> ConfigMaps
# =========================
try:
    from kubernetes import client, config
    from kubernetes.client import ApiException
except Exception:
    client = None
    config = None
    ApiException = Exception  # fallback


def _load_kube():
    # Try in-cluster, then fallback to local kubeconfig (for dev)
    if config is None:
        return
    try:
        config.load_incluster_config()
    except Exception:
        try:
            config.load_kube_config()
        except Exception:
            pass


def _get_namespace() -> str:
    # Prefer explicit env, else serviceaccount namespace, else default
    ns = os.environ.get("NAMESPACE")
    if ns:
        return ns
    try:
        with open("/var/run/secrets/kubernetes.io/serviceaccount/namespace", "r") as f:
            return f.read().strip()
    except Exception:
        pass
    return os.environ.get("POD_NAMESPACE", "default")


@app.post("/apply-topology")
async def apply_topology(req: Request):
    """
    Accepts topology payload:
    {
      "agents": [
        { "id": "...", "label": "...", "role": "...",
          "systemPrompt": "...", "mcpServers": [], "agentUrls": [] }
      ]
    }
    Upserts a ConfigMap per agent with:
      data:
        system_prompt: string
        mcp_servers.json: JSON array
        agent_urls.json: JSON array
    Labels:
      app=a2a, kind=agent-config, agentId=<id>, managed-by=coordinator
    Also prunes previously managed ConfigMaps not present in the payload.
    """
    try:
        body = await req.json()
    except Exception:
        body = {}

    agents = body.get("agents") or []
    if not isinstance(agents, list):
        agents = []

    # If kubernetes client not available, just echo (useful for dev)
    if client is None or config is None:
        return {"ok": True, "note": "kubernetes client not installed", "agents": len(agents)}

    _load_kube()
    v1 = client.CoreV1Api()
    namespace = _get_namespace()

    # Build set of incoming agent IDs
    incoming_ids = set()
    for a in agents:
        try:
            aid = str(a.get("id") or "").strip()
            if aid:
                incoming_ids.add(aid)
        except Exception:
            continue

    created = 0
    updated = 0
    deleted = 0
    errors: list[str] = []

    # Prune pass: delete existing managed ConfigMaps not in incoming payload
    label_selector = "app=a2a,kind=agent-config,managed-by=coordinator"
    try:
        existing = v1.list_namespaced_config_map(namespace=namespace, label_selector=label_selector)
        for item in existing.items or []:
            labels = item.metadata.labels or {}
            aid = labels.get("agentId") or ""
            if aid and aid not in incoming_ids:
                try:
                    v1.delete_namespaced_config_map(name=item.metadata.name, namespace=namespace)
                    deleted += 1
                except ApiException as e:
                    errors.append(f"delete {item.metadata.name}: {getattr(e, 'reason', str(e))}")
    except ApiException as e:
        errors.append(f"list existing: {getattr(e, 'reason', str(e))}")

    # Upsert each agent
    for a in agents:
        try:
            aid = str(a.get("id") or "").strip()
            if not aid:
                continue
            cm_name = f"agent-config-{aid}"
            system_prompt = str(a.get("systemPrompt") or "")
            mcp_servers = a.get("mcpServers") or []
            agent_urls = a.get("agentUrls") or []

            metadata = client.V1ObjectMeta(
                name=cm_name,
                namespace=namespace,
                labels={
                    "app": "a2a",
                    "kind": "agent-config",
                    "managed-by": "coordinator",
                    "agentId": aid,
                },
            )
            data = {
                "system_prompt": system_prompt,
                "mcp_servers.json": json.dumps(mcp_servers),
                "agent_urls.json": json.dumps(agent_urls),
            }
            body_cm = client.V1ConfigMap(api_version="v1", kind="ConfigMap", metadata=metadata, data=data)

            # Try create; if exists, replace
            try:
                v1.create_namespaced_config_map(namespace=namespace, body=body_cm)
                created += 1
            except ApiException as e:
                if getattr(e, "status", None) == 409:
                    # Already exists -> replace
                    try:
                        v1.replace_namespaced_config_map(name=cm_name, namespace=namespace, body=body_cm)
                        updated += 1
                    except ApiException as e2:
                        errors.append(f"replace {cm_name}: {getattr(e2, 'reason', str(e2))}")
                else:
                    errors.append(f"create {cm_name}: {getattr(e, 'reason', str(e))}")
        except Exception as ex:
            errors.append(f"agent upsert error: {str(ex)}")

    return {
        "ok": True,
        "namespace": namespace,
        "created": created,
        "updated": updated,
        "deleted": deleted,
        "errors": errors,
    }
