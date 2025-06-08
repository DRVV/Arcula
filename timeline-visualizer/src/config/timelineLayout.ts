/**
 * Centralized configuration for timeline layout positioning
 * All y-coordinates, spacing values, and typography are defined here for easy maintenance
 */
export const TIMELINE_LAYOUT = {
  // Y-coordinates
  TIMELINE_Y: 300,          // Main timeline horizontal line position
  EXPERT_BUBBLE_Y_OFFSET: 50,  // Distance below timeline for expert bubbles
  
  // X-coordinates and spacing
  UNIFORM_SPACING: 400,     // Horizontal spacing between events
  START_OFFSET: 200,        // Left margin from timeline start
  
  // Typography settings
  TYPOGRAPHY: {
    DATE_LABEL_FONT_SIZE: 18,      // Base font size for date labels (larger than before)
    DATE_LABEL_FONT_WEIGHT: '600', // Font weight for date labels
    DATE_LABEL_COLOR: '#D1D5DB',   // Color for date labels
    DATE_LABEL_OFFSET: 40,         // Distance below timeline for date labels
  },
  
  // Node positioning settings
  NODE_POSITIONING: {
    BALLOON_HEIGHT_ESTIMATE: 180,  // Estimated height of event balloons for centering
    BALLOON_OFFSET_FROM_TIMELINE: 350, // Distance above timeline for balloon positioning
    BALLOON_WIDTH: 220,            // Default width of event balloons
    BALLOON_WIDTH_EXPANDED: 300,   // Width when expanded
  },
  
  // Event node height configurations
  // All event node heights are controlled from this central location
  EVENT_NODE_HEIGHTS: {
    IMAGE_HEIGHT: 128,             // Height for event images (h-32 = 128px)
    FALLBACK_HEIGHT: 80,           // Height for fallback placeholder (h-20 = 80px)
    BALLOON_TAIL_HEIGHT: 16,       // Height of the speech balloon tail
    BALLOON_TAIL_OFFSET: 16,       // Bottom offset for the tail positioning
  },
  
  // Derived calculations (using getters for dynamic values)
  get BALLOON_Y() {
    // Position balloons so they center with the timeline and labels
    return this.TIMELINE_Y - this.NODE_POSITIONING.BALLOON_OFFSET_FROM_TIMELINE;
  },
  
  get TIMELINE_LABEL_Y() {
    return this.TIMELINE_Y + this.TYPOGRAPHY.DATE_LABEL_OFFSET;  // Date labels below timeline
  },
  
  get EXPERT_BUBBLE_Y() {
    return this.TIMELINE_Y + this.EXPERT_BUBBLE_Y_OFFSET;  // Expert bubbles below timeline
  },
  
  get CONTENT_HEIGHT() {
    return this.EXPERT_BUBBLE_Y + 150;  // Total content height including expert bubbles
  },
  
  get CENTER_Y() {
    return (this.BALLOON_Y + this.TIMELINE_Y) / 2;  // Center point between balloons and timeline
  }
} as const;

// Type for layout configuration (useful for future extensions)
export type TimelineLayoutConfig = typeof TIMELINE_LAYOUT;
