
from fastapi import FastAPI
from pydantic import BaseModel
import os, httpx

app = FastAPI(title="Minimal Web App")

COORD_A2A_URL = os.environ.get("COORD_A2A_URL", "http://coordinator:8000/a2a")

class UserTask(BaseModel):
    text: str

@app.post("/task")
async def submit_task(task: UserTask):
    payload = {
        "jsonrpc": "2.0",
        "method": "message/send",
        "id": "1",
        "params": {"message": {"parts": [{"text": task.text}], "role": "user"}}
    }
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(COORD_A2A_URL, json=payload)
        r.raise_for_status()
        return r.json()

APPLY_COORD_URL = os.environ.get("APPLY_COORD_URL", "http://coordinator:8000/apply-topology")

@app.post("/apply-topology")
async def apply_topology(payload: dict):
    """
    Proxy that accepts topology payload {agents:[...]} and forwards to coordinator.
    This runs inside the cluster, so it can reach the 'coordinator' service directly.
    """
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(APPLY_COORD_URL, json=payload)
        r.raise_for_status()
        # try to return upstream json, fallback to status
        try:
            return r.json()
        except Exception:
            return {"ok": r.status_code}
