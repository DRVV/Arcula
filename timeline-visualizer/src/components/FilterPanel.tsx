'use client';

import React, { useState } from 'react';
import { useTimeline, extractCategories, getDateRange } from '@/contexts/TimelineContext';

interface FilterPanelProps {
  inHeader?: boolean;
}

export default function FilterPanel({ inHeader = false }: FilterPanelProps) {
  // Get filters and setter from context
  const { filters, setFilters } = useTimeline();
  
  // Only use isOpen state for sidebar version
  const [isOpen, setIsOpen] = useState(true);
  const allCategories = extractCategories();
  
  // Toggle a category in the filter
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };
  
  // Set minimum importance level
  const setMinImportance = (level: number) => {
    setFilters(prev => ({
      ...prev,
      minImportance: level
    }));
  };
  
  // Handle search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: e.target.value
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      categories: Object.fromEntries(allCategories.map(cat => [cat, true])),
      minImportance: 1,
      dateRange: getDateRange(),
      searchQuery: ''
    });
  };
  
  // Toggle panel open/closed (only for sidebar version)
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Different styling based on location
  const panelClass = inHeader
    ? "glass-panel w-80 p-4 rounded-lg shadow-xl"
    : "glass-panel w-72 p-4 rounded-r-lg shadow-xl"; 
  
  // Render either the sidebar version or the header dropdown version
  if (inHeader) {
    return (
      <div className={panelClass}>
        
        <h2 className="text-lg font-bold mb-4 text-center cyber-gradient bg-clip-text text-transparent">
          Search & Filter
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
                  id={`header-cat-${category}`}
                  checked={!!filters.categories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={`header-cat-${category}`} className="ml-2 text-sm text-gray-300 capitalize">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Clear Filters */}
        <button
          onClick={resetFilters}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }
  
  // Sidebar panel version
  return (
    <div className={`fixed left-0 top-20 z-40 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-3rem)]'}`}>
      {/* Toggle Button */}
      <button 
        onClick={togglePanel}
        className="absolute right-0 top-0 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-r-lg shadow-lg transition-colors flex items-center justify-center"
        style={{ width: '3rem', height: '3.5rem' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 transition-transform duration-300" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Filter Panel */}
      <div className={panelClass}>
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
                  id={`sidebar-cat-${category}`}
                  checked={!!filters.categories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={`sidebar-cat-${category}`} className="ml-2 text-sm text-gray-300 capitalize">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Clear Filters */}
        <button
          onClick={resetFilters}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
