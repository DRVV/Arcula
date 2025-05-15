'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for React Flow
// This is necessary because React Flow uses browser APIs
const TimelineFlow = dynamic(() => import('@/components/TimelineFlow'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="bg-gray-950 text-white">
      <header className="fixed top-0 z-50 w-full bg-gray-900 bg-opacity-70 backdrop-blur-md">
        <div className="container mx-auto py-4 px-6">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mobile Device Evolution Timeline
          </h1>
        </div>
      </header>
      
      <main className="w-screen h-screen">
        <TimelineFlow />
      </main>
    </div>
  );
}
