/**
 * Centralized configuration for timeline layout positioning
 * All y-coordinates and spacing values are defined here for easy maintenance
 */
export const TIMELINE_LAYOUT = {
  // Y-coordinates
  BALLOON_Y: 150,           // Event balloons position (above timeline)
  TIMELINE_Y: 400,          // Main timeline horizontal line position
  EXPERT_BUBBLE_OFFSET: 4,  // Margin below event balloons for expert bubbles (in Tailwind units)
  
  // X-coordinates and spacing
  UNIFORM_SPACING: 400,     // Horizontal spacing between events
  START_OFFSET: 200,        // Left margin from timeline start
  
  // Derived calculations (using getters for dynamic values)
  get TIMELINE_LABEL_Y() {
    return this.TIMELINE_Y + 30;  // Date labels below timeline
  },
  
  get CONTENT_HEIGHT() {
    return this.TIMELINE_Y - this.BALLOON_Y + 100;  // Total content height with padding
  },
  
  get CENTER_Y() {
    return (this.BALLOON_Y + this.TIMELINE_Y) / 2;  // Center point between balloons and timeline
  }
} as const;

// Type for layout configuration (useful for future extensions)
export type TimelineLayoutConfig = typeof TIMELINE_LAYOUT;
