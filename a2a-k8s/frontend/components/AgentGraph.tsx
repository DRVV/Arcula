"use client";

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

export default function AgentGraph() {
  const nodes = useMemo(
    () => [
      { id: 'coordinator', position: { x: 50, y: 50 }, data: { label: 'Coordinator' }, type: 'input' },
      { id: 'echo', position: { x: 280, y: 10 }, data: { label: 'Echo' } },
      { id: 'math', position: { x: 280, y: 90 }, data: { label: 'Math' } },
    ],
    []
  );

  const edges = useMemo(
    () => [
      { id: 'e1', source: 'coordinator', target: 'echo', label: 'A2A' },
      { id: 'e2', source: 'coordinator', target: 'math', label: 'A2A' },
    ],
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

