import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { TimelineEvent } from '@/types/timeline';
import Image from 'next/image';
import { format } from 'date-fns';

import { useChat } from '@/contexts/ChatContext';

// Our component receives the standard props from React Flow
export default function EventNode({ data }: { data: { event: TimelineEvent } }) {
  const { messages } = useChat();
  
  // Check if this event is highlighted by a chat query
  const isHighlighted = React.useMemo(() => {
    // Get the last bot message with related events
    const lastBotMessageWithEvents = [...messages]
      .reverse()
      .find(msg => msg.sender === 'bot' && msg.relatedEvents && msg.relatedEvents.length > 0);
    
    // Check if this event is in the related events
    return lastBotMessageWithEvents?.relatedEvents?.some(event => event.id === data.event.id) || false;
  }, [messages, data.event.id]);
  // Make sure event data exists
  if (!data || !data.event) {
    console.error('No event data provided to EventNode');
    return (
      <div className="bg-red-500 p-2 rounded-md">
        <p className="text-white">Error: Missing event data</p>
      </div>
    );
  }
  
  const event = data.event;
  const [expanded, setExpanded] = useState(false);
  
  const handleClick = () => {
    setExpanded(!expanded);
  };
  
  // Set color based on importance
  const getImportanceColor = () => {
    switch (event.importance) {
      case 5: return 'rgb(239, 68, 68)'; // red-500
      case 4: return 'rgb(249, 115, 22)'; // orange-500
      case 3: return 'rgb(234, 179, 8)'; // yellow-500
      case 2: return 'rgb(34, 197, 94)'; // green-500
      case 1: default: return 'rgb(59, 130, 246)'; // blue-500
    }
  };
  
  // Get glow intensity based on importance
  const getGlowEffect = () => {
    const color = getImportanceColor();
    const baseIntensity = event.importance * 2;
    const intensity = isHighlighted ? baseIntensity * 2 : baseIntensity;
    
    if (isHighlighted) {
      return `0 0 ${intensity}px ${color}, 0 0 ${intensity * 1.5}px rgba(255,255,255,0.5)`;
    }
    
    return `0 0 ${intensity}px ${color}, 0 0 ${intensity}px rgba(0,0,0,0.3)`;
  };

  return (
    <div 
      className={`rounded-lg backdrop-blur-md border transition-all duration-200 ${
        expanded ? 'scale-105 z-50' : 'hover:scale-105'
      } ${isHighlighted ? 'bg-indigo-950 bg-opacity-90' : 'bg-gray-900 bg-opacity-80'}`}
      style={{ 
        borderColor: getImportanceColor(),
        borderWidth: `${event.importance}px`,
        boxShadow: getGlowEffect(),
        width: expanded ? '300px' : '220px',
        transform: isHighlighted ? 'translateY(-5px)' : 'none'
      }}
      onClick={handleClick}
    >
      {/* Highlight indicator */}
      {isHighlighted && (
        <div className="absolute -top-2 -right-2 bg-white p-1 rounded-full animate-pulse z-10">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        </div>
      )}
      {/* Horizontal positioning handles */}
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded-md">
            {format(event.date, 'MMM d, yyyy')}
          </div>
          <div className="flex">
            {[...Array(event.importance)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ backgroundColor: getImportanceColor() }}></div>
            ))}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
        
        {/* Categories - limit to 3 for space */}
        <div className="flex flex-wrap gap-1 my-2">
          {event.category.slice(0, 3).map((cat: string) => (
            <span 
              key={cat} 
              className="px-2 py-0.5 rounded-md text-xs bg-gray-800 text-gray-300 border-l-2"
              style={{ borderColor: getImportanceColor() }}
            >
              {cat}
            </span>
          ))}
          {event.category.length > 3 && (
            <span className="text-xs text-gray-400">+{event.category.length - 3} more</span>
          )}
        </div>
        
        {/* Only show description and media when expanded */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
            
            {/* Media display */}
            {event.media && event.media[0] && (
              <div className="mt-4 relative w-full h-36 rounded-lg overflow-hidden border border-gray-700">
                {event.media[0].type === 'image' && (
                  <div className="relative w-full h-full">
                    <img
                      src={event.media[0].url}
                      alt={event.media[0].caption || event.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
                {event.media[0].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm p-2 text-xs text-white">
                    {event.media[0].caption}
                  </div>
                )}
              </div>
            )}
            
            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div className="mt-4 pt-2 border-t border-gray-700 space-y-2">
                {event.links.map((link: { title: string; url: string }, index: number) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-blue-400 hover:text-blue-300 hover:pl-1 transition-all"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
