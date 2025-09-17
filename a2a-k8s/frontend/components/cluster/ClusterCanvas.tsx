"use client";

import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useClusterStore } from "../../store/cluster";

function ClusterInner() {
  const nodes = useClusterStore((s) => s.rfNodes);
  const edges = useClusterStore((s) => s.rfEdges);
  const start = useClusterStore((s) => s.startPolling);
  const stop = useClusterStore((s) => s.stopPolling);
  const lastUpdated = useClusterStore((s) => s.lastUpdated);

  useEffect(() => {
    start(5000);
    return () => stop();
  }, [start, stop]);

  const rfNodes = useMemo(() => nodes, [nodes]);
  const rfEdges = useMemo(() => edges, [edges]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 5,
          fontSize: 11,
          color: "#667085",
          background: "rgba(255,255,255,0.7)",
          padding: "2px 6px",
          borderRadius: 6,
          border: "1px solid #eee",
        }}
        title={lastUpdated ? new Date(lastUpdated).toLocaleString() : "n/a"}
      >
        {lastUpdated ? "updated " + new Date(lastUpdated).toLocaleTimeString() : "…"}
      </div>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function ClusterCanvas() {
  return (
    <ReactFlowProvider>
      <ClusterInner />
    </ReactFlowProvider>
  );
}
