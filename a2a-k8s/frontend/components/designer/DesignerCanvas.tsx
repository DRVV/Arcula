"use client";

import React, { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Connection,
  NodeChange,
  EdgeChange,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useTopologyStore } from "../../store/topology";
import AgentNode from "./AgentNode";
const nodeTypes = { agent: AgentNode };

function CanvasInner() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rf = useReactFlow();

  const nodes = useTopologyStore((s) => s.nodes);
  const edges = useTopologyStore((s) => s.edges);
  const onConnectStore = useTopologyStore((s) => s.onConnect);
  const onNodesChangeStore = useTopologyStore((s) => s.onNodesChange);
  const onEdgesChangeStore = useTopologyStore((s) => s.onEdgesChange);
  const addNode = useTopologyStore((s) => s.addNode);
  const setSelected = useTopologyStore((s) => s.setSelected);


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const templateType = event.dataTransfer.getData("application/reactflow");
      if (!templateType) return;

      const bounds = wrapperRef.current?.getBoundingClientRect();
      const pos = rf.project({
        x: event.clientX - (bounds?.left ?? 0),
        y: event.clientY - (bounds?.top ?? 0),
      });
      addNode(templateType, pos);
    },
    [addNode, rf]
  );

  const onConnect = useCallback(
    (c: Connection) => onConnectStore(c),
    [onConnectStore]
  );
  const onNodesChange = useCallback(
    (ch: NodeChange[]) => onNodesChangeStore(ch),
    [onNodesChangeStore]
  );
  const onEdgesChange = useCallback(
    (ch: EdgeChange[]) => onEdgesChangeStore(ch),
    [onEdgesChangeStore]
  );

  const applyToCluster = useTopologyStore((s) => s.applyToCluster);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 8px" }}>
        <button
          onClick={() => applyToCluster()}
          style={{
            fontSize: 12,
            padding: "6px 10px",
            border: "1px solid #2563eb",
            background: "#eff6ff",
            color: "#1d4ed8",
            borderRadius: 6,
            cursor: "pointer",
          }}
          title="Apply topology to cluster"
        >
          Apply
        </button>
      </div>
      <div ref={wrapperRef} style={{ width: "100%", height: "100%" }} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, n) => setSelected(n.id)}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
    </>
  );
}

export default function DesignerCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
