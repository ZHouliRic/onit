// ============================================================
// OnIt Core Data Model
// P0 Blueprint — Object Model
// ============================================================

/**
 * The main pipeline state machine for OnIt.
 * Represents the lifecycle of a user's goal from input to completion.
 *
 * IDLE → UNDERSTANDING → PROPOSING → CONFIRMING
 *                                        ↓
 *                                   EXECUTING ⇄ BLOCKED (HitL)
 *                                        ↓
 *                                    COMPLETE
 */
export type PipelineState =
  | 'IDLE'          // Waiting for user input
  | 'UNDERSTANDING' // Manager is parsing the brief/material
  | 'PROPOSING'     // Manager is generating the task structure + agent roster
  | 'CONFIRMING'    // Waiting for user to approve the plan
  | 'EXECUTING'     // Agents are running tasks
  | 'BLOCKED'       // Human-in-the-Loop: waiting for user decision
  | 'COMPLETE'      // All tasks done, results delivered

/**
 * A single agent role identified from the user's brief.
 * OnIt matches agents to tasks, not the other way around.
 */
export interface AgentRole {
  id: string
  name: string
  function: string          // What this agent does in this project
  status: AgentStatus
  currentTask?: string      // Current task description
  output?: string           // Latest deliverable
  dependsOn?: string[]      // IDs of agents this one depends on
}

export type AgentStatus =
  | 'pending'    // Not yet started
  | 'running'    // Actively executing
  | 'blocked'    // Waiting for HitL decision or dependency
  | 'done'       // Task complete, output available
  | 'failed'     // Execution failed

/**
 * A structured task extracted from the user's brief.
 * OnIt generates these — the user never creates them manually.
 */
export interface Task {
  id: string
  title: string
  description: string
  assignedTo?: string       // AgentRole.id
  status: TaskStatus
  output?: string
  hitlRequired?: boolean    // Whether this task needs a HitL gate
}

export type TaskStatus = 'pending' | 'running' | 'blocked' | 'done' | 'failed'

/**
 * A Human-in-the-Loop decision point.
 * When triggered, execution pauses and the user must decide.
 */
export interface HitLGate {
  id: string
  taskId: string
  prompt: string            // What the manager is asking the user
  options?: string[]        // Optional predefined choices
  draft?: string            // Draft content for review (e.g., social post)
  resolvedAt?: number
  resolution?: string
}

/**
 * The full project state managed by OnIt.
 */
export interface OnitProject {
  id: string
  brief: string             // Raw user input
  state: PipelineState
  understanding?: string    // Manager's parsed understanding of the brief
  agents: AgentRole[]
  tasks: Task[]
  activeGate?: HitLGate
  messages: ChatMessage[]
  createdAt: number
  completedAt?: number
}

/**
 * A message in the manager's conversation with the user.
 */
export interface ChatMessage {
  id: string
  role: 'manager' | 'user'
  content: string
  timestamp: number
  type?: 'text' | 'proposal' | 'gate' | 'progress' | 'complete'
}
