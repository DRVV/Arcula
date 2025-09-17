"use client";

import React, { useMemo } from "react";
import { useTopologyStore } from "../../store/topology";
import type { AgentNodeData } from "../../types/agent";

export default function NodeInspector() {
  const nodes = useTopologyStore((s) => s.nodes);
  const selectedId = useTopologyStore((s) => s.selectedNodeId);
  const updateNodeData = useTopologyStore((s) => s.updateNodeData);
  const removeNode = useTopologyStore((s) => s.removeNode);
  const edges = useTopologyStore((s) => s.edges);

  const node = useMemo(() => nodes.find((n) => n.id === selectedId), [nodes, selectedId]);

  const derivedAgentUrls = useMemo(() => {
    if (!selectedId) return [];
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const targets = edges.filter((e) => e.source === selectedId).map((e) => e.target);
    return Array.from(
      new Set(
        targets.map((tid) => `${origin}/a2a/${tid}/.well-known/agent.json`)
      )
    );
  }, [edges, selectedId]);

  if (!node) {
    return (
      <div style={{ width: 280, paddingLeft: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Inspector</div>
        <div style={{ color: "#666", fontSize: 13 }}>Select a node to edit its properties.</div>
      </div>
    );
  }

  const data = node.data as AgentNodeData;

  return (
    <div style={{ width: 280, paddingLeft: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Inspector</div>
        <button
          onClick={() => removeNode(node.id)}
          style={{
            fontSize: 12,
            padding: "4px 8px",
            border: "1px solid #e11d48",
            background: "#fff1f2",
            color: "#9f1239",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <label style={{ fontSize: 12, color: "#374151" }}>
          Label
          <input
            value={data.label || ""}
            onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
            }}
          />
        </label>

        <label style={{ fontSize: 12, color: "#374151" }}>
          Role
          <select
            value={String(data.role || "worker")}
            onChange={(e) => updateNodeData(node.id, { role: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
              background: "#fff",
            }}
          >
            <option value="coordinator">coordinator</option>
            <option value="worker">worker</option>
            <option value="tool">tool</option>
          </select>
        </label>

        <label style={{ fontSize: 12, color: "#374151" }}>
          System Prompt
          <textarea
            value={data.prompt || ""}
            onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
            rows={8}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginTop: 4,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: 12,
            }}
            placeholder="Describe the behavior for this agent..."
          />
        </label>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>MCP Servers</div>
          {(data.mcpServers || []).map((url, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              <input
                value={url}
                onChange={(e) => {
                  const next = [...(data.mcpServers || [])];
                  next[i] = e.target.value;
                  updateNodeData(node.id, { mcpServers: next });
                }}
                placeholder="https://example.com/.well-known/mcp.json"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                }}
              />
              <button
                onClick={() => {
                  const next = (data.mcpServers || []).filter((_, idx) => idx !== i);
                  updateNodeData(node.id, { mcpServers: next });
                }}
                style={{
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  background: "#fff",
                  cursor: "pointer",
                }}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const next = [ ...(data.mcpServers || []), "" ];
              updateNodeData(node.id, { mcpServers: next });
            }}
            style={{
              fontSize: 12,
              padding: "6px 8px",
              border: "1px solid #ddd",
              background: "#f9fafb",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            + Add server
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>Derived Agent Links</div>
          <div style={{ display: "grid", gap: 4 }}>
            {derivedAgentUrls.length === 0 ? (
              <div style={{ color: "#6b7280", fontSize: 12 }}>No outgoing links.</div>
            ) : (
              derivedAgentUrls.map((u, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    padding: "6px 8px",
                    wordBreak: "break-all",
                  }}
                >
                  {u}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
