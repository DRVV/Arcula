"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  OnConnect,
} from "reactflow";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import type { AgentNodeData } from "../types/agent";
import { useTemplatesStore } from "./templates";

type AgentNode = Node<AgentNodeData>;

interface TopologyState {
  nodes: AgentNode[];
  edges: Edge[];
  selectedNodeId?: string;

  // actions
  setNodes: (nodes: AgentNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelected: (id?: string) => void;

  addNode: (templateType: string, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, patch: Partial<AgentNodeData>) => void;
  removeNode: (id: string) => void;

  onConnect: OnConnect;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  // apply topology to cluster
  buildApplyPayload: () => { agents: Array<{
    id: string;
    label: string;
    role: string;
    systemPrompt: string;
    mcpServers: string[];
    agentUrls: string[];
  }> };
  applyToCluster: () => Promise<void>;

  reset: () => void;
}

const genId = (prefix = "node") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const useTopologyStore = create<TopologyState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: undefined,

      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      setSelected: (id) => set({ selectedNodeId: id }),

      addNode: (templateType, position) => {
        const tpl = useTemplatesStore.getState().templates.find((t) => t.type === templateType);
        const id = genId(templateType);
        const data: AgentNodeData = {
          label: tpl?.defaults?.label ?? templateType,
          role: (tpl?.defaults?.role as any) ?? "worker",
          prompt: tpl?.defaults?.prompt ?? "",
          mcpServers: (tpl?.defaults as any)?.mcpServers ?? [],
          config: tpl?.defaults?.config ?? {},
          id,
        };
        const newNode: AgentNode = {
          id,
          type: "agent",
          position,
          data,
        };
        set({ nodes: [...get().nodes, newNode], selectedNodeId: id });
      },

      updateNodeData: (id, patch) => {
        set({
          nodes: get().nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
          ),
        });
      },

      removeNode: (id) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
          selectedNodeId:
            get().selectedNodeId === id ? undefined : get().selectedNodeId,
        });
      },

      onConnect: (connection: Connection) => {
        set({ edges: addEdge({ ...connection, label: "A2A" }, get().edges) });
      },

      onNodesChange: (changes: NodeChange[]) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      buildApplyPayload: () => {
        const { nodes, edges } = get();
        const origin =
          (typeof window !== "undefined" && window.location?.origin) ||
          "";
        const agents = nodes.map((n) => {
          const targets = edges
            .filter((e) => e.source === n.id)
            .map((e) => e.target);
          const agentUrls = Array.from(
            new Set(
              targets.map(
                (tid) => `${origin}/a2a/${tid}/.well-known/agent.json`
              )
            )
          );
          return {
            id: n.id,
            label: n.data.label,
            role: String(n.data.role || ""),
            systemPrompt: String(n.data.prompt || ""),
            mcpServers: Array.isArray((n.data as any).mcpServers)
              ? ((n.data as any).mcpServers as string[])
              : [],
            agentUrls,
          };
        });
        return { agents };
      },

      applyToCluster: async () => {
        try {
          const payload = get().buildApplyPayload();
          const res = await fetch("/api/topology/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const text = await res.text();
            console.error("applyToCluster failed:", res.status, text);
            return;
          }
          const data = await res.json();
          console.log("applyToCluster ok:", data);
        } catch (e) {
          console.error("applyToCluster error:", e);
        }
      },

      reset: () => set({ nodes: [], edges: [], selectedNodeId: undefined }),
    }),
    {
      name: "a2a-topology-v1",
      partialize: (s) => ({
        nodes: s.nodes,
        edges: s.edges,
      }),
    }
  )
);
