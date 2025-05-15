'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { 
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  MiniMap,
  Panel,
  BackgroundVariant,
  PanelPosition
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TimelineEvent, FilterState } from '@/types/timeline';
import EventNode from './EventNode';
import FilterPanel from './FilterPanel';
import { timelineEvents } from '@/data/timelineEvents';
import { format } from 'date-fns';

// Register custom node types
const nodeTypes: NodeTypes = {
  timelineEvent: EventNode,
};

// Extract all unique categories from timeline events
const extractCategories = () => {
  const categories = new Set<string>();
  timelineEvents.forEach(event => {
    event.category.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};

// Get date range from timeline events
const getDateRange = () => {
  const dates = timelineEvents.map(event => event.date.getTime());
  return [
    new Date(Math.min(...dates)),
    new Date(Math.max(...dates))
  ] as [Date, Date];
};

// Filter events based on filter settings
const filterEvents = (events: TimelineEvent[], filters: FilterState): TimelineEvent[] => {
  return events.filter(event => {
    // Filter by importance
    if (event.importance < filters.minImportance) return false;
    
    // Filter by category
    const hasCategory = event.category.some(cat => filters.categories[cat]);
    if (!hasCategory) return false;
    
    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesDescription = event.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }
    
    return true;
  });
};

// Function to create nodes and edges from timeline events
const createNodesAndEdges = (events: TimelineEvent[], filtered: boolean = false) => {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find earliest and latest dates for scaling
  const earliestDate = sortedEvents[0].date.getTime();
  const latestDate = sortedEvents[sortedEvents.length - 1].date.getTime();
  const timeRange = latestDate - earliestDate;
  
  // Calculate horizontal spacing - map dates to x positions from 0 to 5000
  const xScale = 5000 / timeRange;
  
  // Create nodes
  const nodes: Node[] = sortedEvents.map((event, index) => {
    // Calculate x position based on date
    const x = (event.date.getTime() - earliestDate) * xScale;
    
    // Alternate Y position for better readability with more vertical spacing
    const y = 200 + (index % 3) * 150;
    
    // Adjust size based on importance
    const scale = 0.8 + (event.importance * 0.1);
    
    return {
      id: event.id,
      type: 'timelineEvent',
      position: { x, y },
      data: { event },
      // For styling
      style: {
        transform: `scale(${scale})`,
        zIndex: event.importance,
      },
    };
  });
  
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
  
  return { nodes, edges };
};

// Timeline controls component
const TimelineControls = () => {
  const { fitView, zoomTo } = useReactFlow();
  
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, includeHiddenNodes: false });
  }, [fitView]);
  
  return (
    <div className="p-3 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg">
      <h3 className="text-white text-sm font-medium mb-2">Timeline Controls</h3>
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
      </div>
    </div>
  );
};

// The main timeline visualization component
const TimelineFlowInner = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: Object.fromEntries(extractCategories().map(cat => [cat, true])), // All categories enabled by default
    minImportance: 1, // Show all importance levels by default
    dateRange: getDateRange(),
    searchQuery: ''
  });
  
  // Filter events and create nodes/edges when filters change
  useEffect(() => {
    const filteredEvents = filterEvents(timelineEvents, filters);
    const { nodes, edges } = createNodesAndEdges(filteredEvents, true);
    setNodes(nodes);
    setEdges(edges);
  }, [filters]);
  
  return (
    <div style={{ width: '100%', height: '100vh' }} className="bg-gray-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Filter Panel */}
        <FilterPanel filters={filters} onChange={setFilters} />
        <Background color="#1E293B" variant={BackgroundVariant.Dots} />
        <Controls className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-none shadow-lg rounded-lg" />
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
        />
        <Panel position="top-right">
          <TimelineControls />
        </Panel>
        
        {/* Time period markers */}
        <Panel position="bottom-center" className="w-full flex justify-center px-10 py-2 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
          <div className="flex space-x-12 overflow-x-auto pb-2 max-w-full">
            {timelineEvents
              .filter(event => event.importance >= 4) // Only show major events
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event) => (
              <div key={event.id} className="text-xs text-gray-400 flex flex-col items-center flex-shrink-0">
                <div className="font-mono mb-1">{format(event.date, 'yyyy')}</div>
                <div className="text-white text-xs whitespace-nowrap w-28 text-center">
                  {event.title}
                </div>
              </div>
            ))}
          </div>
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
