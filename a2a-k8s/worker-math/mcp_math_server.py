import math

try:
    # FastMCP provides a simple decorator-based server API.
    from mcp.server.fastmcp import FastMCP
    from mcp.server.stdio import stdio_server
except Exception as e:  # pragma: no cover
    raise SystemExit(
        "The 'mcp' package is required to run the MCP math server.\n"
        "Install it from requirements.txt and rebuild the image."
    )


app = FastMCP("math-tools")


@app.tool()
def add(a: float, b: float) -> float:
    """Return a + b."""
    return float(a) + float(b)


@app.tool()
def subtract(a: float, b: float) -> float:
    """Return a - b."""
    return float(a) - float(b)


@app.tool()
def multiply(a: float, b: float) -> float:
    """Return a * b."""
    return float(a) * float(b)


@app.tool()
def divide(a: float, b: float) -> float:
    """Return a / b. Raises on division by zero."""
    b = float(b)
    if b == 0.0:
        raise ValueError("division by zero")
    return float(a) / b


@app.tool()
def power(a: float, b: float) -> float:
    """Return a ** b."""
    return float(a) ** float(b)


@app.tool()
def sqrt(x: float) -> float:
    """Return sqrt(x)."""
    x = float(x)
    if x < 0:
        raise ValueError("sqrt of negative number")
    return math.sqrt(x)


if __name__ == "__main__":
    # Expose the server over stdio so clients can spawn it as a subprocess.
    stdio_server.run(app)

