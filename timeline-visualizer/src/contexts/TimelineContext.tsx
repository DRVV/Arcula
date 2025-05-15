'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterState, TimelineEvent } from '@/types/timeline';
import { timelineEvents } from '@/data/timelineEvents';

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

// Define the context type
interface TimelineContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredEvents: TimelineEvent[];
}

// Create the context with a default value
const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

// Provider component to wrap around components that need access to this context
export function TimelineProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    categories: Object.fromEntries(extractCategories().map(cat => [cat, true])), // All categories enabled by default
    minImportance: 1, // Show all importance levels by default
    dateRange: getDateRange(),
    searchQuery: ''
  });

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

  // Pre-filter the events based on current filters
  const filteredEvents = filterEvents(timelineEvents, filters);

  // Provide the context value to children
  return (
    <TimelineContext.Provider value={{ filters, setFilters, filteredEvents }}>
      {children}
    </TimelineContext.Provider>
  );
}

// Custom hook to use the timeline context
export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}

// Export helper functions that might be useful elsewhere
export { extractCategories, getDateRange };
