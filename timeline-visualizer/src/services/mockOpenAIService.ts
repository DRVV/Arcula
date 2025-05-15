import { TimelineEvent } from '@/types/timeline';
import { LLMTimelineResponse } from './openaiService';

// This is a mock implementation of the OpenAI service for testing and demos
// It simulates responses that would otherwise come from the OpenAI API

export const processMockQuery = (
  userQuery: string,
  existingEvents: TimelineEvent[]
): Promise<LLMTimelineResponse> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Convert query to lowercase for easier matching
      const query = userQuery.toLowerCase();
      
      // Generate mock events based on the query
      let generatedEvents: TimelineEvent[] = [];
      let explanation = '';
      
      // Create some sample events based on the query
      // Generate 3-5 random events based on the query term
      const today = new Date();
      const startYear = 1800;
      const endYear = today.getFullYear();

      const commonCategories = ["politics", "technology", "science", "culture", "war", "economics"];
      
      const getRandomDate = () => {
        const year = startYear + Math.floor(Math.random() * (endYear - startYear));
        const month = Math.floor(Math.random() * 12);
        const day = Math.floor(Math.random() * 28) + 1;
        return new Date(year, month, day);
      };

      const numberOfEvents = 3 + Math.floor(Math.random() * 3); // 3-5 events
      const mockEventIds = Array.from({ length: numberOfEvents }, (_, i) => `mock-${Date.now()}-${i}`);
      
      // Create events based on query topic
      if (query.includes('world war')) {
        generatedEvents = [
          {
            id: mockEventIds[0],
            date: new Date('1914-06-28'),
            title: 'Assassination of Archduke Franz Ferdinand',
            description: 'Archduke Franz Ferdinand of Austria was assassinated in Sarajevo, triggering a chain of events that led to World War I.',
            category: ['war', 'politics', 'milestone'],
            importance: 5
          },
          {
            id: mockEventIds[1],
            date: new Date('1915-05-07'),
            title: 'Sinking of the Lusitania',
            description: 'The British ocean liner RMS Lusitania was torpedoed by a German U-boat, killing 1,198 passengers and crew.',
            category: ['war', 'naval'],
            importance: 4
          },
          {
            id: mockEventIds[2],
            date: new Date('1939-09-01'),
            title: 'Germany Invades Poland',
            description: 'Nazi Germany invaded Poland, marking the beginning of World War II in Europe.',
            category: ['war', 'politics', 'milestone'],
            importance: 5
          }
        ];
        explanation = 'These events represent critical moments in World War I and World War II history.';
      }
      else if (query.includes('space') || query.includes('nasa')) {
        generatedEvents = [
          {
            id: mockEventIds[0],
            date: new Date('1957-10-04'),
            title: 'Sputnik 1 Launch',
            description: 'The Soviet Union launched Sputnik 1, the first artificial Earth satellite, beginning the Space Age.',
            category: ['space', 'technology', 'milestone'],
            importance: 5
          },
          {
            id: mockEventIds[1],
            date: new Date('1969-07-20'),
            title: 'Apollo 11 Moon Landing',
            description: 'Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.',
            category: ['space', 'technology', 'milestone'],
            importance: 5
          },
          {
            id: mockEventIds[2],
            date: new Date('1990-04-24'),
            title: 'Hubble Space Telescope Launch',
            description: 'NASA launched the Hubble Space Telescope, revolutionizing astronomy with unprecedented clear images of the universe.',
            category: ['space', 'science', 'innovation'],
            importance: 4
          }
        ];
        explanation = 'These events highlight key milestones in space exploration and astronomy.';
      }
      else if (query.includes('computer') || query.includes('tech')) {
        generatedEvents = [
          {
            id: mockEventIds[0],
            date: new Date('1946-02-14'),
            title: 'ENIAC Unveiled',
            description: 'The Electronic Numerical Integrator and Computer (ENIAC), the first programmable, electronic, general-purpose digital computer, was unveiled at the University of Pennsylvania.',
            category: ['technology', 'computing', 'milestone'],
            importance: 5
          },
          {
            id: mockEventIds[1],
            date: new Date('1975-04-04'),
            title: 'Microsoft Founded',
            description: 'Bill Gates and Paul Allen founded Microsoft, which would become one of the world\'s largest software companies.',
            category: ['technology', 'business', 'computing'],
            importance: 4
          },
          {
            id: mockEventIds[2],
            date: new Date('1989-03-12'),
            title: 'World Wide Web Proposed',
            description: 'Tim Berners-Lee proposed the World Wide Web while working at CERN, revolutionizing information sharing globally.',
            category: ['technology', 'internet', 'milestone'],
            importance: 5
          }
        ];
        explanation = 'These events mark pivotal moments in the history of computing and information technology.';
      }
      else {
        // Generate generic historical events
        for (let i = 0; i < numberOfEvents; i++) {
          generatedEvents.push({
            id: mockEventIds[i],
            date: getRandomDate(),
            title: `Historic event related to ${query} #${i+1}`,
            description: `This is a mock description of a historical event related to ${query}. More details would be provided by the actual AI response.`,
            category: [
              commonCategories[Math.floor(Math.random() * commonCategories.length)],
              commonCategories[Math.floor(Math.random() * commonCategories.length)]
            ],
            importance: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5
          });
        }
        explanation = `Generated ${numberOfEvents} sample historical events related to "${query}". In a real implementation, these would be historically accurate events with proper details.`;
      }

      resolve({
        generatedEvents,
        explanation
      });
      
    }, 1500); // Simulate a 1.5 second delay
  });
};
