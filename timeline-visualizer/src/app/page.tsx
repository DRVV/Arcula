'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import HamburgerMenu from '@/components/HamburgerMenu';
import FilterPanel from '@/components/FilterPanel';
import ChatWindow from '@/components/ChatWindow';

// Use dynamic import with SSR disabled for React Flow
// This is necessary because React Flow uses browser APIs
const TimelineFlow = dynamic(() => import('@/components/TimelineFlow'), {
  ssr: false
});

// Context providers
import { TimelineProvider } from '@/contexts/TimelineContext';
import { ChatProvider } from '@/contexts/ChatContext';

const HomePageContent = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  return (
    <div className="bg-gray-950 text-white h-screen w-screen overflow-hidden flex flex-col">
      <header className="fixed top-0 z-50 w-full bg-gray-900 bg-opacity-70 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Timeline Generator
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <span className="bg-gray-800 px-2 py-1 rounded-md">1973 - 2024</span>
            </div>
            
            {/* Search/Filter Button */}
            <div className="relative">
              <button 
                onClick={toggleFilter}
                className={`p-2 rounded-md text-gray-300 hover:text-white transition-colors ${filterOpen ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                aria-label="Search and filter"
                id="filter-button"
                aria-expanded={filterOpen}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
              
              {/* Filter Panel Dropdown */}
              {filterOpen && (
                <div 
                  className="absolute right-0 mt-2 z-50 transition-all"
                  role="menu"
                  aria-labelledby="filter-button"
                >
                  <FilterPanel inHeader={true} />
                </div>
              )}
            </div>
            
            <HamburgerMenu />
          </div>
        </div>
      </header>
      
      {/* Add padding-top to account for the fixed header */}
      <main className="w-full h-full pt-14">
        <TimelineFlow />
        <ChatWindow />
      </main>
    </div>
  );
};

export default function Home() {
  return (
    <TimelineProvider>
      <ChatProvider>
        <HomePageContent />
      </ChatProvider>
    </TimelineProvider>
  );
}
