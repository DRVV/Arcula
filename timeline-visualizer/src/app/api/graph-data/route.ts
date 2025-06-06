import { NextRequest, NextResponse } from 'next/server';

// Interface for the incoming graph data from Chainlit
interface GraphDataRequest {
  raw_content: string;
  json_data: any;
  timestamp?: string;
}

// CORS headers for Chainlit app
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8000',
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

// Handle POST request with graph data from Chainlit
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Received graph data request from Chainlit');
    
    const body: GraphDataRequest = await request.json();
    console.log('📊 Graph data payload:', body);
    
    // Validate required fields
    if (!body.raw_content || !body.json_data) {
      console.error('❌ Missing required fields in request');
      return NextResponse.json(
        { error: 'Missing required fields: raw_content and json_data' },
        { 
          status: 400,
          headers: corsHeaders,
        }
      );
    }
    
    // Process JSON data and convert to timeline events
    const events = processJsonToTimelineEvents(body.json_data, body.raw_content);
    console.log(`🎯 Converted JSON to ${events.length} timeline events`);
    
    // Store the events in a way that the frontend can access them
    // For now, we'll use a simple in-memory store with a timestamp
    const graphDataEntry = {
      id: `graph-${Date.now()}`,
      timestamp: new Date().toISOString(),
      raw_content: body.raw_content,
      json_data: body.json_data,
      events: events,
      processed: true
    };
    
    // You could store this in Redis, database, or use Server-Sent Events
    // For this example, we'll use a simple approach
    global.latestGraphData = graphDataEntry;
    
    console.log('✅ Successfully processed graph data from Chainlit');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Graph data processed successfully',
        eventsCreated: events.length,
        id: graphDataEntry.id
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
    
  } catch (error) {
    console.error('❌ Error processing graph data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process graph data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Function to convert JSON data to timeline events
function processJsonToTimelineEvents(jsonData: any, rawContent: string): any[] {
  const events = [];
  
  try {
    console.log('🔧 Processing JSON data to timeline events:', jsonData);
    
    // Handle different JSON structures
    if (jsonData.workflow && jsonData.workflow.nodes) {
      // Workflow/graph structure
      const workflow = jsonData.workflow;
      
      // Create events for each node
      workflow.nodes.forEach((node: any, index: number) => {
        events.push({
          id: `workflow-node-${node.id || index}`,
          date: new Date().toISOString().split('T')[0], // Today's date
          title: node.label || node.name || `Node ${node.id || index + 1}`,
          description: `${node.type || 'Node'}: ${node.label || node.name || 'Unnamed'}\n\nFrom workflow: ${workflow.title || 'Untitled'}\n\nRaw data: ${JSON.stringify(node, null, 2)}`,
          category: ['workflow', 'graph', 'chainlit'],
          importance: getNodeImportance(node.type),
          position: node.x && node.y ? { x: node.x, y: node.y } : undefined
        });
      });
      
      // Create events for connections/edges if they exist
      if (workflow.edges && workflow.edges.length > 0) {
        workflow.edges.forEach((edge: any, index: number) => {
          events.push({
            id: `workflow-edge-${edge.from}-${edge.to}-${index}`,
            date: new Date().toISOString().split('T')[0],
            title: `Connection: ${edge.from} → ${edge.to}`,
            description: `${edge.label || 'Connection'}\n\nFrom: ${edge.from}\nTo: ${edge.to}\n\nRaw data: ${JSON.stringify(edge, null, 2)}`,
            category: ['workflow', 'connection', 'chainlit'],
            importance: 2
          });
        });
      }
      
    } else if (Array.isArray(jsonData)) {
      // Array of items
      jsonData.forEach((item, index) => {
        events.push({
          id: `json-array-item-${index}-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: item.title || item.name || item.label || `Item ${index + 1}`,
          description: `Array item ${index + 1}:\n\n${JSON.stringify(item, null, 2)}`,
          category: ['json-data', 'array', 'chainlit'],
          importance: 3
        });
      });
      
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // Single object
      const title = jsonData.title || jsonData.name || jsonData.label || 'JSON Object';
      
      events.push({
        id: `json-object-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: title,
        description: `JSON data extracted from Chainlit:\n\n${JSON.stringify(jsonData, null, 2)}\n\nSource content:\n${rawContent.substring(0, 300)}${rawContent.length > 300 ? '...' : ''}`,
        category: ['json-data', 'object', 'chainlit'],
        importance: 4
      });
    }
    
    // If no events were created, create a fallback event
    if (events.length === 0) {
      events.push({
        id: `json-fallback-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: 'Chainlit JSON Data',
        description: `JSON data from Chainlit:\n\n${JSON.stringify(jsonData, null, 2)}`,
        category: ['json-data', 'chainlit'],
        importance: 3
      });
    }
    
    console.log(`✅ Created ${events.length} timeline events from JSON data`);
    return events;
    
  } catch (error) {
    console.error('❌ Error converting JSON to timeline events:', error);
    
    // Return a single error event
    return [{
      id: `json-error-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'JSON Processing Error',
      description: `Failed to process JSON data from Chainlit.\n\nError: ${error}\n\nRaw JSON: ${JSON.stringify(jsonData, null, 2)}`,
      category: ['error', 'chainlit'],
      importance: 1
    }];
  }
}

// Helper function to determine node importance based on type
function getNodeImportance(nodeType: string): number {
  switch (nodeType?.toLowerCase()) {
    case 'start':
    case 'end':
      return 5;
    case 'process':
    case 'task':
      return 4;
    case 'decision':
    case 'condition':
      return 3;
    default:
      return 3;
  }
}

// Declare global type for TypeScript
declare global {
  var latestGraphData: any;
}
