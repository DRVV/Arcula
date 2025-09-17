"use client";

import { create } from "zustand";
import type { Node, Edge } from "reactflow";
import type { ClusterPod, ClusterStatusPayload, PodPhase } from "../types/cluster";

interface ClusterState {
  pods: ClusterPod[];
  rfNodes: Node[];
  rfEdges: Edge[];
  polling: boolean;
  lastUpdated?: number;

  fetchOnce: () => Promise<void>;
  transform: (pods: ClusterPod[]) => { nodes: Node[]; edges: Edge[] };
  startPolling: (intervalMs?: number) => void;
  stopPolling: () => void;
}

let pollingHandle: any = null;

const statusColor = (status: PodPhase): { bg: string; border: string } => {
  switch (status) {
    case "Running":
      return { bg: "#ecfdf5", border: "#10b981" }; // green
    case "Pending":
      return { bg: "#fff7ed", border: "#f59e0b" }; // amber
    case "Failed":
      return { bg: "#fee2e2", border: "#ef4444" }; // red
    case "Succeeded":
      return { bg: "#eef2ff", border: "#6366f1" }; // indigo
    case "Unknown":
    default:
      return { bg: "#f3f4f6", border: "#9ca3af" }; // gray
  }
};

export const useClusterStore = create<ClusterState>((set, get) => ({
  pods: [],
  rfNodes: [],
  rfEdges: [],
  polling: false,
  lastUpdated: undefined,

  fetchOnce: async () => {
    try {
      const res = await fetch("/api/cluster", { cache: "no-store" });
      const data = (await res.json()) as ClusterStatusPayload;
      const pods = Array.isArray(data?.pods) ? data.pods : [];
      const { nodes, edges } = get().transform(pods);
      set({
        pods,
        rfNodes: nodes,
        rfEdges: edges,
        lastUpdated: Date.now(),
      });
    } catch (_e) {
      // on error keep old state, maybe show a small indicator in UI later
    }
  },

  transform: (pods: ClusterPod[]) => {
    // simple grid layout by cluster/namespace grouping
    const byGroup = new Map<string, ClusterPod[]>();
    for (const p of pods) {
      const key = `${p.cluster || "c?"}/${p.namespace}`;
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key)!.push(p);
    }

    const nodes: Node[] = [];
    const edges: Edge[] = []; // optional for now

    let groupIndex = 0;
    for (const [groupKey, groupPods] of byGroup) {
      const [cluster, namespace] = groupKey.split("/");
      // header node (group) could be added later as parent; for now, offset base
      const baseX = 40 + (groupIndex % 2) * 520;
      const baseY = 40 + Math.floor(groupIndex / 2) * 300;

      groupPods.forEach((p, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = baseX + col * 120;
        const y = baseY + row * 100;

        const colors = statusColor(p.status);
        nodes.push({
          id: p.id,
          position: { x, y },
          data: {
            label: `${p.name}`,
            status: p.status,
            namespace,
            cluster,
            role: p.role || "",
          },
          style: {
            padding: 8,
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            fontSize: 12,
            width: 160,
          },
          draggable: false,
          selectable: false,
          type: undefined,
        });
      });

      groupIndex++;
    }

    return { nodes, edges };
  },

  startPolling: (intervalMs = 5000) => {
    if (get().polling) return;
    set({ polling: true });
    // kick off immediately
    get().fetchOnce();
    pollingHandle = setInterval(() => {
      get().fetchOnce();
    }, intervalMs);
  },

  stopPolling: () => {
    if (pollingHandle) {
      clearInterval(pollingHandle);
      pollingHandle = null;
    }
    set({ polling: false });
  },
}));
