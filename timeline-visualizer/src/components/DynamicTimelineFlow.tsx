'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled for React Flow
// This is necessary because React Flow uses browser APIs
const TimelineFlow = dynamic(() => import('@/components/TimelineFlow'), {
  ssr: false
});

interface DynamicTimelineFlowProps {
  controlsVisible: boolean;
}

export default function DynamicTimelineFlow({ controlsVisible }: DynamicTimelineFlowProps) {
  return <TimelineFlow controlsVisible={controlsVisible} />;
}
