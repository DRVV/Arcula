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

interface ChatMessage {
  message: string;
  sentTime: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
  position: 'single' | 'first' | 'normal' | 'last';
}

function ChatUIKitPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: "Hello! How can I help you today?",
      sentTime: "just now",
      sender: "Assistant",
      direction: "incoming",
      position: "single"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (message: string) => {
    const newMessage: ChatMessage = {
      message,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "You",
      direction: "outgoing",
      position: "single"
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Simulate assistant response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I understand. How can I assist you further?",
        "Thanks for sharing that with me.",
        "That's a great question. Let me think about it.",
        "I see what you mean. Here's what I think...",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        message: randomResponse,
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "Assistant",
        direction: "incoming",
        position: "single"
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat UI Kit Demo</h1>
      <div style={{ position: "relative", height: "600px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Assistant is typing..." /> : null}
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
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatUIKitPage;
