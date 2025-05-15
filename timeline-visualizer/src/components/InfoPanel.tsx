'use client';

import React, { useState } from 'react';

export default function InfoPanel() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Toggle Button - Always visible */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all mb-2 ${isOpen ? 'rotate-180' : ''}`}
        aria-label={isOpen ? "Close info panel" : "Open info panel"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {/* Info Panel */}
      <div className={`glass-panel w-80 p-4 rounded-lg shadow-2xl max-h-[70vh] overflow-y-auto transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
      }`}>
        <h2 className="text-lg font-bold mb-4 cyber-gradient bg-clip-text text-transparent">
          How to Use This Timeline
        </h2>
        
        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <h3 className="font-semibold text-white mb-1">Navigation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Drag to pan the timeline horizontally or vertically</li>
              <li>Use mouse wheel or pinch gestures to zoom in/out</li>
              <li>Use the minimap in the bottom right to navigate</li>
              <li>Click "Fit View" to see all events</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Events</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click on any event card to expand and see details</li>
              <li>Event border colors indicate importance levels</li>
              <li>Connected events form the chronological timeline</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Filtering</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the filter panel (blue button on left edge) to filter events</li>
              <li>Filter by importance level (1-5)</li>
              <li>Filter by categories (hardware, software, etc.)</li>
              <li>Search for specific events</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Color Guide</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Level 5 (Major)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Level 4</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Level 3</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Level 2</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Level 1 (Minor)</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 italic">
              This timeline visualizes the evolution of mobile devices from the first mobile phone call in 1973 to recent technological advancements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
