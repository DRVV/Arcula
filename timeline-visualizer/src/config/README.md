# Timeline Layout Configuration

This directory contains centralized configuration for the timeline visualizer layout.

## timelineLayout.ts

All y-coordinates and positioning values for the timeline components are defined in this single file for easy maintenance and modification.

### Key Configuration Values:

- **BALLOON_Y**: Y-coordinate where event balloons appear (default: 150px)
- **TIMELINE_Y**: Y-coordinate of the main horizontal timeline (default: 400px)
- **EXPERT_BUBBLE_OFFSET**: Margin below event balloons for expert reaction bubbles (default: 4 Tailwind units)
- **UNIFORM_SPACING**: Horizontal spacing between events (default: 400px)
- **START_OFFSET**: Left margin from timeline start (default: 200px)

### Derived Values (Calculated Automatically):

- **TIMELINE_LABEL_Y**: Position of date labels below timeline
- **CONTENT_HEIGHT**: Total content height with padding
- **CENTER_Y**: Center point between balloons and timeline

### Usage Example:

To move all event balloons higher on the screen, simply change:
```typescript
BALLOON_Y: 150,  // Change to 100 for higher positioning
```

To move the timeline lower:
```typescript
TIMELINE_Y: 400,  // Change to 500 for lower positioning
```

All components will automatically use the updated values without requiring changes to individual component files.

### Components Using This Configuration:

- `TimelineFlow.tsx` - Main timeline layout and positioning
- `TechExpertBubble.tsx` - Expert reaction bubble positioning
- Any future components that need timeline positioning

This centralized approach ensures consistency across all components and makes layout adjustments much easier to implement and maintain.
