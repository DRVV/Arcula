
from fastapi import FastAPI
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
