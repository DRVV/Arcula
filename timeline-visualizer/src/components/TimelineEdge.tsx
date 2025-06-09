'use client';

import React from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

// Custom edge for the main horizontal timeline
export const TimelineBackboneEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          stroke: '#6B7280',
          strokeWidth: 3,
          strokeOpacity: 0.8,
          ...style,
        }}
        className="react-flow__edge-path"
        d={`M ${sourceX},${sourceY} L ${targetX},${targetY}`}
        markerEnd={markerEnd}
      />
    </>
  );
};

// Custom edge for vertical connector lines from timeline to event balloons
export const ConnectorEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  return (
    <>
      <path
        id={id}
        style={{
          stroke: '#6B7280',
          strokeWidth: 2,
          strokeOpacity: 0.6,
          strokeDasharray: '5 3',
          ...style,
        }}
        className="react-flow__edge-path"
        d={`M ${sourceX},${sourceY} L ${targetX},${targetY}`}
        markerEnd={markerEnd}
      />
    </>
  );
};

// Custom edge for event markers (circles) on the timeline
export const TimelineMarkerEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}) => {
  // Calculate the midpoint for the marker
  const markerX = (sourceX + targetX) / 2;
  const markerY = (sourceY + targetY) / 2;

  return (
    <>
      {/* Invisible path for ReactFlow edge system */}
      <path
        id={id}
        style={{ stroke: 'transparent', strokeWidth: 1 }}
        className="react-flow__edge-path"
        d={`M ${sourceX},${sourceY} L ${targetX},${targetY}`}
      />
      {/* Visible marker circle */}
      <circle
        cx={markerX}
        cy={markerY}
        r={6}
        fill="#3B82F6"
        stroke="#1E40AF"
        strokeWidth={2}
        style={style}
      />
    </>
  );
};
