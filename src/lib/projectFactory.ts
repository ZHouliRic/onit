// ============================================================
// OnIt Project Factory
// WP1: Custom brief mode — zero Golden Case dependency
// ============================================================
//
// This module is the ONLY constructor for user-authored projects.
// It must NEVER import from goldenCase.ts.
// Golden Case demo data lives exclusively in goldenCase.ts and
// is only loaded via the explicit demo path in HomePage.
// ============================================================

import type { OnitProject } from '@/types/onit'

/**
 * Create a fresh, empty OnitProject from a user-authored brief.
 * No Golden Case fields, no pre-populated agents, no demo data.
 *
 * State machine entry point: IDLE → UNDERSTANDING (after submit)
 */
export function createFreshProject(brief: string): OnitProject {
  return {
    id: `onit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    brief: brief.trim(),
    state: 'UNDERSTANDING',
    understanding: undefined,
    agents: [],
    tasks: [],
    activeGate: undefined,
    messages: [
      {
        id: `msg-init-${Date.now()}`,
        role: 'manager',
        content: `收到你的需求，正在分析中...\n\n**你的目标**：${brief.trim()}`,
        timestamp: Date.now(),
        type: 'text',
      },
    ],
    createdAt: Date.now(),
    completedAt: undefined,
  }
}
