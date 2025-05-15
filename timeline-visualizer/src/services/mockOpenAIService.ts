import { TimelineEvent } from '@/types/timeline';
import { LLMTimelineResponse } from './openaiService';

// This is a mock implementation of the OpenAI service for testing and demos
// It simulates responses that would otherwise come from the OpenAI API

export const processMockQuery = (
  userQuery: string,
  allEvents: TimelineEvent[]
): Promise<LLMTimelineResponse> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Convert query to lowercase for easier matching
      const query = userQuery.toLowerCase();
      
      // Extract relevant events based on simple keyword matching
      let relevantEvents: TimelineEvent[] = [];
      let explanation = '';
      let suggestions: string[] = [];
      
      // Match based on categories
      if (query.includes('hardware')) {
        relevantEvents = allEvents.filter(event => 
          event.category.includes('hardware')
        );
        explanation = 'I found several hardware-related events in the timeline. These represent key moments in the evolution of mobile device hardware.';
        suggestions = [
          'Try comparing early vs. recent hardware',
          'Look at the relationship between hardware and software evolution'
        ];
      } 
      // Match based on Apple products
      else if (query.includes('apple') || query.includes('iphone') || query.includes('ipad') || query.includes('mac')) {
        relevantEvents = allEvents.filter(event => 
          event.title.toLowerCase().includes('apple') || 
          event.title.toLowerCase().includes('iphone') || 
          event.title.toLowerCase().includes('ipad') ||
          event.description.toLowerCase().includes('apple')
        );
        explanation = 'Here are the key Apple-related events that appear in the timeline. Apple has been a significant innovator in mobile technology.';
        suggestions = [
          'Compare with Android or other competing products',
          'Examine how Apple influenced industry trends'
        ];
      }
      // Match based on Android/Google
      else if (query.includes('android') || query.includes('google')) {
        relevantEvents = allEvents.filter(event => 
          event.title.toLowerCase().includes('android') || 
          event.title.toLowerCase().includes('google') ||
          event.description.toLowerCase().includes('android') ||
          event.description.toLowerCase().includes('google')
        );
        explanation = 'These events relate to Android and Google\'s impact on mobile technology. The Android ecosystem has been a major force in the smartphone market.';
        suggestions = [
          'Look at how Android evolved over time',
          'Compare with iOS and Apple products'
        ];
      }
      // Match based on network technology
      else if (query.includes('network') || query.includes('5g') || query.includes('4g') || query.includes('lte')) {
        relevantEvents = allEvents.filter(event => 
          event.category.includes('network') ||
          event.title.toLowerCase().includes('5g') ||
          event.title.toLowerCase().includes('4g') ||
          event.title.toLowerCase().includes('lte')
        );
        explanation = 'Network technology has been crucial to mobile device evolution. These events highlight key network infrastructure developments.';
        suggestions = [
          'Note how faster networks enabled new mobile capabilities',
          'Examine the timing between network updates and new device features'
        ];
      }
      // Match based on software/apps
      else if (query.includes('software') || query.includes('app') || query.includes('apps')) {
        relevantEvents = allEvents.filter(event => 
          event.category.includes('software') ||
          event.category.includes('operating system') ||
          event.title.toLowerCase().includes('app store') ||
          event.description.toLowerCase().includes('software')
        );
        explanation = 'Software and apps have been essential to the mobile ecosystem. These events show how software has evolved alongside hardware.';
        suggestions = [
          'Look at how app ecosystems developed',
          'Compare different operating system approaches'
        ];
      }
      // Match based on time periods
      else if (query.includes('early') || query.includes('beginning') || query.includes('first')) {
        // Sort by date and take earliest events
        relevantEvents = [...allEvents]
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .slice(0, 5);
        explanation = 'These are the earliest events in mobile technology history shown in the timeline. They represent the foundations of modern mobile devices.';
        suggestions = [
          'Compare with recent developments',
          'Look at how long it took for technology to evolve'
        ];
      }
      // Match based on recent events
      else if (query.includes('recent') || query.includes('latest') || query.includes('newest')) {
        // Sort by date and take latest events
        relevantEvents = [...allEvents]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 5);
        explanation = 'These are the most recent events in the timeline, showing the latest developments in mobile technology.';
        suggestions = [
          'Compare with earlier technology',
          'Look for trends that might continue in the future'
        ];
      }
      // Match based on importance
      else if (query.includes('important') || query.includes('significant') || query.includes('major')) {
        relevantEvents = allEvents.filter(event => event.importance >= 4);
        explanation = 'These events were particularly significant in the evolution of mobile technology, representing major milestones or innovations.';
        suggestions = [
          'Notice how major events often led to new technology waves',
          'Look at the timing between major innovations'
        ];
      }
      // Default response
      else {
        // Take a random selection of 3-5 events
        const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
        relevantEvents = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
        explanation = 'Here are some notable events from the mobile technology timeline that might interest you. You can ask about specific technologies, companies, or time periods for more targeted information.';
        suggestions = [
          'Try asking about specific companies like Apple or Google',
          'Ask about hardware, software, or network developments',
          'Look for early or recent mobile technology events'
        ];
      }
      
      resolve({
        relevantEvents,
        explanation,
        suggestions
      });
      
    }, 1500); // Simulate a 1.5 second delay
  });
};
