
# Minimal JSON-RPC helpers (no external lib required)
from typing import Any, Optional, Tuple
from pydantic import BaseModel
from fastapi import HTTPException
import os
import httpx
import re
import sys
import shlex
import time

# Optional MCP imports are loaded lazily to keep import-time light
_MCP_AVAILABLE = True
try:  # import hints; actual usage inside async call
    import mcp  # noqa: F401
except Exception:
    _MCP_AVAILABLE = False

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
    prompt_file = os.environ.get("AGENT_PROMPT_FILE")
    if prompt_file:
        text = _read_text_file(prompt_file)
        if text:
            return text
    env_prompt = os.environ.get("AGENT_PROMPT")
    if env_prompt:
        return env_prompt
    return "You are a math agent. Solve simple math or say you cannot."

async def llm_chat_completion(system_prompt: str, user_text: str) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    base_url = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    if not api_key:
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
        return f"[error] LLM call failed: {e}"

async def respond_with_prompt(user_text: str) -> str:
    prompt = load_agent_prompt()
    return await llm_chat_completion(prompt, user_text)


# ---- MCP client + simple ReAct routing ----

_MCP_SERVER_PATH = os.path.join(os.path.dirname(__file__), "mcp_math_server.py")

# simple per-request route info (module-level, not thread-safe across concurrent requests)
_last_route_info: Optional[dict] = None
_last_internal_events: Optional[list] = None


def get_last_route_info() -> Optional[dict]:
    return _last_route_info


def _set_last_route_info(info: dict) -> None:
    global _last_route_info
    _last_route_info = info


def _reset_internal_events() -> None:
    global _last_internal_events
    _last_internal_events = []


def _append_internal_event(ev: dict) -> None:
    global _last_internal_events
    if _last_internal_events is None:
        _last_internal_events = []
    _last_internal_events.append(ev)


def get_last_internal_events() -> Optional[list]:
    return _last_internal_events


def _parse_math_command(text: str) -> Optional[Tuple[str, dict]]:
    """Very small parser that recognizes a few math intents.

    Returns a tuple (tool_name, args) or None if not recognized.
    Supported patterns (case-insensitive):
      - add X Y
      - subtract X Y
      - multiply X Y
      - divide X Y
      - power X Y
      - sqrt X
    Numbers may be int or float.
    """
    s = text.strip().lower()
    # Generic binary op matcher
    bin_ops = {
        "add": "add",
        "sum": "add",
        "plus": "add",
        "subtract": "subtract",
        "minus": "subtract",
        "multiply": "multiply",
        "times": "multiply",
        "divide": "divide",
        "over": "divide",
        "power": "power",
        "pow": "power",
        "^": "power",
    }

    # sqrt
    m = re.match(r"^(sqrt|square\s*root)\s+(-?\d+(?:\.\d+)?)$", s)
    if m:
        x = float(m.group(2))
        return ("sqrt", {"x": x})

    # binary ops: e.g. "add 2 3", "divide 10 2"
    m = re.match(r"^([a-z\^]+)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$", s)
    if m:
        op_raw, a, b = m.group(1), m.group(2), m.group(3)
        op = bin_ops.get(op_raw)
        if op:
            return (op, {"a": float(a), "b": float(b)})

    # phrases like "what is 2 plus 3" (very limited)
    m = re.match(r"^what\s+is\s+(-?\d+(?:\.\d+)?)\s+(plus|minus|times|over)\s+(-?\d+(?:\.\d+)?)\??$", s)
    if m:
        a, w, b = m.group(1), m.group(2), m.group(3)
        op = bin_ops[w]
        return (op, {"a": float(a), "b": float(b)})

    return None


