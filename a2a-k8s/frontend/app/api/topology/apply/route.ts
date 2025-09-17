import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const url = process.env.APPLY_ENDPOINT;

    if (url) {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (!r.ok) {
        const text = await r.text();
        return NextResponse.json(
          { error: `upstream ${r.status}: ${text}` },
          { status: 502 }
        );
      }

      // try to parse json, but if upstream returns no JSON just return ok
      const data = await r
        .json()
        .catch(async () => ({ ok: true, status: r.status }));
      return NextResponse.json(data);
    }

    // Fallback mock when APPLY_ENDPOINT is not configured
    return NextResponse.json({ ok: true, echoed: payload });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'failed' },
      { status: 500 }
    );
  }
}
