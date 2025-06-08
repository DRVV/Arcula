'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { 
  MainContainer, 
  ChatContainer, 
  MessageList, 
  Message, 
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import { useTimeline } from '@/contexts/TimelineContext';
import { TimelineEvent } from '@/types/timeline';

interface ChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
  position: 'single' | 'first' | 'normal' | 'last';
  timestamp: Date;
}

interface ChatTimelineResponse {
  chat: {
    message: string;
    timestamp: string;
    sender: 'assistant';
  };
  timeline: {
    events: TimelineEvent[];
    append: boolean;
  };
}

interface ChatWindowProps {
  hasStartedChat: boolean;
  onFirstMessage: () => void;
}

const ChatWindow = ({ hasStartedChat, onFirstMessage }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { addEvents } = useTimeline();

  const handleSend = async (message: string) => {
    // If this is the first message, trigger the layout change
    if (!hasStartedChat) {
      onFirstMessage();
    }

    const newMessage: ChatMessage = {
      message,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "You",
      direction: "outgoing",
      position: "single",
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      console.log('🚀 Sending message to chat-timeline API:', message);
      
      const response = await fetch('/api/chat-timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          conversationId: 'chat-session-' + Date.now()
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ChatTimelineResponse = await response.json();
      console.log('✅ Received response from chat-timeline API:', data);

      // Add the assistant's message
      const assistantMessage: ChatMessage = {
        message: data.chat.message,
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "Assistant",
        direction: "incoming",
        position: "single",
        timestamp: new Date(data.chat.timestamp)
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Automatically add timeline events to the graph
      if (data.timeline.events && data.timeline.events.length > 0) {
        console.log(`📊 Adding ${data.timeline.events.length} timeline events to graph`);
        
        // Convert date strings to Date objects
        const eventsWithDates = data.timeline.events.map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        
        addEvents(eventsWithDates);
      }

    } catch (error) {
      console.error('❌ Error calling chat-timeline API:', error);
      
      // Fallback error message
      const errorMessage: ChatMessage = {
        message: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "Assistant",
        direction: "incoming",
        position: "single",
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <AnimatePresence mode="wait">
        {!hasStartedChat ? (
          // Initial centered layout
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col items-center justify-center px-8"
          >
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8 max-w-2xl"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Welcome to Timeline Explorer
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Ask me anything about technology history and I'll provide insights while building an interactive timeline visualization for you.
              </p>
            </motion.div>

            {/* Centered MessageInput */}
            <motion.div
              layoutId="message-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
                <MessageInput 
                  placeholder="Start exploring by typing your question here..."
                  onSend={handleSend}
                  disabled={isTyping}
                  attachButton={false}
                  style={{ 
                    background: '#111827', 
                    border: 'none',
                    color: '#e5e7eb',
                    fontSize: '16px'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Full chat layout
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
          >
            {/* Message List */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex-1 overflow-hidden"
              style={{ background: '#1f2937' }}
            >
              <MainContainer style={{ border: 'none', borderRadius: '0', height: '100%' }}>
                <ChatContainer style={{ background: 'transparent', height: '100%' }}>
                  <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={isTyping ? <TypingIndicator content="Assistant is typing..." style={{ background: '#374151', color: '#e5e7eb' }} /> : null}
                    style={{ background: 'transparent' }}
                  >
                    {messages.map((message, index) => (
                      <Message
                        key={index}
                        model={{
                          message: message.message,
                          sentTime: message.sentTime,
                          sender: message.sender,
                          direction: message.direction,
                          position: message.position
                        }}
                      />
                    ))}
                  </MessageList>
                </ChatContainer>
              </MainContainer>
            </motion.div>

            {/* Docked MessageInput */}
            <motion.div
              layoutId="message-input"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="border-t border-gray-700 bg-gray-900"
            >
              <MessageInput 
                placeholder="Type your message here..." 
                onSend={handleSend}
                disabled={isTyping}
                attachButton={false}
                style={{ 
                  background: '#111827', 
                  border: 'none',
                  color: '#e5e7eb'
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;
