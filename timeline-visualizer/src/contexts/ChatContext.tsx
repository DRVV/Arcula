'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTimeline } from './TimelineContext';
import { TimelineEvent } from '@/types/timeline';
import { processTimelineQuery } from '@/services/openaiService';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  relatedEvents?: TimelineEvent[];
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isProcessing: boolean;
  setIsOpen: (value: boolean) => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I can help you understand this timeline better. Try asking about specific events, time periods, or categories.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const { filteredEvents, setFilters } = useTimeline();

  // Function to generate a response based on the user's message
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|greetings).*/i)) {
      return "Hello! How can I help you explore this timeline today?";
    }
    
    // Look for questions about time periods
    if (message.includes('time period') || message.includes('period') || message.includes('when')) {
      const timeRange = getTimeRangeInfo(filteredEvents);
      return `The timeline spans from ${timeRange.start.toLocaleDateString()} to ${timeRange.end.toLocaleDateString()}, covering ${timeRange.years} years.`;
    }
    
    // Look for questions about specific events
    if (message.includes('what happened') || message.includes('tell me about')) {
      // Extract potential keywords
      const keywords = userMessage.split(' ').filter(word => word.length > 4);
      const relevantEvents = findRelevantEvents(keywords, filteredEvents);
      
      if (relevantEvents.length > 0) {
        const event = relevantEvents[0]; // Get the most relevant event
        return `On ${event.date.toLocaleDateString()}: ${event.title}. ${event.description}`;
      }
    }
    
    // Look for questions about categories
    if (message.includes('categories') || message.includes('types')) {
      const categories = getAllCategories(filteredEvents);
      return `The timeline contains the following categories: ${categories.join(', ')}.`;
    }
    
    // Default response if no patterns match
    return `I'm here to help you explore the timeline. You can ask about specific time periods, events, or categories.`;
  };

  // Helper function to get time range information
  const getTimeRangeInfo = (events: TimelineEvent[]) => {
    const dates = events.map(event => event.date.getTime());
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    
    return {
      start: startDate,
      end: endDate,
      years: yearDiff
    };
  };
  
  // Helper function to find events relevant to keywords
  const findRelevantEvents = (keywords: string[], events: TimelineEvent[]) => {
    return events.filter(event => {
      const eventText = `${event.title} ${event.description}`.toLowerCase();
      return keywords.some(keyword => eventText.includes(keyword.toLowerCase()));
    });
  };
  
  // Helper function to get all unique categories
  const getAllCategories = (events: TimelineEvent[]) => {
    const categorySet = new Set<string>();
    events.forEach(event => {
      event.category.forEach(cat => categorySet.add(cat));
    });
    return Array.from(categorySet);
  };

  const sendMessage = async (text: string) => {
    if (text.trim() === '') return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Add a loading message first
    const loadingMsgId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: loadingMsgId,
      text: 'Analyzing your question...',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Try to use OpenAI for advanced queries
      const response = await processTimelineQuery(text, filteredEvents);
      
      let responseText: string;
      let relatedEvents: TimelineEvent[] | undefined;
      
      if (response) {
        // Use the AI-generated response
        responseText = response.explanation;
        relatedEvents = response.relevantEvents;
        
        // Highlight these events in the timeline by updating filters if needed
        if (relatedEvents && relatedEvents.length > 0) {
          // Determine what categories to show
          const categoriesToShow = new Set<string>();
          relatedEvents.forEach(event => {
            event.category.forEach(cat => categoriesToShow.add(cat));
          });
          
          // Update filters to focus on relevant events
          setFilters(prevFilters => ({
            ...prevFilters,
            categories: Object.fromEntries(
              Object.entries(prevFilters.categories).map(([cat, _]) => 
                [cat, categoriesToShow.has(cat)]
              )
            )
          }));
        }
      } else {
        // Fall back to basic rule-based responses if OpenAI fails
        responseText = generateResponse(text);
      }
      
      // Replace loading message with actual response
      const botMessage: ChatMessage = {
        id: loadingMsgId,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        relatedEvents
      };
      
      setMessages(prev => 
        prev.map(msg => msg.id === loadingMsgId ? botMessage : msg)
      );
      
    } catch (error) {
      console.error('Error generating chat response:', error);
      
      // Replace with error message
      const errorMessage: ChatMessage = {
        id: loadingMsgId,
        text: 'Sorry, I encountered an error while processing your question. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => 
        prev.map(msg => msg.id === loadingMsgId ? errorMessage : msg)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: 'Chat history cleared. How can I help you?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <ChatContext.Provider value={{ messages, isOpen, isProcessing, setIsOpen, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
