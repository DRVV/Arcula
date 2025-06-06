'use client';

import React, { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import { ChainlitAPI, ChainlitContext, useChatSession, useChatMessages, useChatData } from '@chainlit/react-client';

const CHAINLIT_SERVER_URL = 'http://localhost:8000';

// Initialize Chainlit API client
const apiClient = new ChainlitAPI(CHAINLIT_SERVER_URL, 'webapp');

// Component to display recent messages
function MessageList() {
  const { messages } = useChatMessages();
  const { connected, loading, error } = useChatData();

  // Get the most recent 3 messages
  const recentMessages = messages ? messages.slice(-3) : [];

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Messages</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-gray-300">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-400">Messages</h3>
        <div className="text-red-300 bg-red-900/20 rounded-md p-4">
          Error loading messages. Please check your Chainlit server connection.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-400">Recent Messages (Last 3)</h3>
      {recentMessages.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          <p>No messages found.</p>
          <p className="text-sm mt-2">Send a message through your Chainlit server to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentMessages.map((message, index) => (
            <div
              key={message.id || index}
              className="bg-gray-700 rounded-md p-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-blue-300">
                  {message.name || 'System'}
                </span>
                <span className="text-xs text-gray-400">
                  {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : 'Unknown time'}
                </span>
              </div>
              <div className="text-gray-100">
                {message.output || 'No content'}
              </div>
              {message.type && (
                <div className="mt-2">
                  <span className="inline-block bg-gray-600 text-xs px-2 py-1 rounded text-gray-300">
                    {message.type}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component to show connection status
function ConnectionStatus() {
  const { connected, loading, error } = useChatData();

  const getStatusColor = () => {
    if (error) return 'text-red-400 bg-red-900/20';
    if (connected) return 'text-green-400 bg-green-900/20';
    if (loading) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-gray-400 bg-gray-800';
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (connected) return 'Connected';
    if (loading) return 'Connecting...';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (error) return '❌';
    if (connected) return '✅';
    if (loading) return '🔄';
    return '⚪';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-400">Connection Status</h3>
      <div className={`inline-flex items-center px-3 py-2 rounded-md ${getStatusColor()}`}>
        <span className="mr-2">{getStatusIcon()}</span>
        <span className="font-medium">{getStatusText()}</span>
      </div>
      <div className="mt-3 text-sm text-gray-400">
        Server: <code className="bg-gray-700 px-2 py-1 rounded text-gray-300">{CHAINLIT_SERVER_URL}</code>
      </div>
    </div>
  );
}

// Main test component
function ChainlitTestContent() {
  const { connect, disconnect } = useChatSession();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Auto-connect on mount
    const handleConnect = async () => {
      setIsConnecting(true);
      try {
        await connect({
          userEnv: {
            // Add any user environment variables here if needed
          }
        });
      } catch (error) {
        console.error('Failed to connect to Chainlit server:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    handleConnect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">
            Chainlit Client Test Page
          </h1>
          <p className="text-gray-400">
            Testing connection to Chainlit server and displaying recent messages.
          </p>
        </div>

        <ConnectionStatus />
        <MessageList />

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Instructions</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• Make sure your Chainlit server is running on <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:8000</code></li>
            <li>• Send messages through your Chainlit interface</li>
            <li>• This page will automatically display the most recent 3 messages</li>
            <li>• Connection status is shown above the messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Provider wrapper component
function ChainlitProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChainlitContext.Provider value={apiClient}>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </ChainlitContext.Provider>
  );
}

// Main page component
export default function ChainlitTestPage() {
  return (
    <ChainlitProvider>
      <ChainlitTestContent />
    </ChainlitProvider>
  );
}
