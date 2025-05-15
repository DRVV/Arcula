'use client';

import React, { useState, useEffect } from 'react';
import { timelineEvents } from '@/data/timelineEvents';
import { FilterState } from '@/types/timeline';

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

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allCategories = extractCategories();
  
  // Format date to display year only
  const formatYear = (date: Date) => date.getFullYear().toString();
  
  // Toggle a category in the filter
  const toggleCategory = (category: string) => {
    onChange({
      ...filters,
      categories: {
        ...filters.categories,
        [category]: !filters.categories[category]
      }
    });
  };
  
  // Set minimum importance level
  const setMinImportance = (level: number) => {
    onChange({
      ...filters,
      minImportance: level
    });
  };
  
  // Handle search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      searchQuery: e.target.value
    });
  };
  
  // Toggle panel open/closed
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={`fixed left-0 top-20 z-40 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-3rem)]'}`}>
      {/* Toggle Button */}
      <button 
        onClick={togglePanel}
        className="absolute right-0 top-0 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-r-lg shadow-lg transition-colors"
        style={{ width: '3rem', height: '3.5rem' }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        )}
      </button>
      
      {/* Filter Panel */}
      <div className="glass-panel w-72 p-4 rounded-r-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-center cyber-gradient bg-clip-text text-transparent">
          Timeline Filters
        </h2>
        
        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Search</label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search events..."
            className="w-full bg-gray-800 bg-opacity-50 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Importance Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Minimum Importance</label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setMinImportance(level)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  filters.minImportance === level 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Categories</label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {allCategories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={!!filters.categories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={`cat-${category}`} className="ml-2 text-sm text-gray-300 capitalize">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Clear Filters */}
        <button
          onClick={() => onChange({
            categories: Object.fromEntries(allCategories.map(cat => [cat, true])),
            minImportance: 1,
            dateRange: getDateRange(),
            searchQuery: ''
          })}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
