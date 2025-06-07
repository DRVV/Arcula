'use client';

import React, { useCallback } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';

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

export default TimelineControls;
