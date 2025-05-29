import OpenAI from 'openai';
import { TimelineEvent } from '@/types/timeline';
import { processMockQuery } from './mockOpenAIService';

// This interface defines what the LLM response should look like
export interface LLMTimelineResponse {
  generatedEvents: TimelineEvent[];
  explanation: string;
}

// Initialize the OpenAI client with API key from environment variables
const initializeOpenAIClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('OpenAI API key not found - using mock implementation');
    return null;
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
};

// Check if we should use the mock service
const shouldUseMock = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  return !apiKey || apiKey === 'your_openai_api_key_here';
};

// Process user query and generate historical events
export const processTimelineQuery = async (
  userQuery: string,
  existingEvents: TimelineEvent[]
): Promise<LLMTimelineResponse | null> => {
  // Check if we should use the mock implementation
  if (shouldUseMock()) {
    console.log('Using mock OpenAI implementation');
    return processMockQuery(userQuery, existingEvents);
  }

  try {
    const openai = initializeOpenAIClient();
    
    if (!openai) {
      // Fallback to mock if client initialization fails
      console.log('OpenAI client initialization failed, falling back to mock implementation');
      return processMockQuery(userQuery, existingEvents);
    }
    
    // Get the range of existing dates for context
    let minDate = new Date();
    let maxDate = new Date(0);
    if (existingEvents.length > 0) {
      existingEvents.forEach(event => {
        if (event.date < minDate) minDate = new Date(event.date);
        if (event.date > maxDate) maxDate = new Date(event.date);
      });
    }

    // Create the system prompt
    const systemPrompt = `You are an assistant specialized in generating historically accurate timeline events based on user queries.
        
The user will provide a query about historical events they want to visualize. Your job is to:
1. Generate 3-7 historically accurate events related to their query
2. Include precise dates, descriptive titles, and informative descriptions
3. Assign appropriate categories and importance levels (1-5, with 5 being most important)

Format your response as a valid JSON object with the following structure:
{
  "generatedEvents": [
    {
      "id": "string (unique identifier)",
      "date": "YYYY-MM-DD",
      "title": "string (concise title)",
      "description": "string (detailed description)",
      "category": ["string", "string"], 
      "importance": number (1-5),
      "media": [
        {
          "type": "image",
          "url": "string (URL to relevant image)",
          "caption": "string (image description)"
        }
      ]
    }
  ],
  "explanation": "string (brief explanation of the events you've generated)"
}

Only include the JSON object in your response, no other text.`;

    const userPrompt = `Generate historical timeline events related to: "${userQuery}"

Current timeline range: ${minDate.toISOString().split('T')[0]} to ${maxDate.toISOString().split('T')[0]} (if you need context)

Please return a well-formatted JSON that I can directly add to my timeline visualization.`;
    
    // Call the OpenAI API with proper headers
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      console.log('No response content received, falling back to mock implementation');
      return processMockQuery(userQuery, existingEvents);
    }
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      
      // Convert string dates to Date objects
      const generatedEvents: TimelineEvent[] = parsedResponse.generatedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        // Ensure importance is between 1-5
        importance: Math.max(1, Math.min(5, event.importance)) as 1 | 2 | 3 | 4 | 5
      }));
      
      return {
        generatedEvents,
        explanation: parsedResponse.explanation
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response content:', responseContent);
      // Fallback to mock if response parsing fails
      return processMockQuery(userQuery, existingEvents);
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fallback to mock if API call fails
    console.log('API call failed, falling back to mock implementation');
    return processMockQuery(userQuery, existingEvents);
  }
};
