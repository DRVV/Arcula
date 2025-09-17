"use client";

import React from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { AgentNodeData } from "../../types/agent";

export default function AgentNode({ data }: NodeProps<AgentNodeData>) {
  const roleColor =
    data.role === "coordinator"
      ? { bg: "#eef2ff", color: "#1e3a8a", border: "#c7d2fe" }
      : { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };

  return (
    <div
      style={{
        border: `1px solid ${roleColor.border}`,
        background: "#fff",
        borderRadius: 8,
        minWidth: 160,
        padding: 8,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontWeight: 700 }}>{data.label || "Agent"}</div>
        <span
          style={{
            fontSize: 11,
            padding: "2px 6px",
            borderRadius: 10,
            background: roleColor.bg,
            color: roleColor.color,
            border: `1px solid ${roleColor.border}`,
          }}
        >
          {data.role}
        </span>
      </div>
      {data.prompt && data.prompt.trim().length > 0 && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#4b5563" }}>
          📝 {data.prompt.slice(0, 64)}
          {data.prompt.length > 64 ? "…" : ""}
        </div>
      )}
    </div>
  );
}
