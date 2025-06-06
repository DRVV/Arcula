import { NextRequest, NextResponse } from 'next/server';
import { TimelineEvent } from '@/types/timeline';

// Interface for the API request
interface ChatTimelineRequest {
  query: string;
  conversationId?: string;
}

// Interface for the API response
interface ChatTimelineResponse {
  chat: {
    message: string;
    timestamp: string;
    sender: 'assistant';
  };
  timeline: {
    events: TimelineEvent[];
    append: boolean;
  };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Received chat-timeline request');
    
    const body: ChatTimelineRequest = await request.json();
    console.log('💬 User query:', body.query);
    
    // Validate required fields
    if (!body.query || typeof body.query !== 'string') {
      console.error('❌ Missing or invalid query field');
      return NextResponse.json(
        { error: 'Missing or invalid query field' },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }
    
    // Generate mock response based on query
    const response = await generateMockResponse(body.query.trim());
    
    console.log(`✅ Generated response with ${response.timeline.events.length} timeline events`);
    
    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
    
  } catch (error) {
    console.error('❌ Error processing chat-timeline request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Generate mock response based on user query
async function generateMockResponse(query: string): Promise<ChatTimelineResponse> {
  const lowerQuery = query.toLowerCase();
  
  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  // Determine response based on query content
  if (lowerQuery.includes('space') || lowerQuery.includes('nasa') || lowerQuery.includes('moon') || lowerQuery.includes('mars')) {
    return generateSpaceExplorationResponse(query);
  } else if (lowerQuery.includes('tech') || lowerQuery.includes('computer') || lowerQuery.includes('internet') || lowerQuery.includes('ai')) {
    return generateTechnologyResponse(query);
  } else if (lowerQuery.includes('war') || lowerQuery.includes('battle') || lowerQuery.includes('conflict')) {
    return generateWarHistoryResponse(query);
  } else if (lowerQuery.includes('climate') || lowerQuery.includes('environment') || lowerQuery.includes('earth')) {
    return generateClimateResponse(query);
  } else if (lowerQuery.includes('phone') || lowerQuery.includes('mobile') || lowerQuery.includes('smartphone')) {
    return generateMobilePhoneResponse(query);
  } else if (lowerQuery.includes('music') || lowerQuery.includes('song') || lowerQuery.includes('album')) {
    return generateMusicResponse(query);
  } else {
    return generateGeneralResponse(query);
  }
}

function generateSpaceExplorationResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Space exploration has been one of humanity's greatest adventures! From Sputnik to Mars rovers, we've made incredible progress.",
    "The space race transformed our understanding of the universe and led to countless technological innovations.",
    "Space exploration continues to push the boundaries of human knowledge and capabilities.",
  ];
  
  const events: TimelineEvent[] = [
    {
      id: `space-${Date.now()}-1`,
      date: new Date('1957-10-04'),
      title: 'Sputnik 1 Launch',
      description: 'The Soviet Union launches Sputnik 1, the first artificial satellite, marking the beginning of the space age.',
      category: ['space-exploration', 'soviet-union', 'technology'],
      importance: 5
    },
    {
      id: `space-${Date.now()}-2`,
      date: new Date('1969-07-20'),
      title: 'Apollo 11 Moon Landing',
      description: 'Neil Armstrong becomes the first human to walk on the Moon, with Buzz Aldrin following shortly after.',
      category: ['space-exploration', 'usa', 'moon'],
      importance: 5
    },
    {
      id: `space-${Date.now()}-3`,
      date: new Date('2021-02-18'),
      title: 'Perseverance Rover Lands on Mars',
      description: 'NASA\'s Perseverance rover successfully lands on Mars, beginning its mission to search for signs of ancient life.',
      category: ['space-exploration', 'mars', 'nasa', 'modern'],
      importance: 4
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateTechnologyResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Technology has revolutionized every aspect of human life. From the invention of the computer to the rise of artificial intelligence!",
    "The digital revolution has transformed how we communicate, work, and live. It's fascinating to see the rapid pace of innovation.",
    "Computing technology has evolved at an incredible pace, following Moore's Law for decades.",
  ];
  
  const events: TimelineEvent[] = [
    {
      id: `tech-${Date.now()}-1`,
      date: new Date('1975-04-04'),
      title: 'Microsoft Founded',
      description: 'Bill Gates and Paul Allen establish Microsoft, which will become one of the world\'s largest software companies.',
      category: ['technology', 'computing', 'business'],
      importance: 4
    },
    {
      id: `tech-${Date.now()}-2`,
      date: new Date('1989-03-12'),
      title: 'World Wide Web Invented',
      description: 'Tim Berners-Lee proposes the World Wide Web at CERN, revolutionizing information sharing.',
      category: ['technology', 'internet', 'innovation'],
      importance: 5
    },
    {
      id: `tech-${Date.now()}-3`,
      date: new Date('2007-01-09'),
      title: 'iPhone Announcement',
      description: 'Steve Jobs announces the first iPhone, revolutionizing mobile technology and communication.',
      category: ['technology', 'mobile', 'apple'],
      importance: 5
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateWarHistoryResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Military conflicts have shaped world history, often leading to significant social and technological changes.",
    "Wars have unfortunately been a constant throughout human history, but they've also driven innovation and social change.",
    "Understanding military history helps us learn from past conflicts and work toward peaceful solutions.",
  ];
  
  const events: TimelineEvent[] = [
    {
      id: `war-${Date.now()}-1`,
      date: new Date('1939-09-01'),
      title: 'World War II Begins',
      description: 'Germany invades Poland, marking the beginning of World War II in Europe.',
      category: ['world-war', 'military', 'europe'],
      importance: 5
    },
    {
      id: `war-${Date.now()}-2`,
      date: new Date('1945-08-15'),
      title: 'End of World War II',
      description: 'Japan surrenders following the atomic bombings, ending World War II.',
      category: ['world-war', 'military', 'peace'],
      importance: 5
    },
    {
      id: `war-${Date.now()}-3`,
      date: new Date('1989-11-09'),
      title: 'Fall of Berlin Wall',
      description: 'The Berlin Wall falls, symbolizing the end of the Cold War era.',
      category: ['cold-war', 'germany', 'peace'],
      importance: 4
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateClimateResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Climate change is one of the most pressing challenges of our time. Understanding its history helps us address current issues.",
    "Environmental awareness has grown significantly over the past decades, leading to important policy changes.",
    "The relationship between human activity and climate has become increasingly clear through scientific research.",
  ];
  
  const events: TimelineEvent[] = [
    {
      id: `climate-${Date.now()}-1`,
      date: new Date('1970-04-22'),
      title: 'First Earth Day',
      description: 'The first Earth Day is celebrated, marking the beginning of the modern environmental movement.',
      category: ['environment', 'activism', 'awareness'],
      importance: 4
    },
    {
      id: `climate-${Date.now()}-2`,
      date: new Date('1997-12-11'),
      title: 'Kyoto Protocol Adopted',
      description: 'The Kyoto Protocol is adopted, establishing international cooperation on climate change.',
      category: ['environment', 'international', 'policy'],
      importance: 4
    },
    {
      id: `climate-${Date.now()}-3`,
      date: new Date('2015-12-12'),
      title: 'Paris Climate Agreement',
      description: 'The Paris Agreement is adopted, setting global targets for reducing greenhouse gas emissions.',
      category: ['environment', 'international', 'modern'],
      importance: 5
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateMobilePhoneResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Mobile phone evolution has been remarkable! From brick phones to smartphones that are more powerful than early computers.",
    "The mobile revolution changed how we communicate and access information. It's amazing how far we've come!",
    "Smartphones have become essential tools that have transformed nearly every aspect of modern life.",
  ];
  
  const events: TimelineEvent[] = [
    {
      id: `mobile-${Date.now()}-1`,
      date: new Date('1973-04-03'),
      title: 'First Mobile Phone Call',
      description: 'Martin Cooper makes the first public mobile phone call using a Motorola DynaTAC.',
      category: ['mobile-technology', 'communication', 'innovation'],
      importance: 4
    },
    {
      id: `mobile-${Date.now()}-2`,
      date: new Date('1992-12-03'),
      title: 'First Text Message',
      description: 'The first SMS text message "Merry Christmas" is sent, beginning the texting revolution.',
      category: ['mobile-technology', 'communication', 'sms'],
      importance: 3
    },
    {
      id: `mobile-${Date.now()}-3`,
      date: new Date('2007-06-29'),
      title: 'iPhone Launch',
      description: 'Apple launches the first iPhone, revolutionizing the smartphone industry.',
      category: ['mobile-technology', 'smartphone', 'apple'],
      importance: 5
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateMusicResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Music has evolved tremendously over the centuries! From classical compositions to digital streaming, it's been quite a journey.",
    "The music industry has been transformed by technology multiple times - from vinyl to digital downloads to streaming.",
    "Music reflects cultural changes and has been a powerful force for social movements throughout history.",
  ];
  
  const events: TimelineEvent[] = [
    {
      id: `music-${Date.now()}-1`,
      date: new Date('1877-12-06'),
      title: 'Phonograph Invented',
      description: 'Thomas Edison invents the phonograph, the first device to record and reproduce sound.',
      category: ['music-technology', 'invention', 'sound'],
      importance: 4
    },
    {
      id: `music-${Date.now()}-2`,
      date: new Date('1981-08-01'),
      title: 'MTV Launches',
      description: 'MTV begins broadcasting, revolutionizing music promotion and popular culture.',
      category: ['music', 'television', 'culture'],
      importance: 4
    },
    {
      id: `music-${Date.now()}-3`,
      date: new Date('2001-10-23'),
      title: 'iPod Launch',
      description: 'Apple launches the iPod, transforming how people listen to and purchase music.',
      category: ['music-technology', 'digital', 'apple'],
      importance: 4
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateGeneralResponse(query: string): ChatTimelineResponse {
  const responses = [
    "That's an interesting topic! History has many fascinating connections and patterns.",
    "Thanks for your question! Let me share some related historical insights.",
    "History is full of surprising connections. Here are some events that might interest you!",
    "Great question! Historical events often have far-reaching impacts we don't immediately see.",
  ];
  
  const currentYear = new Date().getFullYear();
  const events: TimelineEvent[] = [
    {
      id: `general-${Date.now()}-1`,
      date: new Date(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`),
      title: `User Query: ${query.length > 30 ? query.substring(0, 30) + '...' : query}`,
      description: `User asked: "${query}"\n\nThis query was processed on ${new Date().toLocaleDateString()} and generated relevant timeline content.`,
      category: ['user-interaction', 'query', 'chat-history'],
      importance: 2
    }
  ];
  
  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}
