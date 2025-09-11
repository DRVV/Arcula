import { NextRequest, NextResponse } from 'next/server';

// Proxy chat to the webapp `/task` endpoint.
// Expects env TASK_ENDPOINT (e.g., http://localhost:8080/task via kubectl port-forward)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body?.text ?? '').slice(0, 4000);
    const taskUrl = process.env.TASK_ENDPOINT || 'http://localhost:8080/task';

    const r = await fetch(taskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await r.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}
