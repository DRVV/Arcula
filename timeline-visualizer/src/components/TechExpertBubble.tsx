import React, { useState } from 'react';
import { ReactionData } from '@/types/timeline';
import ExpertReactionModal from './ExpertReactionModal';

interface TechExpertBubbleProps {
  reactions: ReactionData[];
  eventId: string;
}

export default function TechExpertBubble({ reactions, eventId }: TechExpertBubbleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter to only show tech expert reactions
  const techExpertReaction = reactions.find(reaction => 
    reaction.stakeholder.type === 'expert'
  );

  // Don't render anything if no tech expert reaction exists
  if (!techExpertReaction) {
    return null;
  }

  const handleBubbleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
        style={{ pointerEvents: 'auto' }}
        onClick={handleBubbleClick}
      >
        {/* Speech bubble */}
        <div 
          className="relative bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-xl border border-blue-400/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-400/50"
          style={{ 
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)',
            minWidth: '180px',
            maxWidth: '280px'
          }}
        >
          {/* Speech bubble tail pointing up */}
          <svg 
            className="absolute -top-3 left-1/2 -translate-x-1/2" 
            width="24" 
            height="12" 
            viewBox="0 0 24 12"
            style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.1))' }}
          >
            <path
              d="M 0 12 Q 6 8, 12 0 Q 18 8, 24 12 Z"
              fill="rgb(17, 24, 39)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
            />
          </svg>
          
          <div className="p-4">
            {/* Expert icon and indicator */}
            <div className="flex items-center mb-3">
              <div className="text-xl">
              
              </div>
            </div>
            
            {/* Short description */}
            <div className="text-gray-300 text-sm leading-relaxed mb-3">
                {techExpertReaction.emoticon} {techExpertReaction.shortDescription}
            </div>
            
            {/* Click indicator */}
            <div className="flex items-center justify-center pt-2 border-t border-gray-700/50">
              <span className="text-xs text-blue-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Click for details
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Reaction Modal */}
      {isModalOpen && (
        <ExpertReactionModal
          reaction={techExpertReaction}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
