'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import DynamicTimelineFlow from '@/components/DynamicTimelineFlow';
import ChatWindow from '@/components/ChatWindow';

const HomePageContent = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  const toggleFilter = useCallback(() => {
    setFilterOpen(!filterOpen);
  }, [filterOpen]);
  
  return (
    <div className="bg-gray-950 text-white h-screen w-screen overflow-hidden flex flex-col">
      <Header filterOpen={filterOpen} toggleFilter={toggleFilter} />
      
      {/* Add padding-top to account for the fixed header */}
      <main className="w-full h-full pt-14">
        <DynamicTimelineFlow />
        <ChatWindow />
      </main>
    </div>
  );
};

export default function Home() {
  return <HomePageContent />;
}
