
from fastapi import FastAPI
import os

app = FastAPI(title="Echo Agent")
from common import JSONRPCRequest, make_result, make_error, validate_request, respond_with_prompt

SERVICE_BASE_URL = os.environ.get("SERVICE_BASE_URL", "http://localhost:8001")

@app.get("/.well-known/agent.json")
def agent_card():
    return {
        "id": "echo-agent",
        "name": "Echo Agent",
        "description": "Returns the same text it received.",
        "protocolVersion": "0.3.0",
        "endpoints": {"jsonrpc": {"url": f"{SERVICE_BASE_URL}/a2a", "transport": "http"}},
        "authentication": {"type": "none"},
        "capabilities": {"message": ["send"]}
    }

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
        out = await respond_with_prompt(text)
        return make_result({"parts": [{"text": out}], "role": "agent"}, req.id)
    return make_error(-32601, f"Method not found: {req.method}", req.id)
