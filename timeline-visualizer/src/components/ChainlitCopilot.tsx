'use client';

import { useState } from 'react';
import { useTimeline } from '@/contexts/TimelineContext';
import { TimelineEvent } from '@/types/timeline';

const ChainlitCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addEvents } = useTimeline();
  
  // Manual function to create chat history for testing
  const createChainlitChatHistory = () => {
    const chatEvent: TimelineEvent = {
      id: `chainlit-chat-${Date.now()}`,
      date: new Date(),
      title: `Chainlit Chat Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      description: `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] User: Hello\n[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] Assistant: Hi! How can I help you today?\n[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] User: Tell me about the timeline\n[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] Assistant: This timeline shows historical events...`,
      category: ['chat-history'],
      importance: 3 as 3
    };
    console.log('📱 Creating Chainlit chat history manually');
    addEvents([chatEvent]);
  };
  
  // Expose function globally for console testing
  if (typeof window !== 'undefined') {
    (window as any).createChainlitChatHistory = createChainlitChatHistory;
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full shadow-xl flex items-center justify-center hover:from-indigo-700 hover:to-indigo-900 transition-all z-50 ${!isOpen ? 'animate-pulse-slow' : ''}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        )}
      </button>

      {/* Chainlit iframe window */}
      <div 
        className={`fixed bottom-24 right-6 w-96 sm:w-[28rem] lg:w-[32rem] bg-gray-900 border border-gray-800 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'h-[28rem] lg:h-[32rem] opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat header */}
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 px-4 py-2 flex items-center justify-between border-b border-indigo-700 shadow-md">
          <h3 className="text-white font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chainlit Chat
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={createChainlitChatHistory}
              className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              title="Add current chat to timeline"
            >
              📅 Add to Timeline
            </button>
            <span className="w-3 h-3 bg-green-500 rounded-full shadow-inner"></span>
          </div>
        </div>
        
        {/* Chainlit iframe container */}
        <div className="flex-1 relative">
          {isOpen && (
            <iframe
              src="http://localhost:8000"
              className="w-full h-full border-0 rounded-b-lg"
              allow="microphone; camera"
              title="Chainlit Chat"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChainlitCopilot;
