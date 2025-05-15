'use client';

import dynamic from 'next/dynamic';
import HamburgerMenu from '@/components/HamburgerMenu';

// Use dynamic import with SSR disabled for React Flow
// This is necessary because React Flow uses browser APIs
const TimelineFlow = dynamic(() => import('@/components/TimelineFlow'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="bg-gray-950 text-white h-screen w-screen overflow-hidden flex flex-col">
      <header className="fixed top-0 z-50 w-full bg-gray-900 bg-opacity-70 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mobile Device Evolution Timeline
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <span className="bg-gray-800 px-2 py-1 rounded-md">1973 - 2024</span>
            </div>
            <HamburgerMenu />
          </div>
        </div>
      </header>
      
      {/* Add padding-top to account for the fixed header */}
      <main className="w-full h-full pt-14">
        <TimelineFlow />
      </main>
    </div>
  );
}
