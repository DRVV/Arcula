"use client";

import { useCallback, useMemo, useState } from 'react';
import ClusterCanvas from '../components/cluster/ClusterCanvas';
import SidebarTemplates from '../components/designer/SidebarTemplates';
import DesignerCanvas from '../components/designer/DesignerCanvas';
import NodeInspector from '../components/designer/NodeInspector';
import Chat from '../components/Chat';

type AgentKey = 'coordinator' | 'echo' | 'math';
type Status = 'idle' | 'busy' | 'done';

interface AgentState {
  status: Status;
  last?: string;
}

const initialState: Record<AgentKey, AgentState> = {
  coordinator: { status: 'idle' },
  echo: { status: 'idle' },
  math: { status: 'idle' },
};

export default function HomePage() {
  const [agents, setAgents] = useState<Record<AgentKey, AgentState>>(initialState);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const setAllBusy = useCallback(() => {
    setAgents((prev) => ({
      coordinator: { ...prev.coordinator, status: 'busy' },
      echo: { ...prev.echo, status: 'busy' },
      math: { ...prev.math, status: 'busy' },
    }));
  }, []);

  const setFromResult = useCallback((data: any) => {
    // Prefer coordinator-provided trace if available
    const trace = data?.result?.meta?.trace as Array<any> | undefined;
    const combined = data?.result?.parts?.[0]?.text as string | undefined;
    if (trace && Array.isArray(trace) && trace.length > 0) {
      setEvents(trace);
      const next: Record<AgentKey, AgentState> = {
        coordinator: { status: 'done', last: combined || 'ok' },
        echo: { status: 'idle' },
        math: { status: 'idle' },
      };
      for (const ev of trace) {
        const { source, target, action, text } = ev || {};
        if (action === 'recv' && (source === 'echo' || source === 'math')) {
          const key = source as 'echo' | 'math';
          next[key] = { status: 'done', last: String(text || '') };
        }
      }
      setAgents(next);
      setTimeout(() => setAgents(initialState), 4000);
      return;
    }
    // Fallback to parsing combined text from older coordinator versions
    setEvents([]);
    const c = combined || '';
    const parts = c.split(' | ').map((p: string) => p.trim());
    const next: Record<AgentKey, AgentState> = {
      coordinator: { status: 'done', last: c },
      echo: { status: 'idle' },
      math: { status: 'idle' },
    };
    for (const p of parts) {
      const match = p.match(/^\[(echo|math)\]\s*(.*)$/i);
      if (match) {
        const key = match[1].toLowerCase() as 'echo' | 'math';
        next[key] = { status: 'done', last: match[2] };
      }
    }
    setAgents(next);
    setTimeout(() => setAgents(initialState), 4000);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setAllBusy();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const combined = data?.result?.parts?.[0]?.text ?? JSON.stringify(data);
      setMessages((m) => [...m, { role: 'agent', text: combined }]);
      setFromResult(data);
    } catch (e: any) {
      const err = e?.message || 'Request failed';
      setMessages((m) => [...m, { role: 'agent', text: `Error: ${err}` }]);
      setAgents(initialState);
    }
  }, [setAllBusy, setFromResult]);


  return (
    <div className="container">
      <div className="top">
        <div className="panel" style={{ minHeight: 360 }}>
          <div className="panel-header">Designer</div>
          <div className="panel-body" style={{ height: 480, padding: 0 }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <SidebarTemplates />
              <div style={{ flex: 1 }}>
                <DesignerCanvas />
              </div>
              <NodeInspector />
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">Cluster Status</div>
          <div className="panel-body" style={{ height: 480 }}>
            <ClusterCanvas />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">Chat</div>
        <div className="panel-body" style={{ height: 150, overflow: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{m.role === 'user' ? 'You' : 'Agent'}:</strong> {m.text}
            </div>
          ))}
        </div>
        <Chat onSend={handleSend} />
      </div>
    </div>
  );
}
