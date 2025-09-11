
# A2A Minimal Starter (Kubernetes)

Ultra-simple baseline for an A2A-style multi-agent system on Kubernetes.
- 3 agents (coordinator, echo, math) expose a JSON-RPC `/a2a` endpoint.
- Each agent serves an **Agent Card** at `/.well-known/agent.json` with a single `message/send` capability.
- A barebones web app forwards user `/task` to the coordinator’s `/a2a`.

## Prompt-Configurable LLM Agents

Each agent container can operate as an LLM-backed agent configured by a prompt. Prompts are injected via Kubernetes ConfigMaps and read by the container at runtime.

- Prompt source: file path from env `AGENT_PROMPT_FILE` (mounted ConfigMap) or inline env `AGENT_PROMPT`.
- LLM backend: if `OPENAI_API_KEY` is set, agents call an OpenAI-compatible chat completions endpoint.
  - Optional envs: `OPENAI_BASE_URL` (default `https://api.openai.com/v1`), `OPENAI_MODEL` (default `gpt-4o-mini`), `OPENAI_TEMPERATURE` (default `0.2`).
- No key present: agents return a deterministic stub response including the prompt prefix and your input (useful for local dev).

Kubernetes manifests now include per-agent ConfigMaps (e.g., `worker-echo-prompt`, `worker-math-prompt`) and mount them into the pods.

Instantiate multiple distinct agents by copying a worker manifest, changing the names, and adjusting the ConfigMap prompt. The image remains the same; only the prompt differs.

## Run locally

```bash
# In separate shells:
uvicorn worker-echo.app:app --port 8001 --reload
uvicorn worker-math.app:app --port 8002 --reload
uvicorn coordinator.app:app --port 8000 --reload
uvicorn webapp.app:app --port 8080 --reload
```

Test:
```bash
curl -s localhost:8001/.well-known/agent.json | jq .
curl -s localhost:8002/.well-known/agent.json | jq .

curl -s -X POST localhost:8000/a2a -H 'content-type: application/json' -d '{
  "jsonrpc":"2.0",
  "method":"message/send",
  "id":"1",
  "params":{"message":{"parts":[{"text":"add 2 3"}],"role":"user"}}
}' | jq .

curl -s -X POST localhost:8080/task -H 'content-type: application/json' -d '{"text":"add 2 3"}' | jq .
```

## Build images (example)

```bash
docker build -t ghcr.io/example/worker-echo:latest ./worker-echo
docker build -t ghcr.io/example/worker-math:latest ./worker-math
docker build -t ghcr.io/example/coordinator:latest ./coordinator
docker build -t ghcr.io/example/webapp:latest ./webapp
```

## Deploy to Kubernetes

Replace image names in `k8s/*.yaml` or set your own registry, then:

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/10-worker-echo.yaml
kubectl apply -f k8s/11-worker-math.yaml
kubectl apply -f k8s/20-coordinator.yaml
kubectl apply -f k8s/30-webapp.yaml
# Optional ingress (requires an ingress controller)
kubectl apply -f k8s/40-ingress.yaml
```

To add another agent with a different role, duplicate one of the worker manifests, rename the Deployment/Service/ConfigMap, and edit the `prompt.txt` contents. Apply the new file to spin up the additional agent.

To use a real LLM, set credentials as a Secret and wire env in the Deployment, for example:

```bash
kubectl -n a2a-demo create secret generic openai \
  --from-literal=api_key="$OPENAI_API_KEY"
```

Then add to the container env in your Deployment (not enabled by default here):

```yaml
env:
  - name: OPENAI_API_KEY
    valueFrom:
      secretKeyRef: { name: openai, key: api_key }
  - name: OPENAI_MODEL
    value: gpt-4o-mini
```

## Notes
- Endpoint names follow common practice: `message/send` for a minimal **A2A**-style JSON-RPC method.
- Agent Cards are intentionally minimal and unauthenticated for clarity.
- For production: add auth (OAuth/JWT), mTLS in-mesh, readiness probes, and run Inspector/TCK.
 - Agents now support prompt-driven behavior via ConfigMaps; without an API key they return stub responses for fast iteration.
