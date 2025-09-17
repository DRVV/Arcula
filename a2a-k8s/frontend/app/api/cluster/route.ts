import { NextRequest, NextResponse } from 'next/server';
import type { ClusterStatusPayload } from '../../../types/cluster';

// Proxies cluster status to CLUSTER_STATUS_ENDPOINT.
// If not configured, returns a simple mock payload for development.
export async function GET(_req: NextRequest) {
  try {
    const url = process.env.CLUSTER_STATUS_ENDPOINT;

    if (url) {
      const r = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!r.ok) {
        const text = await r.text();
        return NextResponse.json({ error: `upstream ${r.status}: ${text}` }, { status: 502 });
      }
      const data = await r.json();
      return NextResponse.json(data);
    }

    // Fallback mock (for dev, or when env not set)
    const mock: ClusterStatusPayload = {
      pods: [
        {
          id: 'c1/ns1/webapp-abc',
          name: 'webapp-abc',
          namespace: 'ns1',
          status: 'Running',
          cluster: 'c1',
          role: 'webapp',
        },
        {
          id: 'c1/ns1/worker-echo-xyz',
          name: 'worker-echo-xyz',
          namespace: 'ns1',
          status: 'Running',
          cluster: 'c1',
          role: 'echo',
        },
        {
          id: 'c1/ns1/worker-math-123',
          name: 'worker-math-123',
          namespace: 'ns1',
          status: 'Pending',
          cluster: 'c1',
          role: 'math',
        },
        {
          id: 'c2/ns2/coordinator-aaa',
          name: 'coordinator-aaa',
          namespace: 'ns2',
          status: 'Running',
          cluster: 'c2',
          role: 'coordinator',
        },
        {
          id: 'c2/ns2/worker-echo-bbb',
          name: 'worker-echo-bbb',
          namespace: 'ns2',
          status: 'Failed',
          cluster: 'c2',
          role: 'echo',
        },
      ],
    };
    return NextResponse.json(mock);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}
