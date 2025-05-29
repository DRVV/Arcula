'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimeline } from '@/contexts/TimelineContext';
import { TimelineEvent } from '@/types/timeline';

// Interface for the JSON data structure from Chainlit
interface ChainlitData {
  raw_content: string;
  events?: Partial<TimelineEvent>[];
  json_data?: any; // JSON data from index -2 response
}

const ChainlitCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestingData, setIsRequestingData] = useState(false);
  const { addEvents } = useTimeline();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Function to process and convert events from Chainlit data
  const processChainlitEvents = (events: Partial<TimelineEvent>[]): TimelineEvent[] => {
    console.log('🔄 Processing events from Chainlit:', events);
    
    return events.map((event, index) => {
      // Convert date string to Date object
      let eventDate: Date;
      if (typeof event.date === 'string') {
        eventDate = new Date(event.date);
        console.log(`📅 Converting date "${event.date}" to Date object:`, eventDate);
      } else if (event.date instanceof Date) {
        eventDate = event.date;
      } else {
        eventDate = new Date();
        console.warn('⚠️ No valid date found, using current date');
      }
      
      // Create complete TimelineEvent with defaults for missing fields
      const processedEvent: TimelineEvent = {
        id: event.id || `chainlit-event-${Date.now()}-${index}`,
        date: eventDate,
        title: event.title || 'Untitled Event',
        description: event.description || 'No description provided',
        category: event.category || ['chainlit'],
        importance: (event.importance || 3) as 1 | 2 | 3 | 4 | 5,
        // Optional fields - only include if present
        ...(event.media && { media: event.media }),
        ...(event.links && { links: event.links }),
        ...(event.position && { position: event.position })
      };
      
      console.log(`✅ Processed event "${processedEvent.title}":`, processedEvent);
      return processedEvent;
    });
  };
  
  // Function to handle request for graph data from index -2 response
  const showAsGraph = () => {
    console.log('📊 Requesting graph data from Chainlit iframe (index -2)...');
    setIsRequestingData(true);
    
    // Send request to iframe for graph data from second-to-last response
    if (iframeRef.current?.contentWindow) {
      console.log('📤 Sending REQUEST_GRAPH_DATA message to iframe');
      iframeRef.current.contentWindow.postMessage(
        { type: 'REQUEST_GRAPH_DATA' },
        'http://localhost:8000'
      );
    } else {
      console.error('❌ Iframe not available or not loaded');
      setIsRequestingData(false);
    }
  };
  
  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== 'http://localhost:8000') {
        console.warn('⚠️ Received message from untrusted origin:', event.origin);
        return;
      }
      
      console.log('📥 Received message from Chainlit iframe:', event.data);
      
      try {
        const data: ChainlitData = event.data;
        
        // Handle different data types - graph data vs regular events
        if (data.json_data) {
          // This is graph data from index -2 response
          console.log('📊 Received graph data from Chainlit (index -2):', data.json_data);
          console.log('📝 Raw content:', data.raw_content);
          
          // Process JSON data and convert to timeline events if possible
          try {
            const jsonEvents = processJsonToEvents(data.json_data);
            if (jsonEvents.length > 0) {
              console.log(`🎯 Converted ${jsonEvents.length} JSON items to timeline events`);
              addEvents(jsonEvents);
              console.log('✅ Successfully added graph data to timeline!');
            } else {
              console.log('ℹ️ No processable events found in JSON data');
            }
          } catch (error) {
            console.error('❌ Error processing JSON data:', error);
          }
        } else {
          // Regular event data structure
          if (!data || !data.events || !Array.isArray(data.events)) {
            console.error('❌ Invalid data structure. Expected {raw_content, events} or {raw_content, json_data}:', data);
            setIsRequestingData(false);
            return;
          }
          
          console.log(`📊 Received ${data.events.length} events from Chainlit (automatic response)`);
          console.log('📝 Raw content:', data.raw_content);
          
          // Process and add events to timeline
          const processedEvents = processChainlitEvents(data.events);
          
          if (processedEvents.length > 0) {
            console.log(`🎯 Adding ${processedEvents.length} processed events to timeline`);
            addEvents(processedEvents);
            console.log('✅ Successfully added events to timeline!');
          } else {
            console.log('ℹ️ No events to add to timeline');
          }
        }
        

        
      } catch (error) {
        console.error('❌ Error processing message from iframe:', error);
      } finally {
        setIsRequestingData(false);
      }
    };
    
    // Add event listener
    window.addEventListener('message', handleMessage);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [addEvents]);
  
  // Function to process JSON data and convert to timeline events
  const processJsonToEvents = (jsonData: any): TimelineEvent[] => {
    console.log('🔧 Processing JSON data to timeline events:', jsonData);
    
    try {
      // If jsonData is an array, process each item
      if (Array.isArray(jsonData)) {
        return jsonData.map((item, index) => ({
          id: `json-event-${Date.now()}-${index}`,
          date: new Date(),
          title: item.title || item.name || `JSON Item ${index + 1}`,
          description: JSON.stringify(item, null, 2),
          category: ['json-data', 'graph'],
          importance: 4 as 1 | 2 | 3 | 4 | 5
        }));
      }
      
      // If jsonData is an object with events property
      if (jsonData.events && Array.isArray(jsonData.events)) {
        return processChainlitEvents(jsonData.events);
      }
      
      // If jsonData is a single object, create one event
      if (typeof jsonData === 'object' && jsonData !== null) {
        return [{
          id: `json-event-${Date.now()}`,
          date: new Date(),
          title: jsonData.title || jsonData.name || 'JSON Data',
          description: JSON.stringify(jsonData, null, 2),
          category: ['json-data', 'graph'],
          importance: 4 as 1 | 2 | 3 | 4 | 5
        }];
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error processing JSON to events:', error);
      return [];
    }
  };
  
  // Expose functions globally for console testing
  if (typeof window !== 'undefined') {
    (window as any).showAsGraph = showAsGraph;
    (window as any).createChainlitChatHistory = showAsGraph; // Backward compatibility
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
              onClick={showAsGraph}
              disabled={isRequestingData}
              className={`px-2 py-1 text-xs text-white rounded transition-colors ${
                isRequestingData 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title="Extract JSON from response at index -2 and show as graph"
            >
              {isRequestingData ? '⏳ Processing...' : '📊 Show as graph'}
            </button>
            <span className="w-3 h-3 bg-green-500 rounded-full shadow-inner"></span>
          </div>
        </div>
        
        {/* Chainlit iframe container */}
        <div className="flex-1 relative">
          {isOpen && (
            <iframe
              ref={iframeRef}
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
