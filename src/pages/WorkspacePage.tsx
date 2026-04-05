import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Zap, CheckCircle2, Clock, AlertCircle,
  Loader2, ChevronRight, FileText, Users, FlaskConical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OnitProject, AgentRole, ChatMessage } from '@/types/onit'
import type { WorkspaceMode } from '@/App'

interface WorkspacePageProps {
  project: OnitProject
  mode: WorkspaceMode
  onBack: () => void
}

// ── Sub-components ────────────────────────────────────────────

function AgentStatusIcon({ status }: { status: AgentRole['status'] }) {
  switch (status) {
    case 'done':    return <CheckCircle2 size={14} className="text-[var(--color-success)]" />
    case 'running': return <Loader2 size={14} className="text-[var(--color-primary)] animate-spin" />
    case 'blocked': return <AlertCircle size={14} className="text-[var(--color-warning)]" />
    case 'failed':  return <AlertCircle size={14} className="text-[var(--color-destructive)]" />
    default:        return <Clock size={14} className="text-[var(--color-muted-foreground)]" />
  }
}

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

// ── Chat Panel ────────────────────────────────────────────────

function ChatPanel({
  messages,
  state,
  mode,
}: {
  messages: ChatMessage[]
  state: OnitProject['state']
  mode: WorkspaceMode
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && mode === 'custom' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[var(--color-muted-foreground)]">
              <Zap size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">总管正在理解你的需求...</p>
              <p className="text-xs mt-1 opacity-60">后续版本将接入真实 LLM</p>
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              {msg.role === 'manager' && (
                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <Zap size={10} className="text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === 'user'
                    ? "bg-[var(--color-primary)] text-white rounded-tr-sm"
                    : msg.type === 'gate'
                    ? "bg-[var(--color-card)] border border-[var(--color-warning)] text-[var(--color-foreground)] rounded-tl-sm"
                    : msg.type === 'complete'
                    ? "bg-[var(--color-card)] border border-[var(--color-success)] text-[var(--color-foreground)] rounded-tl-sm"
                    : "bg-[var(--color-card)] text-[var(--color-foreground)] rounded-tl-sm"
                )}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator — only in custom mode while processing */}
        {mode === 'custom' && (state === 'UNDERSTANDING' || state === 'PROPOSING') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[var(--color-muted-foreground)] text-sm">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
              <Zap size={10} className="text-white" />
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted-foreground)] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted-foreground)] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted-foreground)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        {/* Custom mode stub — shows what will happen when LLM is wired */}
        {mode === 'custom' && messages.length > 0 && state === 'UNDERSTANDING' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mx-auto mt-4 px-4 py-3 rounded-xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)] text-center max-w-sm"
          >
            <FlaskConical size={14} className="inline mr-1.5 opacity-60" />
            WP1 骨架验证中 — LLM 接入将在 WP2 完成
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ── Canvas Panel ──────────────────────────────────────────────

