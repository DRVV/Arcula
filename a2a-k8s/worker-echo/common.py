
# Minimal JSON-RPC helpers (no external lib required)
from typing import Any, Optional
from pydantic import BaseModel
from fastapi import HTTPException
import os, asyncio
import httpx

class JSONRPCRequest(BaseModel):
    jsonrpc: str
    method: str
    params: Optional[dict] = None
    id: Optional[Any] = None

def make_result(result: Any, id: Any = None):
    return {"jsonrpc": "2.0", "result": result, "id": id}

def make_error(code: int, message: str, id: Any = None):
    return {"jsonrpc": "2.0", "error": {"code": code, "message": message}, "id": id}

def validate_request(req: JSONRPCRequest):
    if req.jsonrpc != "2.0":
        raise HTTPException(status_code=400, detail="jsonrpc must be '2.0'")
    if not req.method:
        raise HTTPException(status_code=400, detail="method is required")

# ---- LLM helpers (prompt-configured) ----

def _read_text_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return ""

def load_agent_prompt() -> str:
    # Priority: explicit file -> env var -> default
    prompt_file = os.environ.get("AGENT_PROMPT_FILE")
    if prompt_file:
        text = _read_text_file(prompt_file)
        if text:
            return text
    env_prompt = os.environ.get("AGENT_PROMPT")
    if env_prompt:
        return env_prompt
    return "You are a simple echo agent. Repeat the user input."  # default

async def llm_chat_completion(system_prompt: str, user_text: str) -> str:
    # If OPENAI_API_KEY is set, attempt OpenAI-compatible chat completions.
    api_key = os.environ.get("OPENAI_API_KEY")
    base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    if not api_key:
        # Fallback stub behavior (no network)
        return f"[stub] prompt: {system_prompt.strip()[:60]} | input: {user_text}"

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(
                f"{base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_text},
                    ],
                    "temperature": float(os.environ.get("OPENAI_TEMPERATURE", "0.2")),
                },
            )
            r.raise_for_status()
            data = r.json()
            return (
                data.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
                .strip()
                or ""
            )
    except Exception as e:
        # Graceful fallback on errors
        return f"[error] LLM call failed: {e}"

async def respond_with_prompt(user_text: str) -> str:
    prompt = load_agent_prompt()
    return await llm_chat_completion(prompt, user_text)
