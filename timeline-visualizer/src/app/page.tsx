'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import DynamicTimelineFlow from '@/components/DynamicTimelineFlow';
import ChatWindow from '@/components/ChatWindow';

const HomePageContent = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  
  const toggleFilter = useCallback(() => {
    setFilterOpen(!filterOpen);
  }, [filterOpen]);

  const toggleControls = useCallback(() => {
    setControlsVisible(!controlsVisible);
  }, [controlsVisible]);

  const handleFirstMessage = useCallback(() => {
    setHasStartedChat(true);
  }, []);
  
  return (
    <div className="bg-gray-950 text-white h-screen w-screen overflow-hidden flex flex-col">
      <Header 
        filterOpen={filterOpen} 
        toggleFilter={toggleFilter}
        controlsVisible={controlsVisible}
        toggleControls={toggleControls}
      />
      
      {/* Add padding-top to account for the fixed header */}
      <main className="w-full h-full pt-14 relative">
        {!hasStartedChat ? (
          // Welcome screen - full width
          <ChatWindow 
            hasStartedChat={hasStartedChat}
            onFirstMessage={handleFirstMessage} 
          />
        ) : (
          // Full screen timeline with compact bottom chat panel
          <div className="h-full relative">
            {/* Timeline visualization - full screen background */}
            <div className="w-full h-full">
              <DynamicTimelineFlow controlsVisible={controlsVisible} />
            </div>
            
            {/* Chat window - compact bottom panel */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-96 max-w-[90vw]">
              <ChatWindow 
                hasStartedChat={hasStartedChat}
                onFirstMessage={handleFirstMessage} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function Home() {
  return <HomePageContent />;
}
