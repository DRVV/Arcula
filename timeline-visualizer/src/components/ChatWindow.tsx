'use client';

import { useState } from 'react';
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

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "Hello! I'm here to help you explore the timeline. Feel free to chat with me!",
      sentTime: "just now",
      sender: "Assistant",
      direction: "incoming",
      position: "single",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { addEvents } = useTimeline();

  const handleSend = (message: string) => {
    const newMessage: ChatMessage = {
      message,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "You",
      direction: "outgoing",
      position: "single",
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Simulate assistant response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's an interesting point about the timeline!",
        "I can see you're exploring historical events. What period interests you most?",
        "Thanks for sharing! The timeline visualization helps us understand these connections.",
        "Great observation! Have you noticed any patterns in the events?",
        "I understand. The timeline really puts things in perspective!",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        message: randomResponse,
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "Assistant",
        direction: "incoming",
        position: "single",
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleUpdateGraph = () => {
    // Convert chat messages to timeline events
    const chatEvents: TimelineEvent[] = messages.map((msg, index) => {
      // Create a title from the first few words of the message
      const words = msg.message.split(' ');
      const title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
      
      return {
        id: `chat-${msg.timestamp.getTime()}-${index}`,
        date: msg.timestamp,
        title: `${msg.sender}: ${title}`,
        description: `[${msg.sentTime}] ${msg.sender}: ${msg.message}`,
        category: ['chat-history'],
        importance: 3 as 1 | 2 | 3 | 4 | 5
      };
    });

    console.log('📊 Adding chat history to timeline:', chatEvents.length, 'messages');
    addEvents(chatEvents);
    
    // Show a success indicator (could be a toast in the future)
    const button = document.getElementById('update-graph-btn');
    if (button) {
      button.textContent = '✅ Updated!';
      setTimeout(() => {
        button.textContent = '📊 Update Graph';
      }, 2000);
    }
  };

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

      {/* Chat window */}
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
            Timeline Chat
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full shadow-inner"></span>
          </div>
        </div>
        
        {/* Chat container */}
        <div className="flex-1 overflow-hidden" style={{ background: '#1f2937' }}>
          {isOpen && (
            <MainContainer style={{ border: 'none', borderRadius: '0' }}>
              <ChatContainer style={{ background: 'transparent' }}>
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
                <MessageInput 
                  placeholder="Type your message here..." 
                  onSend={handleSend}
                  disabled={isTyping}
                  attachButton={false}  // This removes the clip/attachment icon
                  style={{ 
                    background: '#111827', 
                    borderTop: '1px solid #374151',
                    color: '#e5e7eb'
                  }}
                />
              </ChatContainer>
            </MainContainer>
          )}
        </div>
        
        {/* Update Graph button */}
        <div className="bg-gray-800 border-t border-gray-700 p-3">
          <button
            id="update-graph-btn"
            onClick={handleUpdateGraph}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
            disabled={messages.length <= 1} // Disable if only initial message exists
          >
            <span>📊 Update Graph</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
