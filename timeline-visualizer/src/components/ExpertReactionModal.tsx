import React, { useEffect } from 'react';
import { ReactionData } from '@/types/timeline';

interface ExpertReactionModalProps {
  reaction: ReactionData;
  onClose: () => void;
}

export default function ExpertReactionModal({ reaction, onClose }: ExpertReactionModalProps) {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Close modal when clicking outside the content area
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Modal content */}
      <div 
        className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl border border-blue-400/30 shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.2)',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.95) 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50 z-10"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Novel game-style layout */}
        <div className="p-8">
          {/* Header section with icon and name */}
          <div className="flex items-center mb-8 pb-6 border-b border-gray-700/50">
            {/* Expert icon section */}
            <div className="flex-shrink-0 mr-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center">
                <img 
                  src="/images/experts/tech-expert.png" 
                  alt="Tech Expert" 
                  className="w-12 h-12 rounded-lg"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-4xl">${reaction.stakeholder.icon}</span>`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Name and title section */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {reaction.stakeholder.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-400/30">
                  Technical Expert
                </span>
                <span className="text-2xl">
                  {reaction.emoticon}
                </span>
              </div>
              <div className="text-gray-400 text-sm mt-2 capitalize">
                Emotion: {reaction.emotion}
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="space-y-6">
            {/* Short description */}
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">
                Quick Take
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <p className="text-gray-300 text-base leading-relaxed">
                  {reaction.shortDescription}
                </p>
              </div>
            </div>

            {/* Detailed reaction */}
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">
                Technical Analysis
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line">
                  {reaction.detailedReaction}
                </p>
              </div>
            </div>

            {/* Timestamp */}
            {reaction.timestamp && (
              <div className="flex justify-center pt-4">
                <div className="text-gray-500 text-sm bg-gray-800/30 px-4 py-2 rounded-full border border-gray-700/30">
                  Recorded: {reaction.timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom decoration */}
        <div 
          className="h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.6) 50%, rgba(59, 130, 246, 0.3) 75%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
}
