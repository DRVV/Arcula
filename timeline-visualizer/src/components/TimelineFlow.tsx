'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { 
  ReactFlow,
  Edge,
  Node,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  MiniMap,
  Panel,
  useViewport,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TimelineEvent } from '@/types/timeline';
import EventNode from './EventNode';
import { useTimeline } from '@/contexts/TimelineContext';
import TimelineControls from './TimelineControls';
import { format } from 'date-fns';
import { TIMELINE_LAYOUT } from '@/config/timelineLayout';

// Register custom node types
const nodeTypes: NodeTypes = {
  timelineEvent: EventNode,
};


// Helper function to format a date as YYYY-MM
const formatYearMonth = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Utility function to calculate content bounds
const calculateContentBounds = (events: TimelineEvent[]) => {
  if (events.length === 0) return { centerX: 0, centerY: 0, contentWidth: 0, contentHeight: 0 };
  
  // Calculate content bounds using centralized configuration
  const contentWidth = (events.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET * 2;
  const contentHeight = TIMELINE_LAYOUT.CONTENT_HEIGHT;
  
  // Calculate center point
  const centerX = contentWidth / 2;
  const centerY = TIMELINE_LAYOUT.CENTER_Y;
  
  return { centerX, centerY, contentWidth, contentHeight };
};

// Utility function to calculate initial viewport for centering content
const calculateInitialViewport = (
  events: TimelineEvent[], 
  containerWidth: number, 
  containerHeight: number,
  zoom: number = 0.5
) => {
  if (events.length === 0) return { x: 0, y: 0, zoom };
  
  const { centerX, centerY } = calculateContentBounds(events);
  
  // Calculate viewport position to center the content
  const x = (containerWidth / 2) - (centerX * zoom);
  const y = (containerHeight / 2) - (centerY * zoom);
  
  return { x, y, zoom };
};

// Timeline component that renders the horizontal timeline and date labels
const TimelineReference = ({ 
  events,
  uniformSpacing,
  startOffset,
  timelineY
}: { 
  events: TimelineEvent[],
  uniformSpacing: number,
  startOffset: number,
  timelineY: number
}) => {
  const { zoom, x, y } = useViewport();
  
  if (events.length === 0) return null;
  
  const timelineWidth = (events.length - 1) * uniformSpacing + startOffset * 2;
  
  return (
    <div 
      className="react-flow__timeline-reference" 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
        transformOrigin: '0 0',
      }}
    >
      <svg 
        width={timelineWidth} 
        height={600}
        className="react-flow__timeline"
        style={{ 
          position: 'absolute', 
          top: 0,
          left: 0,
          overflow: 'visible'
        }}
      >
        {/* Main horizontal timeline */}
        <line 
          x1={startOffset} 
          y1={timelineY} 
          x2={timelineWidth - startOffset} 
          y2={timelineY}
          stroke="#6B7280" 
          strokeWidth={3 / zoom} 
          strokeOpacity={0.8}
        />
        
        {/* Event markers and date labels */}
        {events.map((event, i) => {
          const xPos = i * uniformSpacing + startOffset;
          
          return (
            <g key={`timeline-${event.id}`}>
              {/* Event marker on timeline */}
              <circle
                cx={xPos}
                cy={timelineY}
                r={6 / zoom}
                fill="#3B82F6"
                stroke="#1E40AF"
                strokeWidth={2 / zoom}
              />
              
              {/* Vertical connector line from timeline to balloon */}
              <line
                x1={xPos}
                y1={timelineY}
                x2={xPos}
                y2={TIMELINE_LAYOUT.BALLOON_Y} // balloon Y position from config
                stroke="#6B7280"
                strokeWidth={2 / zoom}
                strokeOpacity={0.6}
                strokeDasharray={`${5 / zoom} ${3 / zoom}`}
              />
              
              {/* Date label below timeline */}
              <text 
                x={xPos} 
                y={timelineY + (TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_OFFSET / zoom)}
                fontSize={TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_FONT_SIZE / zoom} 
                fill={TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_COLOR} 
                fontWeight={TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_FONT_WEIGHT}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                textAnchor="middle"
              >
                {format(event.date, 'MMM yyyy')}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Function to create nodes and edges from timeline events with equal spacing
const createNodesAndEdges = (events: TimelineEvent[]): { nodes: Node[]; edges: Edge[]; minDate: Date; maxDate: Date } => {
  // Handle empty events array
  if (events.length === 0) {
    return { nodes: [], edges: [], minDate: new Date(), maxDate: new Date() };
  }
  
  // Sort events by date to maintain chronological order
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find earliest and latest dates for reference (not used for positioning)
  const minDate = new Date(sortedEvents[0].date);
  const maxDate = new Date(sortedEvents[sortedEvents.length - 1].date);
  
  // Log the events to make sure they're being filtered correctly
  console.log(`Processing ${sortedEvents.length} events with equal spacing layout`);

  // Position timeline event nodes with equal spacing
  const nodes: Node[] = [];
  
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    
    // Calculate x position with uniform spacing using centralized config
    // Offset by half the balloon width so the center of the balloon aligns with the timeline dot
    const x = i * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET - (TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH / 2);
    
    // All balloons at the same Y position (above timeline) using centralized config
    const y = TIMELINE_LAYOUT.BALLOON_Y;
    
    nodes.push({
      id: event.id,
      type: 'timelineEvent',
      position: { x, y },
      data: { 
        event,
        minDate,
        maxDate,
        gridScale: (sortedEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET * 2 // total width
      },
      draggable: true,
    });
  }

  // Log the created nodes to debug
  console.log(`Created ${nodes.length} nodes with equal spacing`);
  
  // Create edges connecting events chronologically
  const edges: Edge[] = [];
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    edges.push({
      id: `e${sortedEvents[i].id}-${sortedEvents[i + 1].id}`,
      source: sortedEvents[i].id,
      target: sortedEvents[i + 1].id,
      style: { 
        stroke: '#4B5563', 
        strokeWidth: 2, 
        opacity: 0.7 
      },
      type: 'smoothstep',
      animated: true,
    });
  }
  
  return { nodes, edges, minDate, maxDate };
};


  // The main timeline visualization component
const TimelineFlowInner = () => {
  const reactFlowInstance = useReactFlow();
  const { zoom: currentZoom } = useViewport();
  const { filteredEvents } = useTimeline();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [timeRange, setTimeRange] = useState<{ minDate: Date, maxDate: Date, gridScale: number }>({
    minDate: new Date(1970, 0, 1),
    maxDate: new Date(2025, 0, 1),
    gridScale: 10000
  });
  
  // Container dimension detection
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });
  const [initialViewport, setInitialViewport] = useState({ x: 0, y: 0, zoom: 0.5 });
  
  // Detect container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Apply viewport centering when events or container dimensions change
  useEffect(() => {
    if (filteredEvents.length > 0 && containerDimensions.width > 0 && reactFlowInstance) {
      const viewport = calculateInitialViewport(
        filteredEvents,
        containerDimensions.width,
        containerDimensions.height,
        0.5 // desired zoom level
      );
      
      console.log(`🎯 Applying viewport:`, viewport);
      
      // Use setViewport to programmatically center the content
      setTimeout(() => {
        reactFlowInstance.setViewport(viewport, { duration: 0 });
      }, 100);
    }
  }, [filteredEvents, containerDimensions, reactFlowInstance]);
  
  // Create nodes/edges whenever filteredEvents changes
  useEffect(() => {
    console.log(`🎨 TimelineFlow: Creating nodes from ${filteredEvents.length} filtered events`);
    filteredEvents.forEach(event => {
      console.log(`  - ${event.title} (${event.category.join(', ')})`);
    });
    
    const { nodes, edges, minDate, maxDate } = createNodesAndEdges(filteredEvents);
    console.log(`🎨 TimelineFlow: Created ${nodes.length} nodes and ${edges.length} edges`);
    
    setNodes(nodes);
    setEdges(edges);
    setTimeRange({ minDate, maxDate, gridScale: 10000 });
  }, [filteredEvents]);
  
  // Init and position nodes in view without changing zoom
  // useEffect(() => {
  //   // console.log(`Current view has ${nodes.length} nodes`);
    
  //   // Delay positioning to ensure rendering is complete
  //   const timer = setTimeout(() => {
  //     if (reactFlowInstance && nodes.length > 0) {
  //       console.log("Positioning nodes in view while preserving zoom");
        
  //       // Get the current viewport zoom level
  //       const { zoom } = reactFlowInstance.getViewport();
        
  //       // Use fitView but ensure it respects our desired zoom level
  //       reactFlowInstance.fitView({
  //         padding: 0.5,
  //         includeHiddenNodes: false,
  //         duration: 800,
  //         minZoom: zoom, // Don't zoom out further than current zoom
  //         maxZoom: zoom  // Don't zoom in further than current zoom
  //       });
  //     }
  //   }, 500);
    
  //   return () => clearTimeout(timer);
  // }, [nodes, reactFlowInstance]);
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} className="bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={initialViewport}
        proOptions={{ hideAttribution: true }}
        snapToGrid={false}
        snapGrid={[20, 20]}
        elevateNodesOnSelect={true}
        nodesDraggable={true}
        nodesFocusable={true}
        edgesFocusable={false}
        panOnDrag={true}
      >
        
        {/* Timeline reference with equal spacing */}
        <TimelineReference 
          events={filteredEvents}
          uniformSpacing={TIMELINE_LAYOUT.UNIFORM_SPACING}
          startOffset={TIMELINE_LAYOUT.START_OFFSET}
          timelineY={TIMELINE_LAYOUT.TIMELINE_Y}
        />
        {/* <Controls className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-none shadow-lg rounded-lg" /> */}
        <MiniMap 
          className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-none shadow-lg rounded-lg"
          nodeColor={(node: Node) => {
            const importance = (node.data as any)?.event?.importance;
            if (importance === 5) return '#EF4444';
            if (importance === 4) return '#F97316';
            if (importance === 3) return '#EAB308';
            if (importance === 2) return '#22C55E';
            return '#3B82F6';
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          position='bottom-left'
          style={{ height: 120, width: 240 }}
          zoomable
          pannable
        />
        <Panel position="top-right">
          <TimelineControls />
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrap with provider to use React Flow hooks
export default function TimelineFlow() {
  return (
    <ReactFlowProvider>
      <TimelineFlowInner />
    </ReactFlowProvider>
  );
}
// Debug comment
