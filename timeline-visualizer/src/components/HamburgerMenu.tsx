'use client';

import React, { useState } from 'react';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      
      {/* Menu Popup */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 max-h-[80vh] overflow-y-auto z-50 glass-panel p-4 rounded-lg shadow-2xl bg-gray-900 bg-opacity-95 backdrop-blur-md border border-gray-700">
          <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Timeline Information
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
                <li>Vertical grid lines show months and years</li>
                <li>Events are positioned exactly at their corresponding dates</li>
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
      )}
    </div>
  );
}
