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
