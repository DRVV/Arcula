"use client";

import React from 'react';

type Status = 'idle' | 'busy' | 'done';

export default function TaskStatus({
  agents,
  agentList,
  events,
}: {
  agents: Record<string, { status: Status; last?: string }>;
  agentList: readonly { key: string; label: string }[];
  events?: Array<{ source?: string; target?: string; action?: string; duration_ms?: number; text?: string; rpc?: { request?: any; response?: any } }>;
}) {
  // Determine latest math route (MCP/LLM/Local) from trace events
  let mathTag: string | undefined;
  if (events && events.length > 0) {
    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i] as any;
      if (ev?.source === 'math' && ev?.action === 'recv' && ev?.rpc?.response) {
        const meta = ev.rpc.response?.result?.meta?.math;
        if (meta) {
          if (meta.used_mcp) mathTag = 'MCP';
          else if (meta.route === 'llm') mathTag = 'LLM';
          else if (meta.route === 'fallback_local') mathTag = 'Local';
        }
        break;
      }
    }
  }

  return (
    <div>
      {agentList.map((a) => {
        const st = agents[a.key] || { status: 'idle' };
        return (
          <div className="status-item" key={a.key}>
            <div>
              <div style={{ fontWeight: 600 }}>{a.label}</div>
              {st.last && <div style={{ color: '#555', fontSize: 12 }}>last: {st.last}</div>}
            </div>
            <div>
              <span className={`badge ${st.status}`}>{st.status}</span>
              {a.key === 'math' && mathTag && (
                <span className={`badge route-${mathTag.toLowerCase()}`} style={{ marginLeft: 6 }}>{mathTag}</span>
              )}
            </div>
          </div>
        );
      })}
      {events && events.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Latest Activity</div>
          {(events.slice(-6)).map((ev, i) => {
            const showJson = ev.rpc?.request ?? ev.rpc?.response;
            const jsonStr = showJson ? JSON.stringify(showJson, null, 2) : '';
            return (
              <div key={i} style={{ fontSize: 12, color: '#444', padding: '4px 0' }}>
                <div>
                  {(ev.source || '?')} → {(ev.target || '?')} [{ev.action}]
                  {typeof ev.duration_ms === 'number' ? ` ${ev.duration_ms}ms` : ''}
                  {ev.text ? ` — ${String(ev.text).slice(0, 60)}` : ''}
                </div>
                {showJson && (
                  <details style={{ marginTop: 2 }}>
                    <summary style={{ cursor: 'pointer' }}>View JSON-RPC</summary>
                    <pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 6, overflow: 'auto' }}>
{jsonStr}
                    </pre>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
