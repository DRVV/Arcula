'use client';

import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { 
  ReactFlow,
  Controls,
  Edge,
  Node,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  MiniMap,
  Panel,
  BackgroundVariant,
  PanelPosition,
  useViewport,
  useStore
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TimelineEvent } from '@/types/timeline';
import EventNode from './EventNode';
import { useTimeline } from '@/contexts/TimelineContext';
import { timelineEvents } from '@/data/timelineEvents';
import { format } from 'date-fns';

// Register custom node types
const nodeTypes: NodeTypes = {
  timelineEvent: EventNode,
};


// Helper function to get the first day of a month
const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Helper function to add months to a date
const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Helper function to format a date as YYYY-MM
const formatYearMonth = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Custom TimeGrid component that integrates with ReactFlow's transformation system
const TimeGrid = ({ 
  minDate, 
  maxDate, 
  gridScale,
}: { 
  minDate: Date, 
  maxDate: Date, 
  gridScale: number,
}) => {
  // Use React Flow's transform store values directly
  const { zoom, x, y } = useViewport();
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight); // Initialize with window height
  const gridRef = useRef<HTMLDivElement>(null);
  const timeRange = maxDate.getTime() - minDate.getTime();
  
  // Update viewport height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      // Use the height of the ReactFlow viewport if available, otherwise window height
      const rfViewport = gridRef.current?.closest('.react-flow__viewport');
      setViewportHeight(rfViewport ? rfViewport.clientHeight : window.innerHeight);
    };
    
    updateHeight(); // Initial call
    
    // Debounce resize listener for performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeight, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate visibility thresholds based on zoom
  const showMonths = zoom >= 0.3; // Show months at a lower zoom level
  const showYearLabels = zoom >= 0.1; // Show year labels earlier
  
  // Adjust opacity based on zoom
  const yearOpacity = Math.min(0.8, zoom * 0.8); // Make years more prominent
  const monthOpacity = Math.min(0.6, zoom * 0.5); // Adjust month opacity
  
  // Calculate range of years based on current viewport
  const viewportStartDate = minDate.getTime();
  const viewportEndDate = maxDate.getTime();
  const startYear = new Date(viewportStartDate).getFullYear();
  const endYear = new Date(viewportEndDate).getFullYear();
  
  return (
    <div 
      ref={gridRef}
      className="react-flow__grid-pane" 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        // This is crucial: apply the same transform as ReactFlow's pane
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
        transformOrigin: '0 0',
      }}
    >
      <svg 
        width={gridScale} 
        height={viewportHeight / zoom} // Adjust SVG height based on zoom
        className="react-flow__grid"
        style={{ 
          position: 'absolute', 
          top: 0,
          left: 0,
          overflow: 'visible' // Allow labels to be visible outside SVG bounds
        }}
      >
        {/* Year lines */}
        {Array.from({ length: endYear - startYear + 1 }, (_, i) => {
          const year = startYear + i;
          const yearDate = new Date(year, 0, 1);
          if (yearDate < minDate) return null;
          
          const xPos = ((yearDate.getTime() - minDate.getTime()) / timeRange) * gridScale;
          
          return (
            <g key={`year-${year}`}>
              <line 
                x1={xPos} 
                y1={0} 
                x2={xPos} 
                y2={viewportHeight / zoom} // Line fills the adjusted SVG height
                stroke="#4B5563" 
                strokeWidth={2 / zoom} 
                strokeOpacity={yearOpacity}
              />
              {/* Year marker - fixed position at bottom of graph */}
              {showYearLabels && (
                <g>
                  {/* Year label with background rectangle for better visibility */}
                  <rect
                    x={xPos - (1 / zoom)}
                    y={viewportHeight / zoom - (25 / zoom)}
                    width={30 / zoom}
                    height={16 / zoom}
                    rx={3 / zoom}
                    fill="#0F172A"
                    fillOpacity={0.7}
                  />
                  <text 
                    x={xPos + (5 / zoom)} 
                    y={viewportHeight / zoom - (13 / zoom)}
                    fontSize={12 / zoom} 
                    fill="#FFFFFF" 
                    fontWeight="bold"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                    textAnchor="start"
                  >
                    {year}
                  </text>
                </g>
              )}
              
              {/* Month lines for this year */}
              {showMonths && Array.from({ length: 12 }, (_, j) => {
                const month = j;
                const monthDate = new Date(year, month, 1);
                if (monthDate < minDate || monthDate > maxDate) return null;
                
                const monthXPos = ((monthDate.getTime() - minDate.getTime()) / timeRange) * gridScale;
                
                return (
                  <g key={`month-${year}-${month}`}>
                    <line 
                      x1={monthXPos} 
                      y1={0} 
                      x2={monthXPos} 
                      y2={viewportHeight / zoom} 
                      stroke="#374151" 
                      strokeWidth={1 / zoom} 
                      strokeOpacity={monthOpacity}
                    />
                    {/* Month labels removed */}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Function to create nodes and edges from timeline events
const createNodesAndEdges = (events: TimelineEvent[]): { nodes: Node[]; edges: Edge[]; minDate: Date; maxDate: Date } => {
  // Handle empty events array
  if (events.length === 0) {
    return { nodes: [], edges: [], minDate: new Date(), maxDate: new Date() };
  }
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find earliest and latest dates for scaling
  const minDate = new Date(sortedEvents[0].date);
  // Add buffer months at the beginning and end
  minDate.setMonth(minDate.getMonth() - 3);
  
  const maxDate = new Date(sortedEvents[sortedEvents.length - 1].date);
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  const timeRange = maxDate.getTime() - minDate.getTime();
  const gridScale = 10000; // Total width of the timeline in pixels
  
  // Log the events to make sure they're being filtered correctly
  console.log(`Processing ${sortedEvents.length} events from ${minDate.toISOString()} to ${maxDate.toISOString()}`);

  // Position nodes based on their exact dates
  const nodes: Node[] = [];
  const rowAssignments: { [key: string]: number } = {}; // Track which rows are used for each month
  
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    
    // Calculate x position based on exact date
    const x = ((event.date.getTime() - minDate.getTime()) / timeRange) * gridScale;
    
    // Group events by year-month for vertical positioning
    const yearMonth = formatYearMonth(event.date);
    
    // Assign row based on how many events are already in this month
    if (!rowAssignments[yearMonth]) {
      rowAssignments[yearMonth] = 0;
    }
    
    const row = rowAssignments[yearMonth] % 2;
    rowAssignments[yearMonth]++;
    
    // Y position alternates between two rows
    const y = 200 + row * 150;
    
    nodes.push({
      id: event.id,
      type: 'timelineEvent',
      position: { x, y },
      data: { 
        event,
        minDate,
        maxDate,
        gridScale
      },
      draggable: false,
    });
  }

  // Log the created nodes to debug
  console.log(`Created ${nodes.length} nodes with time-based positioning`);
  
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

// Timeline controls component with zoom indicator
const TimelineControls = () => {
  const { fitView, zoomTo } = useReactFlow();
  const { zoom } = useViewport();
  
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, includeHiddenNodes: false });
  }, [fitView]);

  // Determine visible details based on zoom level
  const getZoomDetails = () => {
    if (zoom >= 0.3) return "Years & Month gridlines";
    return "Years only";
  };
  
  return (
    <div className="p-3 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg">
      <h3 className="text-white text-sm font-medium mb-2">Timeline Controls</h3>
      
      {/* Zoom indicator */}
      <div className="mb-3 text-xs">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-400">Zoom level:</span>
          <span className="text-white font-mono bg-gray-800 px-2 py-0.5 rounded">
            {zoom.toFixed(2)}x
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Showing:</span>
          <span className="text-blue-400">{getZoomDetails()}</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button 
          onClick={handleFitView}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Fit View
        </button>
        <button 
          onClick={() => zoomTo(1)}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Reset Zoom
        </button>
        <div className="grid grid-cols-3 gap-1 mt-2">
          <button 
            onClick={() => zoomTo(0.2)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors"
          >
            0.2x
          </button>
          <button 
            onClick={() => zoomTo(0.5)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors"
          >
            0.5x
          </button>
          <button 
            onClick={() => zoomTo(2)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors"
          >
            2x
          </button>
        </div>
      </div>
    </div>
  );
};

  // The main timeline visualization component
const TimelineFlowInner = () => {
  const reactFlowInstance = useReactFlow();
  const { x, y, zoom } = useViewport();
  const { filteredEvents } = useTimeline();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [timeRange, setTimeRange] = useState<{ minDate: Date, maxDate: Date, gridScale: number }>({
    minDate: new Date(1970, 0, 1),
    maxDate: new Date(2025, 0, 1),
    gridScale: 10000
  });
  
  // Create nodes/edges whenever filteredEvents changes
  useEffect(() => {
    const { nodes, edges, minDate, maxDate } = createNodesAndEdges(filteredEvents);
    setNodes(nodes);
    setEdges(edges);
    setTimeRange({ minDate, maxDate, gridScale: 10000 });
  }, [filteredEvents]);
  
  // Init and position nodes in view without changing zoom
  useEffect(() => {
    console.log(`Current view has ${nodes.length} nodes`);
    
    // Delay positioning to ensure rendering is complete
    const timer = setTimeout(() => {
      if (reactFlowInstance && nodes.length > 0) {
        console.log("Positioning nodes in view while preserving zoom");
        
        // Get the current viewport zoom level
        const { zoom } = reactFlowInstance.getViewport();
        
        // Use fitView but ensure it respects our desired zoom level
        reactFlowInstance.fitView({
          padding: 0.5,
          includeHiddenNodes: false,
          duration: 800,
          minZoom: zoom, // Don't zoom out further than current zoom
          maxZoom: zoom  // Don't zoom in further than current zoom
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [nodes, reactFlowInstance]);
  
  return (
    <div style={{ width: '100%', height: '100vh' }} className="bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        // Remove fitView prop as it overrides our zoom setting
        // fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        proOptions={{ hideAttribution: true }}
        snapToGrid={false}
        snapGrid={[20, 20]}
        elevateNodesOnSelect={true}
        nodesDraggable={false}
      >
        
        {/* Custom time grid that transforms with viewport */}
        <TimeGrid 
          minDate={timeRange.minDate} 
          maxDate={timeRange.maxDate} 
          gridScale={timeRange.gridScale}
        />
        {/* <Controls className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-none shadow-lg rounded-lg" /> */}
        <MiniMap 
          className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-none shadow-lg rounded-lg"
          nodeColor={(node: any) => {
            const importance = node.data?.event?.importance;
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
