import React, { useEffect, useRef } from 'react';
import { ReactionData } from '@/types/timeline';

interface ExpertDetailPanelProps {
  reaction: ReactionData;
  onClose: () => void;
}

export default function ExpertDetailPanel({ reaction, onClose }: ExpertDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on ESC key press
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

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add slight delay to prevent immediate closing when the bubble is clicked
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={panelRef}
      className="fixed bottom-4 left-1/2 z-50 w-full max-w-2xl px-4 animate-slide-up"
      style={{
        transform: 'translateX(-50%)',
        animation: 'slideUp 0.3s ease-out forwards',
        bottom: '20vh'
      }}
    >
      {/* Main panel with horizontal layout */}
      <div 
        className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-blue-400/30 shadow-2xl overflow-hidden flex"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.2)',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.95) 100%)',
          minHeight: '200px'
        }}
      >
        {/* Left side: Header and content */}
        <div className="flex-1 p-6">
          {/* Header section */}
          <div className="mb-4 pb-4 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-2">
              Tech Expert
            </h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-400/30">
                {reaction.stakeholder.name}
              </span>
              <span className="text-lg">
                {reaction.emoticon}
              </span>
              <span className="text-gray-400 text-sm capitalize">
                {reaction.emotion}
              </span>
            </div>
          </div>

          {/* Content section */}
          <div className="space-y-4">
            {/* Short description */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-2">
                Quick Take
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {reaction.shortDescription}
              </p>
            </div>

            {/* Detailed reaction */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-2">
                Detailed Analysis
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                {reaction.detailedReaction}
              </p>
            </div>

            {/* Timestamp */}
            {reaction.timestamp && (
              <div className="pt-2">
                <div className="text-gray-500 text-xs">
                  {reaction.timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Diamond expert icon */}
        <div className="flex-shrink-0 w-32 flex items-center justify-center bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-l border-blue-400/20">
          <div 
            className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center transform rotate-45"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          >
            <div className="transform -rotate-45">
              <span className="text-2xl">
                {reaction.stakeholder.icon}
              </span>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/50"
          onClick={onClose}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Bottom decoration */}
      <div 
        className="h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rounded-b-2xl"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 25%, rgba(59, 130, 246, 0.6) 50%, rgba(59, 130, 246, 0.3) 75%, transparent 100%)'
        }}
      />

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
