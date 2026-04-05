import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, Eye, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OnitProject } from '@/types/onit'
import { GOLDEN_CASE_BRIEF, GOLDEN_CASE_PROJECT, GOLDEN_CASE_MESSAGES } from '@/lib/goldenCase'

interface HomePageProps {
  onStartProject: (project: OnitProject) => void
}

const EXAMPLE_BRIEFS = [
  { label: 'AI 购物 App 创作者招募', brief: GOLDEN_CASE_BRIEF, tag: 'Golden Case' },
  { label: '品牌社媒内容矩阵', brief: '帮我为一个新消费品牌搭建小红书+抖音的内容矩阵，包括选题规划、内容生产和发布排期。', tag: '内容创作' },
  { label: '产品发布全流程', brief: '我们要发布一款 SaaS 产品，需要准备产品文档、定价策略、落地页文案和 PR 稿。', tag: '产品发布' },
]

export default function HomePage({ onStartProject }: HomePageProps) {
  const [brief, setBrief] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!brief.trim()) return
    setIsLoading(true)

    // For now, if it matches the golden case brief, load the golden case
    // In production, this would call the backend API
    await new Promise(resolve => setTimeout(resolve, 800))

    const project: OnitProject = {
      ...GOLDEN_CASE_PROJECT,
      id: `project-${Date.now()}`,
      brief: brief.trim(),
      state: 'IDLE',
      agents: [],
      tasks: [],
      messages: [],
      createdAt: Date.now(),
      completedAt: undefined,
    }

    setIsLoading(false)
    onStartProject(project)
  }

  const handleLoadGoldenCase = () => {
    const project: OnitProject = {
      ...GOLDEN_CASE_PROJECT,
      messages: GOLDEN_CASE_MESSAGES,
    }
    onStartProject(project)
  }

  const handleExampleClick = (exampleBrief: string) => {
    setBrief(exampleBrief)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-[var(--color-foreground)] tracking-tight">OnIt</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">beta</span>
        </div>
        <button
          onClick={handleLoadGoldenCase}
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors flex items-center gap-1"
        >
          查看演示案例 <ChevronRight size={14} />
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[var(--color-foreground)] mb-4 leading-tight">
            你说想做什么<br />
            <span className="text-[var(--color-primary)]">AI 团队帮你做完</span>
          </h1>
          <p className="text-[var(--color-muted-foreground)] text-lg max-w-xl mx-auto">
            描述你的目标，OnIt 自动匹配 Agent 团队、拆解任务、执行推进。
            关键节点你来拍板，其余交给 AI。
          </p>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full mb-8"
        >
          <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden focus-within:border-[var(--color-primary)] transition-colors">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="描述你想完成的事情，越具体越好。例如：我们要在 X 平台招募 AI 购物 App 的创作者，需要竞品调研、设计分享卡片、写招募帖、定向外展..."
              className="w-full bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] p-5 pb-16 resize-none outline-none text-base leading-relaxed min-h-[160px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit()
                }
              }}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="text-xs text-[var(--color-muted-foreground)]">⌘↵ 提交</span>
              <button
                onClick={handleSubmit}
                disabled={!brief.trim() || isLoading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  brief.trim() && !isLoading
                    ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
                {isLoading ? '分析中...' : '开始'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Example Briefs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <p className="text-xs text-[var(--color-muted-foreground)] mb-3 uppercase tracking-wider">快速开始</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EXAMPLE_BRIEFS.map((example) => (
              <button
                key={example.label}
                onClick={() => handleExampleClick(example.brief)}
                className="text-left p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)] transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                    {example.tag}
                  </span>
                  <ChevronRight size={14} className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] transition-colors mt-0.5" />
                </div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">{example.label}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-6 mt-12 text-sm text-[var(--color-muted-foreground)]"
        >
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>自动组建 Agent 团队</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            <span>关键节点你来拍板</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={14} />
            <span>全程透明可审计</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
