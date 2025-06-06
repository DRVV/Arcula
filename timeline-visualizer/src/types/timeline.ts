export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: string[];
  importance: 1 | 2 | 3 | 4 | 5; // 1 = minor, 5 = major milestone
  media?: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }[];
  links?: {
    title: string;
    url: string;
  }[];
  position?: { x: number, y: number }; // For custom positioning
  reactions?: ReactionData[]; // Embedded stakeholder reactions
}

export interface TimelineNode {
  id: string;
  type: 'timelineEvent';
  position: { x: number; y: number };
  data: TimelineEvent;
  style?: React.CSSProperties;
}

export interface FilterState {
  categories: Record<string, boolean>;
  minImportance: number;
  dateRange: [Date, Date];
  searchQuery: string;
}

// Reaction system types
export interface Stakeholder {
  id: string;
  name: string;
  type: 'citizen' | 'market' | 'government' | 'media' | 'expert' | 'competitor';
  icon: string; // emoji or icon identifier
}

export interface ReactionData {
  stakeholder: Stakeholder;
  emotion: 'positive' | 'negative' | 'neutral' | 'excited' | 'concerned' | 'surprised' | 'curious' | 'cautious' | 'interested';
  emoticon: string; // emoji representing the reaction
  shortReaction: string; // brief text for bubble display
  detailedReaction: string; // full reaction shown on click
  timestamp?: Date;
}
