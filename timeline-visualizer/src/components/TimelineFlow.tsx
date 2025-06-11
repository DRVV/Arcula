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
import { TimelineBackboneEdge, ConnectorEdge, TimelineMarkerEdge, ScenarioBranchEdge, ScenarioBackboneEdge, BranchPointMarkerEdge } from './TimelineEdge';
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
  scenarioBranch: ScenarioBranchEdge,
  scenarioBackbone: ScenarioBackboneEdge,
  branchPointMarker: BranchPointMarkerEdge,
};

// Scenario colors
const SCENARIO_COLORS = {
  'quantum-era': '#8B5CF6',
  'satellite-mesh': '#06B6D4',
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

// Function to create nodes and edges from timeline events with branching scenarios
const createNodesAndEdges = (events: TimelineEvent[]): { nodes: Node[]; edges: Edge[]; minDate: Date; maxDate: Date } => {
  // Handle empty events array
  if (events.length === 0) {
    return { nodes: [], edges: [], minDate: new Date(), maxDate: new Date() };
  }
  
  // Sort events by date to maintain chronological order
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find earliest and latest dates for reference
  const minDate = new Date(sortedEvents[0].date);
  const maxDate = new Date(sortedEvents[sortedEvents.length - 1].date);
  
  // Separate events by scenario
  const mainTimelineEvents = sortedEvents.filter(event => !event.scenarioId);
  const quantumEvents = sortedEvents.filter(event => event.scenarioId === 'quantum-era');
  const satelliteEvents = sortedEvents.filter(event => event.scenarioId === 'satellite-mesh');
  
  console.log(`Processing events: ${mainTimelineEvents.length} main, ${quantumEvents.length} quantum, ${satelliteEvents.length} satellite`);

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Layout constants
  const timelineY = TIMELINE_LAYOUT.TIMELINE_Y;
  const quantumTimelineY = timelineY + TIMELINE_LAYOUT.SCENARIO_POSITIONING.QUANTUM_TIMELINE_OFFSET; // Quantum scenario above main timeline
  const satelliteTimelineY = timelineY + TIMELINE_LAYOUT.SCENARIO_POSITIONING.SATELLITE_TIMELINE_OFFSET; // Satellite scenario below main timeline
  
  // Create main timeline backbone
  const timelineStartX = TIMELINE_LAYOUT.START_OFFSET;
  const timelineEndX = (mainTimelineEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET;
  
  // Main timeline anchor nodes
  nodes.push({
    id: 'timeline-start',
    type: 'timelineAnchor',
    position: { x: timelineStartX, y: timelineY },
    data: { isStart: true },
    draggable: false,
    selectable: false,
    focusable: false,
  });
  
  nodes.push({
    id: 'timeline-end',
    type: 'timelineAnchor',
    position: { x: timelineEndX, y: timelineY },
    data: { isEnd: true },
    draggable: false,
    selectable: false,
    focusable: false,
  });
  
  // Main timeline backbone edge
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
  
  // Process main timeline events
  for (let i = 0; i < mainTimelineEvents.length; i++) {
    const event = mainTimelineEvents[i];
    const eventX = i * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET - (TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH / 2);
    const eventY = TIMELINE_LAYOUT.BALLOON_Y;
    const anchorX = i * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET;
    const anchorId = `timeline-anchor-${event.id}`;
    
    // Create event node
    nodes.push({
      id: event.id,
      type: 'timelineEvent',
      position: { x: eventX, y: eventY },
      data: { 
        event,
        minDate,
        maxDate,
        gridScale: (mainTimelineEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET * 2
      },
      draggable: true,
    });
    
    // Create timeline anchor
    nodes.push({
      id: anchorId,
      type: 'timelineAnchor',
      position: { x: anchorX, y: timelineY },
      data: { eventId: event.id },
      draggable: false,
      selectable: false,
      focusable: false,
    });
    
    // Create connector edge
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
    
    // Create marker - use branch point marker for branch events
    const markerType = event.branchPoint ? 'branchPointMarker' : 'timelineMarker';
    edges.push({
      id: `marker-${event.id}`,
      source: anchorId,
      target: anchorId,
      type: markerType,
      style: {
        fill: event.branchPoint ? '#F59E0B' : '#3B82F6',
        stroke: event.branchPoint ? '#D97706' : '#1E40AF',
        strokeWidth: 2,
      },
      selectable: false,
      focusable: false,
    });
    
    // Create date label
    const dateLabelY = timelineY + TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_OFFSET;
    nodes.push({
      id: `date-${event.id}`,
      type: 'dateLabel',
      position: { 
        x: anchorX - 50,
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
  
  // Find branch point for scenario connections
  const branchPoint = mainTimelineEvents.find(event => event.branchPoint);
  const branchPointIndex = branchPoint ? mainTimelineEvents.indexOf(branchPoint) : -1;
  const branchPointX = branchPointIndex >= 0 ? branchPointIndex * TIMELINE_LAYOUT.UNIFORM_SPACING + TIMELINE_LAYOUT.START_OFFSET : 0;
  
  // Process Quantum scenario events
  if (quantumEvents.length > 0) {
    const quantumStartX = branchPointX + TIMELINE_LAYOUT.UNIFORM_SPACING;
    const quantumEndX = quantumStartX + (quantumEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING;
    
    // Quantum timeline anchors
    nodes.push({
      id: 'quantum-start',
      type: 'timelineAnchor',
      position: { x: quantumStartX, y: quantumTimelineY },
      data: { isStart: true, scenarioId: 'quantum-era' },
      draggable: false,
      selectable: false,
      focusable: false,
    });
    
    nodes.push({
      id: 'quantum-end',
      type: 'timelineAnchor',
      position: { x: quantumEndX, y: quantumTimelineY },
      data: { isEnd: true, scenarioId: 'quantum-era' },
      draggable: false,
      selectable: false,
      focusable: false,
    });
    
    // Quantum scenario backbone
    edges.push({
      id: 'quantum-backbone',
      source: 'quantum-start',
      target: 'quantum-end',
      type: 'scenarioBackbone',
      data: { scenarioColor: SCENARIO_COLORS['quantum-era'] },
      selectable: false,
      focusable: false,
    });
    
    // Branch connection from main timeline to quantum scenario
    if (branchPoint) {
      edges.push({
        id: 'branch-to-quantum',
        source: `timeline-anchor-${branchPoint.id}`,
        target: 'quantum-start',
        type: 'scenarioBranch',
        data: { scenarioColor: SCENARIO_COLORS['quantum-era'] },
        selectable: false,
        focusable: false,
      });
    }
    
    // Process quantum events
    for (let i = 0; i < quantumEvents.length; i++) {
      const event = quantumEvents[i];
      const eventX = quantumStartX + i * TIMELINE_LAYOUT.UNIFORM_SPACING - (TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH / 2);
      const eventY = quantumTimelineY - TIMELINE_LAYOUT.SCENARIO_POSITIONING.EVENT_BALLOON_OFFSET; // Above quantum timeline
      const anchorX = quantumStartX + i * TIMELINE_LAYOUT.UNIFORM_SPACING;
      const anchorId = `quantum-anchor-${event.id}`;
      
      // Create quantum event node
      nodes.push({
        id: event.id,
        type: 'timelineEvent',
        position: { x: eventX, y: eventY },
        data: { 
          event,
          minDate,
          maxDate,
          gridScale: quantumEndX - quantumStartX + TIMELINE_LAYOUT.START_OFFSET * 2
        },
        draggable: true,
        style: { borderColor: SCENARIO_COLORS['quantum-era'] },
      });
      
      // Create quantum anchor
      nodes.push({
        id: anchorId,
        type: 'timelineAnchor',
        position: { x: anchorX, y: quantumTimelineY },
        data: { eventId: event.id, scenarioId: 'quantum-era' },
        draggable: false,
        selectable: false,
        focusable: false,
      });
      
      // Create quantum connector
      edges.push({
        id: `connector-${event.id}`,
        source: anchorId,
        target: event.id,
        type: 'connector',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        style: {
          stroke: SCENARIO_COLORS['quantum-era'],
          strokeWidth: 2,
          strokeOpacity: 0.6,
          strokeDasharray: '5 3',
        },
        selectable: false,
        focusable: false,
      });
      
      // Create quantum marker
      edges.push({
        id: `marker-${event.id}`,
        source: anchorId,
        target: anchorId,
        type: 'timelineMarker',
        style: {
          fill: SCENARIO_COLORS['quantum-era'],
          stroke: SCENARIO_COLORS['quantum-era'],
          strokeWidth: 2,
        },
        selectable: false,
        focusable: false,
      });
      
      // Create date label for quantum events
      const quantumDateLabelY = quantumTimelineY + TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_OFFSET;
      nodes.push({
        id: `date-${event.id}`,
        type: 'dateLabel',
        position: { 
          x: anchorX - 50,
          y: quantumDateLabelY 
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
  }
  
  // Process Satellite scenario events
  if (satelliteEvents.length > 0) {
    const satelliteStartX = branchPointX + TIMELINE_LAYOUT.UNIFORM_SPACING;
    const satelliteEndX = satelliteStartX + (satelliteEvents.length - 1) * TIMELINE_LAYOUT.UNIFORM_SPACING;
    
    // Satellite timeline anchors
    nodes.push({
      id: 'satellite-start',
      type: 'timelineAnchor',
      position: { x: satelliteStartX, y: satelliteTimelineY },
      data: { isStart: true, scenarioId: 'satellite-mesh' },
      draggable: false,
      selectable: false,
      focusable: false,
    });
    
    nodes.push({
      id: 'satellite-end',
      type: 'timelineAnchor',
      position: { x: satelliteEndX, y: satelliteTimelineY },
      data: { isEnd: true, scenarioId: 'satellite-mesh' },
      draggable: false,
      selectable: false,
      focusable: false,
    });
    
    // Satellite scenario backbone
    edges.push({
      id: 'satellite-backbone',
      source: 'satellite-start',
      target: 'satellite-end',
      type: 'scenarioBackbone',
      data: { scenarioColor: SCENARIO_COLORS['satellite-mesh'] },
      selectable: false,
      focusable: false,
    });
    
    // Branch connection from main timeline to satellite scenario
    if (branchPoint) {
      edges.push({
        id: 'branch-to-satellite',
        source: `timeline-anchor-${branchPoint.id}`,
        target: 'satellite-start',
        type: 'scenarioBranch',
        data: { scenarioColor: SCENARIO_COLORS['satellite-mesh'] },
        selectable: false,
        focusable: false,
      });
    }
    
    // Process satellite events
    for (let i = 0; i < satelliteEvents.length; i++) {
      const event = satelliteEvents[i];
      const eventX = satelliteStartX + i * TIMELINE_LAYOUT.UNIFORM_SPACING - (TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH / 2);
      const eventY = satelliteTimelineY - TIMELINE_LAYOUT.SCENARIO_POSITIONING.EVENT_BALLOON_OFFSET; // Above satellite timeline (FIXED)
      const anchorX = satelliteStartX + i * TIMELINE_LAYOUT.UNIFORM_SPACING;
      const anchorId = `satellite-anchor-${event.id}`;
      
      // Create satellite event node
      nodes.push({
        id: event.id,
        type: 'timelineEvent',
        position: { x: eventX, y: eventY },
        data: { 
          event,
          minDate,
          maxDate,
          gridScale: satelliteEndX - satelliteStartX + TIMELINE_LAYOUT.START_OFFSET * 2
        },
        draggable: true,
        style: { borderColor: SCENARIO_COLORS['satellite-mesh'] },
      });
      
      // Create satellite anchor
      nodes.push({
        id: anchorId,
        type: 'timelineAnchor',
        position: { x: anchorX, y: satelliteTimelineY },
        data: { eventId: event.id, scenarioId: 'satellite-mesh' },
        draggable: false,
        selectable: false,
        focusable: false,
      });
      
      // Create satellite connector
      edges.push({
        id: `connector-${event.id}`,
        source: anchorId,
        target: event.id,
        type: 'connector',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        style: {
          stroke: SCENARIO_COLORS['satellite-mesh'],
          strokeWidth: 2,
          strokeOpacity: 0.6,
          strokeDasharray: '5 3',
        },
        selectable: false,
        focusable: false,
      });
      
      // Create satellite marker
      edges.push({
        id: `marker-${event.id}`,
        source: anchorId,
        target: anchorId,
        type: 'timelineMarker',
        style: {
          fill: SCENARIO_COLORS['satellite-mesh'],
          stroke: SCENARIO_COLORS['satellite-mesh'],
          strokeWidth: 2,
        },
        selectable: false,
        focusable: false,
      });
      
      // Create date label for satellite events
      const satelliteDateLabelY = satelliteTimelineY + TIMELINE_LAYOUT.TYPOGRAPHY.DATE_LABEL_OFFSET;
      nodes.push({
        id: `date-${event.id}`,
        type: 'dateLabel',
        position: { 
          x: anchorX - 50,
          y: satelliteDateLabelY 
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
  }

  console.log(`Created ${nodes.length} nodes and ${edges.length} edges with branching scenarios`);
  
  return { nodes, edges, minDate, maxDate };
};

interface TimelineFlowProps {
  controlsVisible: boolean;
}

// The main timeline visualization component
const TimelineFlowInner = ({ controlsVisible }: TimelineFlowProps) => {
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
      console.log(`  - ${event.title} (${event.category.join(', ')}) ${event.scenarioId ? `[${event.scenarioId}]` : '[main]'}`);
    });
    
    const { nodes, edges, minDate, maxDate } = createNodesAndEdges(filteredEvents);
    console.log(`🎨 TimelineFlow: Created ${nodes.length} nodes and ${edges.length} edges`);
    
    setNodes(nodes);
    setEdges(edges);
    setTimeRange({ minDate, maxDate, gridScale: 10000 });
  }, [filteredEvents]);
  
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
        <MiniMap 
          className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-none shadow-lg rounded-lg"
          nodeColor={(node: Node) => {
            const event = (node.data as any)?.event;
            if (event?.scenarioId === 'quantum-era') return SCENARIO_COLORS['quantum-era'];
            if (event?.scenarioId === 'satellite-mesh') return SCENARIO_COLORS['satellite-mesh'];
            
            const importance = event?.importance;
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
        {controlsVisible && (
          <Panel position="top-right">
            <TimelineControls />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

// Wrap with provider to use React Flow hooks
export default function TimelineFlow({ controlsVisible }: TimelineFlowProps) {
  return (
    <ReactFlowProvider>
      <TimelineFlowInner controlsVisible={controlsVisible} />
    </ReactFlowProvider>
  );
}
