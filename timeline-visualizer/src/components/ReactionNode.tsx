import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Reaction, ReactionData } from '@/types/timeline';

interface ReactionNodeProps {
  data: Record<string, unknown>;
}

export default function ReactionNode({ data }: ReactionNodeProps) {
  // Convert the generic data back to Reaction type
  const reaction = data as unknown as Reaction;
  const [showFullDescriptions, setShowFullDescriptions] = useState(false);

  if (!reaction || !reaction.stakeholders) {
    return (
      <div className="bg-red-500 p-2 rounded-md">
        <p className="text-white text-xs">Error: Missing reaction data</p>
      </div>
    );
  }

  const handleBubbleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullDescriptions(!showFullDescriptions);
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

  return (
    <div className="relative">
      {/* Connection handle (invisible) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ visibility: 'hidden' }} 
      />
      
      {/* Speech bubble */}
      <div 
        className={`relative bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 shadow-lg cursor-pointer transition-all duration-200 ${
          showFullDescriptions ? 'scale-110 z-50' : 'hover:scale-105'
        }`}
        style={{ 
          borderColor: bubbleColor,
          boxShadow: `0 0 10px ${bubbleColor}40`,
          minWidth: '120px',
          maxWidth: showFullDescriptions ? '400px' : '280px'
        }}
        onClick={handleBubbleClick}
      >
        {/* Speech bubble tail pointing upward */}
        <div 
          className="absolute -top-2 left-1/2 transform -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: `12px solid ${bubbleColor}`,
          }}
        />
        
        <div className="p-3">
          {!showFullDescriptions ? (
            /* Compact horizontal view */
            <div className="space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">
                Reactions
              </div>
              
              {/* Horizontal layout for stakeholders */}
              <div className="flex flex-wrap gap-1 justify-center">
                {reaction.stakeholders.map((stakeholderReaction, index) => (
                  <div
                    key={stakeholderReaction.stakeholder.id}
                    className="flex items-center gap-1 bg-gray-700 bg-opacity-40 rounded-full px-2 py-1 hover:bg-opacity-60 transition-colors"
                    title={`${stakeholderReaction.stakeholder.name}: ${stakeholderReaction.shortReaction || stakeholderReaction.detailedReaction.substring(0, 50) + '...'}`}
                  >
                    <span className="text-xs">{stakeholderReaction.stakeholder.icon}</span>
                    <span className="text-sm">{stakeholderReaction.emoticon}</span>
                  </div>
                ))}
              </div>
              
              {/* Labels row */}
              <div className="flex flex-wrap gap-1 justify-center text-xs">
                {reaction.stakeholders.map((stakeholderReaction, index) => (
                  <span
                    key={`label-${stakeholderReaction.stakeholder.id}`}
                    className="text-gray-400 text-center"
                  >
                    {stakeholderReaction.stakeholder.name.split(' ')[0]}
                    {index < reaction.stakeholders.length - 1 && <span className="mx-1">•</span>}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-2 pt-1 border-t border-gray-600">
                Click for details
              </div>
            </div>
          ) : (
            /* Expanded view with full descriptions */
            <div className="space-y-4">
              <div className="text-sm text-gray-300 uppercase tracking-wider mb-3 text-center border-b border-gray-600 pb-2">
                Full Stakeholder Reactions
              </div>
              {reaction.stakeholders.map((stakeholderReaction, index) => (
                <div
                  key={stakeholderReaction.stakeholder.id}
                  className="bg-gray-700 bg-opacity-30 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stakeholderReaction.stakeholder.icon}</span>
                      <div>
                        <div className="text-sm text-white font-medium">
                          {stakeholderReaction.stakeholder.name}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {stakeholderReaction.stakeholder.type}
                        </div>
                      </div>
                    </div>
                    <span className="text-xl">{stakeholderReaction.emoticon}</span>
                  </div>
                  
                  <div className="text-sm text-gray-300 leading-relaxed">
                    {stakeholderReaction.detailedReaction}
                  </div>
                  
                  {stakeholderReaction.timestamp && (
                    <div className="text-xs text-gray-500 pt-1 border-t border-gray-600">
                      {stakeholderReaction.timestamp.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
              <div className="text-xs text-gray-400 text-center mt-3 pt-2 border-t border-gray-600">
                Click to collapse
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
