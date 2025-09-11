
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