async def _mcp_call(tool_name: str, args: dict) -> Any:
    """Call the MCP math server tool over stdio.

    Resilient to environments without the 'mcp' package by returning a local
    fallback result, but prefers MCP when available.
    """
    if not _MCP_AVAILABLE:
        # Fallback local compute if MCP isn't installed; keeps dev flow usable.
        return _local_math_fallback(tool_name, args)

    # Import here to avoid raising at import time if package missing
    try:
        from mcp.client.session import ClientSession  # type: ignore
        from mcp.transport.stdio import stdio_transport  # type: ignore
    except Exception:
        return _local_math_fallback(tool_name, args)

    # Build subprocess command for the MCP server
    cmd = [sys.executable, _MCP_SERVER_PATH]

    # Allow override via env if a different MCP server should be used
    override = os.environ.get("MCP_MATH_COMMAND")
    if override:
        try:
            cmd = shlex.split(override)
        except Exception:
            pass

    # Connect and call the tool
    try:
        async with stdio_transport(cmd[0], cmd[1:]) as transport:  # type: ignore
            async with ClientSession(transport) as session:
                result = await session.call_tool(tool_name, args)
                # Result shape depends on SDK; try common options
                if isinstance(result, dict):
                    # e.g., {"content": [{"type":"text","text":"..."}], ...} or plain number
                    if "content" in result and result["content"]:
                        content0 = result["content"][0]
                        if isinstance(content0, dict) and "text" in content0:
                            return content0["text"]
                    if "result" in result:
                        return result["result"]
                return result
    except Exception as e:
        return f"[error] MCP call failed: {e}"


def _local_math_fallback(tool_name: str, args: dict) -> Any:
    try:
        if tool_name == "add":
            return float(args["a"]) + float(args["b"])
        if tool_name == "subtract":
            return float(args["a"]) - float(args["b"])
        if tool_name == "multiply":
            return float(args["a"]) * float(args["b"])
        if tool_name == "divide":
            b = float(args["b"])
            if b == 0.0:
                raise ZeroDivisionError("division by zero")
            return float(args["a"]) / b
        if tool_name == "power":
            return float(args["a"]) ** float(args["b"])
        if tool_name == "sqrt":
            x = float(args["x"])  # type: ignore
            if x < 0:
                raise ValueError("sqrt of negative number")
            return x ** 0.5
    except Exception as e:
        return f"[error] local math failed: {e}"
    return f"[error] unknown tool: {tool_name}"


async def respond_with_tools_or_prompt(user_text: str) -> str:
    """Attempt tool-based resolution via MCP; fallback to prompt LLM."""
    # reset last route
    _set_last_route_info({
        "route": "unknown",
        "tool": None,
        "args": None,
        "result_preview": None,
        "duration_ms": None,
        "error": None,
        "used_mcp": False,
    })
    _reset_internal_events()

    parsed = _parse_math_command(user_text or "")
    if parsed:
        tool_name, args = parsed
        started = time.time()
        started_call = time.time()
        out = await _mcp_call(tool_name, args)
        duration_ms = int((time.time() - started) * 1000)
        call_duration_ms = int((time.time() - started_call) * 1000)
        # Heuristic: if MCP package available, assume attempted MCP; detect fallback by marker
        used_mcp = _MCP_AVAILABLE and not (isinstance(out, str) and out.startswith("[error] MCP call failed"))
        route = "mcp" if used_mcp else "fallback_local"
        err = out if isinstance(out, str) and out.startswith("[error]") else None
        # record internal event for Latest Activity, using an MCP-like tools/call JSON-RPC envelope
        req_id = str(int(time.time() * 1000))
        mcp_request = {
            "jsonrpc": "2.0",
            "id": req_id,
            "method": "tools/call",
            "params": {"name": tool_name, "arguments": args},
        }
        # Normalize response into MCP-style content array
        is_error = isinstance(out, str) and out.startswith("[error]")
        if isinstance(out, dict) and "content" in out:
            content = out.get("content")
        else:
            content = [{"type": "text", "text": str(out)}]
        mcp_response = {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {"content": content, **({"isError": True} if is_error else {})},
        }

        _append_internal_event({
            "source": "math",
            "target": "tool",
            "action": "call",
            "method": "tools/call",
            "text": f"{tool_name} {args}",
            "duration_ms": call_duration_ms,
            "rpc": {"request": mcp_request, "response": mcp_response},
            "ts": time.time(),
            "meta": {"used_mcp": used_mcp},
        })
        _set_last_route_info({
            "route": route,
            "tool": tool_name,
            "args": args,
            "result_preview": str(out)[:120],
            "duration_ms": duration_ms,
            "error": err,
            "used_mcp": used_mcp,
        })
        return str(out)

    # Fallback to LLM prompt behavior for non-math or unsupported forms
    started = time.time()
    out = await respond_with_prompt(user_text)
    _set_last_route_info({
        "route": "llm",
        "tool": None,
        "args": None,
        "result_preview": str(out)[:120],
        "duration_ms": int((time.time() - started) * 1000),
        "error": None,
        "used_mcp": False,
    })
    return out
