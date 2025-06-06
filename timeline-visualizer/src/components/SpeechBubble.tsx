import React, { useState } from 'react';
import { ReactionData } from '@/types/timeline';

interface SpeechBubbleProps {
  reaction: {
    id: string;
    eventId: string;
    stakeholders: ReactionData[];
    position?: { x: number; y: number };
  };
  position?: 'bottom' | 'right' | 'left';
}

export default function SpeechBubble({ reaction, position = 'bottom' }: SpeechBubbleProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<ReactionData | null>(null);

  if (!reaction || !reaction.stakeholders) {
    return null;
  }

  const handleBubbleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleStakeholderClick = (stakeholder: ReactionData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStakeholder(selectedStakeholder?.stakeholder.id === stakeholder.stakeholder.id ? null : stakeholder);
  };

  // Get the primary emotion color
  const getPrimaryEmotionColor = () => {
    const emotions = reaction.stakeholders.map(s => s.emotion);
    const positiveCount = emotions.filter(e => e === 'positive' || e === 'excited').length;
    const negativeCount = emotions.filter(e => e === 'negative' || e === 'concerned').length;
    
    if (positiveCount > negativeCount) return 'rgb(34, 197, 94)'; // green
    if (negativeCount > positiveCount) return 'rgb(239, 68, 68)'; // red
    return 'rgb(156, 163, 175)'; // gray for neutral/mixed
  };

  const bubbleColor = getPrimaryEmotionColor();

  // Position classes based on prop
  const positionClasses = {
    bottom: 'top-full mt-4 left-1/2 -translate-x-1/2',
    right: 'left-full ml-4 top-1/2 -translate-y-1/2',
    left: 'right-full mr-4 top-1/2 -translate-y-1/2'
  };

  // Tail SVG paths based on position
  const getTailSVG = () => {
    const tailColor = bubbleColor;
    
    if (position === 'bottom') {
      return (
        <svg 
          className="absolute -top-3 left-1/2 -translate-x-1/2" 
          width="24" 
          height="12" 
          viewBox="0 0 24 12"
          style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.1))' }}
        >
          <path
            d="M 0 12 Q 6 8, 12 0 Q 18 8, 24 12 Z"
            fill={tailColor}
          />
        </svg>
      );
    } else if (position === 'right') {
      return (
        <svg 
          className="absolute -left-3 top-1/2 -translate-y-1/2" 
          width="12" 
          height="24" 
          viewBox="0 0 12 24"
          style={{ filter: 'drop-shadow(-2px 0 4px rgba(0,0,0,0.1))' }}
        >
          <path
            d="M 12 0 Q 8 6, 0 12 Q 8 18, 12 24 Z"
            fill={tailColor}
          />
        </svg>
      );
    } else {
      return (
        <svg 
          className="absolute -right-3 top-1/2 -translate-y-1/2" 
          width="12" 
          height="24" 
          viewBox="0 0 12 24"
          style={{ filter: 'drop-shadow(2px 0 4px rgba(0,0,0,0.1))' }}
        >
          <path
            d="M 0 0 Q 4 6, 12 12 Q 4 18, 0 24 Z"
            fill={tailColor}
          />
        </svg>
      );
    }
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-50 speech-bubble-appear`} style={{ pointerEvents: 'auto' }}>
      {/* Speech bubble */}
      <div 
        className={`relative bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-2xl border-2 shadow-2xl cursor-pointer transition-all duration-300 ${
          expanded ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{ 
          borderColor: bubbleColor,
          boxShadow: `0 4px 20px ${bubbleColor}40, 0 0 40px ${bubbleColor}20`,
          minWidth: '140px',
          maxWidth: expanded ? '320px' : '200px',
          animation: 'float 3s ease-in-out infinite'
        }}
        onClick={handleBubbleClick}
      >
        {/* Speech bubble tail */}
        {getTailSVG()}
        
        <div className="p-4">
          {/* Stakeholder section */}
          <div className="mb-3">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Stakeholder Reactions</div>
            <div className={`grid gap-2 ${reaction.stakeholders.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {reaction.stakeholders.slice(0, expanded ? reaction.stakeholders.length : 6).map((stakeholderReaction) => (
                <div
                  key={stakeholderReaction.stakeholder.id}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                    selectedStakeholder?.stakeholder.id === stakeholderReaction.stakeholder.id 
                      ? 'bg-blue-600 bg-opacity-30 shadow-lg scale-105' 
                      : 'hover:bg-gray-700 hover:bg-opacity-30 hover:shadow-md'
                  }`}
                  onClick={(e) => handleStakeholderClick(stakeholderReaction, e)}
                >
                  <div className="text-xl mb-1 transform transition-transform hover:scale-110">
                    {stakeholderReaction.stakeholder.icon}
                  </div>
                  {expanded && (
                    <div className="text-xs text-gray-300 text-center mt-1 font-medium">
                      {stakeholderReaction.stakeholder.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!expanded && reaction.stakeholders.length > 6 && (
              <div className="text-xs text-gray-500 text-center mt-2 italic">
                +{reaction.stakeholders.length - 6} more
              </div>
            )}
          </div>
          
          {/* Emotion summary */}
          {expanded && (
            <div className="pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Emotional Summary</div>
              <div className="space-y-2">
                {reaction.stakeholders.slice(0, 3).map((stakeholderReaction) => (
                  <div
                    key={`emotion-${stakeholderReaction.stakeholder.id}`}
                    className="flex items-center gap-2 text-xs bg-gray-900 bg-opacity-50 rounded-lg p-2"
                  >
                    <span className="text-lg">{stakeholderReaction.emoticon}</span>
                    <span className="text-gray-300 flex-1">
                      <span className="font-medium">{stakeholderReaction.stakeholder.name}:</span>
                      <span className="ml-1 capitalize italic">
                        {stakeholderReaction.emotion === 'positive' ? 'Positive' : 
                         stakeholderReaction.emotion === 'negative' ? 'Negative' :
                         stakeholderReaction.emotion === 'concerned' ? 'Concerned' :
                         stakeholderReaction.emotion === 'excited' ? 'Excited' :
                         'Neutral'}
                      </span>
                    </span>
                  </div>
                ))}
                {reaction.stakeholders.length > 3 && (
                  <div className="text-xs text-gray-500 text-center italic">
                    ... and {reaction.stakeholders.length - 3} more reactions
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed reaction modal */}
      {selectedStakeholder && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-md border-2 border-gray-600 rounded-xl shadow-2xl max-w-sm w-80"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className="p-5">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{selectedStakeholder.stakeholder.icon}</span>
              <div className="flex-1">
                <div className="text-white font-semibold text-base">
                  {selectedStakeholder.stakeholder.name}
                </div>
                <div className="text-gray-400 text-sm capitalize">
                  {selectedStakeholder.stakeholder.type}
                </div>
              </div>
              <span className="text-2xl">{selectedStakeholder.emoticon}</span>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
              <div className="text-gray-300 text-sm leading-relaxed">
                {selectedStakeholder.detailedReaction}
              </div>
            </div>
            
            {selectedStakeholder.timestamp && (
              <div className="text-gray-500 text-xs text-center">
                Reaction recorded: {selectedStakeholder.timestamp.toLocaleDateString()}
              </div>
            )}
          </div>
          
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            onClick={() => setSelectedStakeholder(null)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}
