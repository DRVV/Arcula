'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FilterState, TimelineEvent } from '@/types/timeline';
import { timelineEvents as initialTimelineEvents } from '@/data/timelineEvents';
import { useChatMessages } from './ChatContext';

// Extract all unique categories from timeline events
const extractCategories = (events: TimelineEvent[]) => {
  const categories = new Set<string>();
  events.forEach(event => {
    event.category.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
};

// Get date range from timeline events
const getDateRange = (events: TimelineEvent[]) => {
  if (events.length === 0) {
    return [new Date(), new Date()] as [Date, Date];
  }
  const dates = events.map(event => event.date.getTime());
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
  allEvents: TimelineEvent[];
  addEvents: (newEvents: TimelineEvent[]) => void;
}

// Create the context with a default value
const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

// Provider component to wrap around components that need access to this context
export function TimelineProvider({ children }: { children: ReactNode }) {
  const [allEvents, setAllEvents] = useState<TimelineEvent[]>(initialTimelineEvents);
  const messages = useChatMessages();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: Object.fromEntries(extractCategories(initialTimelineEvents).map(cat => [cat, true])), // All categories enabled by default
    minImportance: 1, // Show all importance levels by default
    dateRange: getDateRange(initialTimelineEvents),
    searchQuery: ''
  });
  
  // Function to add new events to the timeline
  const addEvents = (newEvents: TimelineEvent[]) => {
    if (!newEvents || newEvents.length === 0) return;
    
    setAllEvents(prev => {
      // Filter out any events with duplicate IDs
      const existingIds = new Set(prev.map(e => e.id));
      const filteredNewEvents = newEvents.filter(
        e => !existingIds.has(e.id)
      );
      
      // Log how many new events we're adding
      if (filteredNewEvents.length > 0) {
        console.log(`Adding ${filteredNewEvents.length} new events to timeline`);
      }
      
      return [...prev, ...filteredNewEvents];
    });
  };
  
  // Listen for new generated events from messages
  useEffect(() => {
    if (messages) {
      // Get the latest message with generated events
      const latestMessageWithEvents = [...messages]
        .reverse()
        .find(msg => msg.sender === 'bot' && msg.generatedEvents && msg.generatedEvents.length > 0);
      
      if (latestMessageWithEvents?.generatedEvents) {
        addEvents(latestMessageWithEvents.generatedEvents);
        
        // Also update filters to show only the new categories
        if (latestMessageWithEvents.generatedEvents.length > 0) {
          // Get all unique categories from generated events
          const categoriesToShow = new Set<string>();
          latestMessageWithEvents.generatedEvents.forEach(event => {
            event.category.forEach(cat => categoriesToShow.add(cat));
          });
          
          // Update filters to show the categories of generated events
          setFilters(prevFilters => {
            // Create updated categories object that includes any new categories
            const updatedCategories = { ...prevFilters.categories };
            
            // Set all existing categories to false initially
            Object.keys(updatedCategories).forEach(cat => {
              updatedCategories[cat] = false;
            });
            
            // Enable categories from generated events
            categoriesToShow.forEach(cat => {
              updatedCategories[cat] = true;
            });
            
            return {
              ...prevFilters,
              categories: updatedCategories
            };
          });
        }
      }
    }
  }, [messages]);

  // Update categories and date range when events change
  useEffect(() => {
    // Extract all categories from current events
    const allCategories = extractCategories(allEvents);
    
    // Update filters to include new categories
    setFilters(prevFilters => {
      const updatedCategories = { ...prevFilters.categories };
      
      // Add any new categories
      allCategories.forEach(cat => {
        if (updatedCategories[cat] === undefined) {
          updatedCategories[cat] = true;
        }
      });
      
      return {
        ...prevFilters,
        categories: updatedCategories,
        dateRange: getDateRange(allEvents)
      };
    });
  }, [allEvents]);
  
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
  const filteredEvents = filterEvents(allEvents, filters);

  // Provide the context value to children
  return (
    <TimelineContext.Provider value={{ 
      filters, 
      setFilters, 
      filteredEvents, 
      allEvents,
      addEvents
    }}>
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
