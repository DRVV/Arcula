'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TimelineEvent } from '@/types/timeline';
import { processTimelineQuery } from '@/services/openaiService';
import { timelineEvents } from '@/data/timelineEvents';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  generatedEvents?: TimelineEvent[];
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

// Create a context to expose messages for the TimelineContext
export const ChatMessagesContext = createContext<ChatMessage[]>([]);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! Ask me about any historical events or periods, and I\'ll generate timeline events for you to visualize.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  // Function to generate a response based on the user's message
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|greetings).*/i)) {
      return "Hello! How can I help you explore this timeline today?";
    }
    
    // Default response for basic mode
    return `I can generate historical events related to any topic. Just ask me about a time period, historical event, or subject you're interested in.`;
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
      text: 'Generating historical events...',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Get the existing timeline events to provide context
      const response = await processTimelineQuery(text, timelineEvents);
      
      let responseText: string;
      let generatedEvents: TimelineEvent[] | undefined;
      
      if (response) {
        // Use the AI-generated response
        responseText = response.explanation;
        generatedEvents = response.generatedEvents;
        
        // The events will be picked up by TimelineContext through messages state updates
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
        generatedEvents
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
    <ChatMessagesContext.Provider value={messages}>
      <ChatContext.Provider value={{ messages, isOpen, isProcessing, setIsOpen, sendMessage, clearMessages }}>
        {children}
      </ChatContext.Provider>
    </ChatMessagesContext.Provider>
  );
}

// Helper hook to use just the messages
export function useChatMessages() {
  return useContext(ChatMessagesContext);
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
