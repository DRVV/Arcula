/**
 * Centralized configuration for timeline layout positioning
 * All y-coordinates and spacing values are defined here for easy maintenance
 */
export const TIMELINE_LAYOUT = {
  // Y-coordinates
  BALLOON_Y: 0,           // Event balloons position (above timeline)
  TIMELINE_Y: 350,          // Main timeline horizontal line position
  EXPERT_BUBBLE_Y_OFFSET: 50,  // Distance below timeline for expert bubbles
  
  // X-coordinates and spacing
  UNIFORM_SPACING: 400,     // Horizontal spacing between events
  START_OFFSET: 200,        // Left margin from timeline start
  
  // Derived calculations (using getters for dynamic values)
  get TIMELINE_LABEL_Y() {
    return this.TIMELINE_Y + 30;  // Date labels below timeline
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
