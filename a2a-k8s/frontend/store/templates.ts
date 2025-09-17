"use client";

import { create } from 'zustand';
import type { AgentNodeData } from '../types/agent';

export interface AgentTemplate {
  type: string;
  label: string;
  defaults?: Partial<AgentNodeData>;
}

interface TemplatesState {
  templates: AgentTemplate[];
}

export const useTemplatesStore = create<TemplatesState>(() => ({
  templates: [
    {
      type: 'coordinator',
      label: 'Coordinator',
      defaults: {
        role: 'coordinator',
        label: 'Coordinator',
        prompt: 'You are the coordinator. Plan and orchestrate tasks among agents.',
      },
    },
    {
      type: 'echo',
      label: 'Echo Worker',
      defaults: {
        role: 'worker',
        label: 'Echo',
        prompt: 'Repeat user content verbatim.',
      },
    },
    {
      type: 'math',
      label: 'Math Worker',
      defaults: {
        role: 'worker',
        label: 'Math',
        prompt: 'Solve simple arithmetic. Prefer tools when available.',
      },
    },
  ],
}));
