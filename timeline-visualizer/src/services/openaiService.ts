import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { TimelineEvent } from '@/types/timeline';
import { processMockQuery } from './mockOpenAIService';

// This interface defines what the LLM response should look like
export interface LLMTimelineResponse {
  relevantEvents: TimelineEvent[];
  suggestions: string[];
  explanation: string;
}

// Initialize the OpenAI model with API key from environment variables
const initializeOpenAIClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('OpenAI API key not found - using mock implementation');
    return null;
  }
  
  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4o-mini', // You can adjust this to a different model as needed
    temperature: 0.7,
  });
};

// Check if we should use the mock service
const shouldUseMock = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  return !apiKey || apiKey === 'your_openai_api_key_here';
};

// Process user query and generate response with relevant timeline data
export const processTimelineQuery = async (
  userQuery: string,
  allEvents: TimelineEvent[]
): Promise<LLMTimelineResponse | null> => {
  // Check if we should use the mock implementation
  if (shouldUseMock()) {
    console.log('Using mock OpenAI implementation');
    return processMockQuery(userQuery, allEvents);
  }

  try {
    const model = initializeOpenAIClient();
    
    if (!model) {
      // Fallback to mock if model initialization fails
      console.log('Model initialization failed, falling back to mock implementation');
      return processMockQuery(userQuery, allEvents);
    }
    
    // Convert timeline events to a string format that can be included in the prompt
    const eventsString = allEvents.map(event => 
      `ID: ${event.id}, Date: ${event.date.toISOString().split('T')[0]}, Title: ${event.title}, Category: [${event.category.join(', ')}], Importance: ${event.importance}`
    ).join('\n');
    
    // Create messages for the chat model
    const messages = [
      new SystemMessage(
        `You are an assistant specialized in analyzing timeline data and helping users visualize information.
        
        You will be given a list of timeline events and a user query.
        
        Based on the query, identify the most relevant events from the timeline data, provide suggestions for visualization, 
        and explain your reasoning. Format your response as a valid JSON object with the following structure:
        {
          "relevantEventIds": [list of relevant event IDs as strings],
          "suggestions": [list of visualization suggestions as strings],
          "explanation": "detailed explanation of your analysis"
        }
        
        Only include the JSON object in your response, no other text.`
      ),
      new HumanMessage(
        `Here is a list of timeline events:
        ${eventsString}
        
        User query: "${userQuery}"`
      )
    ];
    
    // Call the OpenAI API
    const result = await model.call(messages);
    
    try {
      // Parse the JSON response from the content field
      const parsedResponse = JSON.parse(result.content.toString());
      
      // Find the full event objects from the list of IDs
      const relevantEvents = allEvents.filter(event => 
        parsedResponse.relevantEventIds.includes(event.id)
      );
      
      return {
        relevantEvents,
        suggestions: parsedResponse.suggestions,
        explanation: parsedResponse.explanation
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response content:', result.content);
      // Fallback to mock if response parsing fails
      return processMockQuery(userQuery, allEvents);
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fallback to mock if API call fails
    console.log('API call failed, falling back to mock implementation');
    return processMockQuery(userQuery, allEvents);
  }
};
