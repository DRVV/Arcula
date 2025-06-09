import React, { useState, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TimelineEvent } from '@/types/timeline';
import { format } from 'date-fns';

import { useChat } from '@/contexts/ChatContext';
import TechExpertBubble from './TechExpertBubble';
import { TIMELINE_LAYOUT } from '@/config/timelineLayout';

// Our component receives the standard props from React Flow
export default function EventNode({ data }: { data: { event: TimelineEvent } }) {
  const { messages } = useChat();
  const [expanded, setExpanded] = useState(false);
  
  // Check if this event is highlighted by a chat query
  const isHighlighted = React.useMemo(() => {
    if (!data?.event) return false;
    // Get the last bot message with generated events
    const lastBotMessageWithEvents = [...messages]
      .reverse()
      .find(msg => msg.sender === 'bot' && msg.generatedEvents && msg.generatedEvents.length > 0);
    
    // Check if this event is in the generated events
    return lastBotMessageWithEvents?.generatedEvents?.some(event => event.id === data.event.id) || false;
  }, [messages, data?.event?.id]);
  
  // Get embedded reaction data from the event
  const eventReactions = useMemo(() => {
    if (!data?.event?.reactions || data.event.reactions.length === 0) return undefined;
    return data.event.reactions;
  }, [data?.event?.reactions]);
  
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
  
  const handleClick = (e: React.MouseEvent) => {
    // Only expand/collapse if this was actually a click, not a drag
    if (e.detail === 1) {
      setExpanded(!expanded);
    }
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
    <div className="relative timeline-event-container">
      {/* Speech balloon with tail pointing down */}
      <div 
        className={`relative rounded-2xl backdrop-blur-md border transition-all duration-200 ${
          expanded ? 'scale-105 z-20' : 'hover:scale-105'
        } ${isHighlighted ? 'bg-indigo-950 bg-opacity-90' : 'bg-gray-900 bg-opacity-80'}`}
        style={{ 
          borderColor: getImportanceColor(),
          borderWidth: `${event.importance}px`,
          boxShadow: getGlowEffect(),
          width: expanded ? `${TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH_EXPANDED}px` : `${TIMELINE_LAYOUT.NODE_POSITIONING.BALLOON_WIDTH}px`,
          transform: isHighlighted ? 'translateY(-5px)' : 'none'
        }}
        onClick={handleClick}
      >
        {/* Speech balloon tail pointing down to timeline */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ 
            bottom: `-${TIMELINE_LAYOUT.EVENT_NODE_HEIGHTS.BALLOON_TAIL_OFFSET}px`,
            width: 0, 
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `${TIMELINE_LAYOUT.EVENT_NODE_HEIGHTS.BALLOON_TAIL_HEIGHT}px solid ${getImportanceColor()}`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        {/* Inner tail for clean appearance */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ 
            bottom: `-${TIMELINE_LAYOUT.EVENT_NODE_HEIGHTS.BALLOON_TAIL_OFFSET - 4}px`,
            width: 0, 
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `${TIMELINE_LAYOUT.EVENT_NODE_HEIGHTS.BALLOON_TAIL_HEIGHT - 2}px solid ${isHighlighted ? 'rgba(30, 41, 59, 0.9)' : 'rgba(17, 24, 39, 0.8)'}`,
          }}
        />
        {/* Highlight indicator */}
        {isHighlighted && (
          <div className="absolute -top-2 -right-2 bg-white p-1 rounded-full animate-pulse z-10">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
        )}
        {/* Horizontal positioning handles */}
        <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
        <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
        {/* Bottom handle for timeline connector */}
        <Handle type="target" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded-md">
            {format(event.date, 'MMM d, yyyy')}
          </div>
          <div className="flex">
            {[...Array(event.importance)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ backgroundColor: getImportanceColor() }}></div>
            ))}
          </div>
        </div>
        
        {/* Image display - always visible when available */}
        {event.media && event.media[0] ? (
          <div 
            className="mb-3 relative w-full rounded-lg overflow-hidden border border-gray-700 bg-gray-800"
            style={{ height: `${TIMELINE_LAYOUT.EVENT_NODE_HEIGHTS.IMAGE_HEIGHT}px` }}
          >
            {event.media[0].type === 'image' && (
              <img
                src={event.media[0].url}
                alt={event.media[0].caption || event.title}
                className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="flex items-center justify-center h-full text-gray-500 text-sm"><svg class="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>Image unavailable</div>`;
                  }
                }}
              />
            )}
            {event.media[0].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="text-xs text-white/90">
                  {event.media[0].caption}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Elegant fallback for events without images */
          <div 
            className="mb-3 relative w-full rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 flex items-center justify-center"
            style={{ height: `${TIMELINE_LAYOUT.EVENT_NODE_HEIGHTS.FALLBACK_HEIGHT}px` }}
          >
            <div className="text-gray-500 text-center">
              <svg className="w-6 h-6 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
              </svg>
              <div className="text-xs font-mono opacity-75">{event.category[0] || 'milestone'}</div>
            </div>
          </div>
        )}
        
        <h3 className="text-base font-medium text-white mb-2 leading-tight">{event.title}</h3>
        
        {/* Categories - limit to 3 for space */}
        {/* <div className="flex flex-wrap gap-1 my-2">
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
        </div> */}
        
        {/* Only show description and media when expanded */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
            
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
      
      {/* Render tech expert bubble if reaction data exists */}
      {eventReactions && (
        <TechExpertBubble 
          reactions={eventReactions}
          eventId={event.id}
        />
      )}
    </div>
  );
}
