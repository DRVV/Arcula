'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';

const ChatWindow = () => {
  const { messages, isOpen, setIsOpen, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      <div 
        className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'h-96 opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
          <h3 className="text-white font-medium">Timeline Assistant</h3>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        
        {/* Messages container */}
        <div className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 max-w-[85%] ${
                message.sender === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
              <div
                className={`text-xs mt-1 text-gray-500 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t border-gray-700 p-3 bg-gray-800">
          <div className="flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-l-md py-2 px-3 focus:outline-none resize-none max-h-24"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === ''}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md ${
                inputText.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
