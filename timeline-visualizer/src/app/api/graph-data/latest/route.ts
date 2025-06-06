import { NextResponse } from 'next/server';

// CORS headers for frontend polling
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle GET request to fetch latest graph data
export async function GET() {
  try {
    console.log('📤 Frontend polling for latest graph data');
    
    // Check if we have any graph data
    if (!global.latestGraphData) {
      return NextResponse.json(
        { 
          hasData: false,
          message: 'No graph data available'
        },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }
    
    // Return the latest graph data and clear it (one-time consumption)
    const data = global.latestGraphData;
    global.latestGraphData = null; // Clear after serving
    
    console.log(`📊 Serving latest graph data with ${data.events.length} events`);
    
    return NextResponse.json(
      {
        hasData: true,
        ...data
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
    
  } catch (error) {
    console.error('❌ Error fetching latest graph data:', error);
    
    return NextResponse.json(
      { 
        hasData: false,
        error: 'Failed to fetch graph data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
