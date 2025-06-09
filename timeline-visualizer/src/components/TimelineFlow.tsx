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
import DateLabelNode from './DateLabelNode';
import TimelineAnchorNode from './TimelineAnchorNode';
import { TimelineBackboneEdge, ConnectorEdge, TimelineMarkerEdge } from './TimelineEdge';
import { useTimeline } from '@/contexts/TimelineContext';
import TimelineControls from './TimelineControls';
import { format } from 'date-fns';
import { TIMELINE_LAYOUT } from '@/config/timelineLayout';

// Register custom node types
const nodeTypes: NodeTypes = {
  timelineEvent: EventNode,
  dateLabel: DateLabelNode,
  timelineAnchor: TimelineAnchorNode,
};

// Register custom edge types
const edgeTypes = {
  timelineBackbone: TimelineBackboneEdge,
  connector: ConnectorEdge,
  timelineMarker: TimelineMarkerEdge,
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
  const edges: Edge[] = [];
  
  // Create timeline anchor nodes for the backbone
  const timelineStartX = TIMELINE_LAYOUT.START_OFFSET;
  const timelineEndX = (sortedEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET;
  const timelineY = TIMELINE_LAYOUT.TIMELINE_Y;
  
  // Start anchor node
  nodes.push({
    id: 'timeline-start',
    type: 'timelineAnchor',
    position: { x: timelineStartX, y: timelineY },
    data: { isStart: true },
    draggable: false,
    selectable: false,
    focusable: false,
  });
  
  // End anchor node
  nodes.push({
    id: 'timeline-end',
    type: 'timelineAnchor',
    position: { x: timelineEndX, y: timelineY },
    data: { isEnd: true },
    draggable: false,
    selectable: false,
    focusable: false,
  });
  
  // Timeline backbone edge
  edges.push({
    id: 'timeline-backbone',
    source: 'timeline-start',
    target: 'timeline-end',
    type: 'timelineBackbone',
    sourceHandle: 'right',
    targetHandle: 'left',
    style: {
      stroke: '#6B7280',
      strokeWidth: 3,
      strokeOpacity: 0.8,
    },
    selectable: false,
    focusable: false,
  });
  
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    
    // Calculate x position with uniform spacing using centralized config
    // Offset by half the balloon width so the center of the balloon aligns with the timeline dot
    const eventX = i * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET - (TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH / 2);
    
    // All balloons at the same Y position (above timeline) using centralized config
    const eventY = TIMELINE_LAYOUT.BALLOON_Y;
    
    // Create event node
    nodes.push({
      id: event.id,
      type: 'timelineEvent',
      position: { x: eventX, y: eventY },
      data: { 
        event,
        minDate,
        maxDate,
        gridScale: (sortedEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET * 2 // total width
      },
      draggable: true,
    });
    
    // Create timeline anchor node for this event (for marker and connector)
    const anchorX = i * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET;
    const anchorId = `timeline-anchor-${event.id}`;
    
    nodes.push({
      id: anchorId,
      type: 'timelineAnchor',
      position: { x: anchorX, y: timelineY },
      data: { eventId: event.id },
      draggable: false,
      selectable: false,
      focusable: false,
    });
    
    // Create connector edge from timeline anchor to event balloon
    edges.push({
      id: `connector-${event.id}`,
      source: anchorId,
      target: event.id,
      type: 'connector',
      sourceHandle: 'top',
      targetHandle: 'bottom',
      style: {
        stroke: '#6B7280',
        strokeWidth: 2,
        strokeOpacity: 0.6,
        strokeDasharray: '5 3',
      },
      selectable: false,
      focusable: false,
    });
    
    // Create timeline marker edge (circle) at the anchor position
    edges.push({
      id: `marker-${event.id}`,
      source: anchorId,
      target: anchorId,
      type: 'timelineMarker',
      style: {
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2,
      },
      selectable: false,
      focusable: false,
    });
    
    // Create corresponding date label node
    const dateLabelX = anchorX;
    const dateLabelY = TIMELINE_LAYOUT.TIMELINE_Y + TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_OFFSET;
    
    nodes.push({
      id: `date-${event.id}`,
      type: 'dateLabel',
      position: { 
        x: dateLabelX - 50, // Center the label (approximate width compensation)
        y: dateLabelY 
      },
      data: {
        date: event.date,
        label: format(event.date, 'MMM yyyy')
      },
      draggable: false,
      selectable: false,
      focusable: false,
    });
  }

  // Create chronological edges connecting events
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

  // Log the created nodes to debug
  console.log(`Created ${nodes.length} nodes and ${edges.length} edges with ReactFlow timeline`);
  
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
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
