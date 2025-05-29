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
        console.log(`📊 Adding ${filteredNewEvents.length} new events to timeline`);
        filteredNewEvents.forEach(event => {
          console.log(`  - ${event.title} (${event.category.join(', ')})`);
        });
        console.log(`📊 Total events after addition: ${prev.length + filteredNewEvents.length}`);
      }
      
      return [...prev, ...filteredNewEvents];
    });
  };
  
  // Manual test function to create chat history - for debugging
  const createTestChatHistory = () => {
    console.log('🧪 MANUAL TEST: Creating test chat history event');
    const testChatEvent: TimelineEvent = {
      id: `test-chat-${Date.now()}`,
      date: new Date(),
      title: `TEST Chat Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      description: '[15:30] User: Hello\n[15:30] Bot: Hi there! How can I help you today?\n[15:31] User: Tell me about space exploration\n[15:31] Bot: Space exploration began with early astronomical observations...',
      category: ['chat-history'],
      importance: 3
    };
    addEvents([testChatEvent]);
  };
  
  // Expose the test function globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).createTestChatHistory = createTestChatHistory;
  }
  
  // State to track when to create chat history event
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string | null>(null);

  // Function to create a chat history timeline event
  const createChatHistoryEvent = (messages: any[]): TimelineEvent => {
    // Filter out initial bot greeting and loading messages
    const conversationMessages = messages.filter(msg => 
      !msg.isLoading && 
      !(msg.sender === 'bot' && msg.text.includes('Hello! Ask me about any historical events'))
    );
    
    // Format chat history with timestamps
    const chatHistory = conversationMessages
      .map(msg => {
        const time = msg.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        const sender = msg.sender === 'user' ? 'User' : 'Bot';
        return `[${time}] ${sender}: ${msg.text}`;
      })
      .join('\n');
    
    const sessionTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      id: `chat-session-${Date.now()}`,
      date: new Date(),
      title: `Chat Session - ${sessionTime}`,
      description: chatHistory,
      category: ['chat-history'],
      importance: 3
    };
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
            
            // Set all existing categories to false initially, BUT preserve chat-history
            Object.keys(updatedCategories).forEach(cat => {
              if (cat !== 'chat-history') {
                updatedCategories[cat] = false;
              }
            });
            
            // Enable categories from generated events
            categoriesToShow.forEach(cat => {
              updatedCategories[cat] = true;
            });
            
            // Always ensure chat-history is enabled if it exists
            if (updatedCategories['chat-history'] !== undefined) {
              updatedCategories['chat-history'] = true;
            }
            
            return {
              ...prevFilters,
              categories: updatedCategories
            };
          });
        }
      }
    }
  }, [messages]);

  // Listen for chat session completion (when bot finishes responding)
  useEffect(() => {
    console.log('🔄 Chat completion listener triggered, messages count:', messages?.length || 0);
    if (messages && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      
      // Check if last message is from bot, not loading, and we haven't processed this message yet
      if (lastMessage.sender === 'bot' && 
          !lastMessage.isLoading && 
          lastMessage.id !== lastProcessedMessageId) {
        
        // Only create chat history if there are actual user interactions (not just the greeting)
        const userMessages = messages.filter(msg => msg.sender === 'user');
        
        if (userMessages.length > 0) {
          console.log('🎯 Chat session completed! Creating timeline event with', userMessages.length, 'user messages');
          console.log('💬 Last message:', lastMessage.text.substring(0, 50) + '...');
          
          // Create and add chat history event
          const chatHistoryEvent = createChatHistoryEvent(messages);
          console.log('📅 Created chat history event:', chatHistoryEvent.title);
          addEvents([chatHistoryEvent]);
          
          // Mark this message as processed
          setLastProcessedMessageId(lastMessage.id);
          
          console.log('✅ Chat history successfully added to timeline!');
        }
      }
    }
  }, [messages, lastProcessedMessageId]);

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
  
  // Log filtering results for debugging
  useEffect(() => {
    console.log(`🔍 Filter Update:`);
    console.log(`  - Total events: ${allEvents.length}`);
    console.log(`  - Filtered events: ${filteredEvents.length}`);
    console.log(`  - Active categories:`, Object.entries(filters.categories).filter(([_, enabled]) => enabled).map(([cat, _]) => cat));
    console.log(`  - Chat history events in total:`, allEvents.filter(e => e.category.includes('chat-history')).length);
    console.log(`  - Chat history events in filtered:`, filteredEvents.filter(e => e.category.includes('chat-history')).length);
  }, [allEvents, filteredEvents, filters.categories]);

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
