'use client';

import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';

interface TimelineAnchorNodeData {
  isStart?: boolean;
  isEnd?: boolean;
  eventId?: string;
}

// Invisible anchor nodes that serve as connection points for timeline edges
const TimelineAnchorNode: React.FC<NodeProps> = ({
  data,
  id,
}) => {
  return (
    <div
      style={{
        width: 1,
        height: 1,
        background: 'transparent',
        border: 'none',
        position: 'relative',
      }}
    >
      {/* Handles for connecting edges */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ 
          background: 'transparent', 
          border: 'none',
          width: 1,
          height: 1,
          minWidth: 1,
          minHeight: 1,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ 
          background: 'transparent', 
          border: 'none',
          width: 1,
          height: 1,
          minWidth: 1,
          minHeight: 1,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{ 
          background: 'transparent', 
          border: 'none',
          width: 1,
          height: 1,
          minWidth: 1,
          minHeight: 1,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{ 
          background: 'transparent', 
          border: 'none',
          width: 1,
          height: 1,
          minWidth: 1,
          minHeight: 1,
        }}
      />
    </div>
  );
};

export default TimelineAnchorNode;
