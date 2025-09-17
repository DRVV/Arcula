import type { Node, Edge } from 'reactflow';

export type AgentRole = 'coordinator' | 'worker' | 'tool' | string;

export interface AgentNodeData {
  id?: string; // convenience
  label: string;
  role: AgentRole;
  prompt?: string; // system prompt
  mcpServers?: string[]; // list of MCP server URLs
  config?: Record<string, any>;
}

export type AgentNode = Node<AgentNodeData>;
export type AgentEdge = Edge;
