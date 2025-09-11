
from fastapi import FastAPI
import os

app = FastAPI(title="Math Agent")
from common import (
    JSONRPCRequest,
    make_result,
    make_error,
    validate_request,
    respond_with_tools_or_prompt,
    get_last_route_info,
    get_last_internal_events,
)

SERVICE_BASE_URL = os.environ.get("SERVICE_BASE_URL", "http://localhost:8002")

@app.get("/.well-known/agent.json")
def agent_card():
    return {
        "id": "math-agent",
        "name": "Math Agent",
        "description": "Understands 'add X Y' and returns the sum.",
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
        out = await respond_with_tools_or_prompt(text)
        meta = {
            "math": get_last_route_info(),
            # include internal events so coordinator can merge them into trace
            "events": (get_last_internal_events() or []),
        }
        return make_result({"parts": [{"text": out}], "role": "agent", "meta": meta}, req.id)
    return make_error(-32601, f"Method not found: {req.method}", req.id)