function CanvasPanel({ project, mode }: { project: OnitProject; mode: WorkspaceMode }) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const completedCount = project.agents.filter(a => a.status === 'done').length
  const totalCount = project.agents.length

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
      {/* Understanding block */}
      {project.understanding && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
          <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">总管理解</p>
          <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{project.understanding}</p>
        </motion.div>
      )}

      {/* Agent roster */}
      {project.agents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">Agent 团队</p>
            {totalCount > 0 && (
              <span className="text-xs text-[var(--color-muted-foreground)]">{completedCount}/{totalCount} 完成</span>
            )}
          </div>
          <div className="space-y-2">
            {project.agents.map((agent, i) => (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all",
                  selectedAgent === agent.id
                    ? "border-[var(--color-primary)] bg-[var(--color-muted)]"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AgentStatusIcon status={agent.status} />
                    <span className="text-sm font-medium text-[var(--color-foreground)]">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                    <span>{{ pending: '等待中', running: '执行中', blocked: '等待决策', done: '已完成', failed: '失败' }[agent.status]}</span>
                    <ChevronRight size={12} className={cn("transition-transform", selectedAgent === agent.id && "rotate-90")} />
                  </div>
                </div>
                <AnimatePresence>
                  {selectedAgent === agent.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)] space-y-2">
                        <p className="text-xs text-[var(--color-muted-foreground)]">职责</p>
                        <p className="text-xs text-[var(--color-foreground)] leading-relaxed">{agent.function}</p>
                        {agent.output && (
                          <>
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-2">交付物</p>
                            <div className="flex items-start gap-2 bg-[var(--color-muted)] rounded-lg p-2">
                              <FileText size={12} className="text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-[var(--color-foreground)] leading-relaxed">{agent.output}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completion card */}
      {project.state === 'COMPLETE' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--color-card)] border border-[var(--color-success)] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-[var(--color-success)]" />
            <p className="text-sm font-medium text-[var(--color-foreground)]">全部完成</p>
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {project.agents.length} 个 Agent 完成了所有任务，交付物已就绪。
          </p>
        </motion.div>
      )}

      {/* Custom mode: empty state with WP1 stub notice */}
      {project.agents.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-[var(--color-muted-foreground)]">
            <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-[var(--color-border)] flex items-center justify-center mx-auto mb-3">
              <Users size={20} className="opacity-30" />
            </div>
            <p className="text-sm">Agent 团队待组建</p>
            {mode === 'custom' && (
              <p className="text-xs mt-1 opacity-60">LLM 接入后自动生成</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── WorkspacePage ─────────────────────────────────────────────

export default function WorkspacePage({ project, mode, onBack }: WorkspacePageProps) {
  const stateLabel: Record<OnitProject['state'], string> = {
    IDLE:         '准备中',
    UNDERSTANDING:'理解需求中',
    PROPOSING:    '制定方案中',
    CONFIRMING:   '等待确认',
    EXECUTING:    '执行中',
    BLOCKED:      '等待决策',
    COMPLETE:     '已完成',
  }
  const stateColor: Record<OnitProject['state'], string> = {
    IDLE:         'text-[var(--color-muted-foreground)]',
    UNDERSTANDING:'text-[var(--color-primary)]',
    PROPOSING:    'text-[var(--color-primary)]',
    CONFIRMING:   'text-[var(--color-warning)]',
    EXECUTING:    'text-[var(--color-primary)]',
    BLOCKED:      'text-[var(--color-warning)]',
    COMPLETE:     'text-[var(--color-success)]',
  }

  const isLive = mode === 'custom' && (
    project.state === 'EXECUTING' ||
    project.state === 'UNDERSTANDING' ||
    project.state === 'PROPOSING'
  )

  return (
    <div className="h-screen flex flex-col bg-[var(--color-background)]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={16} />返回
          </button>
          <div className="w-px h-4 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium text-[var(--color-foreground)] max-w-[200px] truncate">
              {project.brief.slice(0, 30)}{project.brief.length > 30 ? '...' : ''}
            </span>
          </div>
          {/* Mode badge — clearly distinguishes demo from live run */}
          {mode === 'demo' ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
              <FlaskConical size={10} />演示
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
              自定义
            </span>
          )}
        </div>
        <div className={cn("text-xs font-medium flex items-center gap-1.5", stateColor[project.state])}>
          {isLive && <Loader2 size={12} className="animate-spin" />}
          {project.state === 'COMPLETE' && <CheckCircle2 size={12} />}
          {stateLabel[project.state]}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="flex-1 border-r border-[var(--color-border)] flex flex-col min-w-0">
          <div className="px-4 py-2 border-b border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">总管对话</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel messages={project.messages} state={project.state} mode={mode} />
          </div>
        </div>

        {/* Right: Execution status */}
        <div className="w-[380px] flex-shrink-0 flex flex-col">
          <div className="px-4 py-2 border-b border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">执行状态</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <CanvasPanel project={project} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  )
}
