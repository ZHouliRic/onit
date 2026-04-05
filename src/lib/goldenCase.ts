import type { OnitProject, ChatMessage } from '@/types/onit'

// Golden Case 1: AI Shopping App Creator Recruitment
// This is the canonical demo case for OnIt's new main chain.
// Source: AgentCoordV5Mockup_design_handoff.md §7

export const GOLDEN_CASE_BRIEF = `我们要在 X 平台招募海外 AI 购物应用的内容创作者。
需要先做竞品调研，再设计分享卡片原型，然后写招募帖草稿，最后定向外展联系创作者。
帮我把这件事从头到尾跑一遍。`

export const GOLDEN_CASE_PROJECT: OnitProject = {
  id: 'gc-001',
  brief: GOLDEN_CASE_BRIEF,
  state: 'COMPLETE',
  understanding: '用户需要在 X 平台完成一次 AI 购物 App 创作者招募活动，涉及竞品研究、视觉原型、内容创作和定向外展四个阶段，需要 4 个专业 Agent 协作完成。',
  agents: [
    {
      id: 'agent-research',
      name: '内容研究员',
      function: '使用 Browserbase + Grok 分析前 3 名竞品的 onboarding 流程和 1 星评论，提炼护城河',
      status: 'done',
      currentTask: '竞品调研：分析前 3 名竞品的 onboarding 和 1 星评论',
      output: '竞品分析报告：Honey App 的核心痛点是"优惠码失效率高达 34%"，护城河在于 AI 实时比价能力。',
      dependsOn: [],
    },
    {
      id: 'agent-design',
      name: 'App 原型设计师',
      function: '基于竞品分析，用 Vision LLM 生成 Partiful 风格的分享卡片设计 Prompt',
      status: 'done',
      currentTask: '原型设计：基于竞品分析优化分享卡片',
      output: '设计 Prompt 已生成，突出"一键开团"核心功能，Partiful 风格渐变背景。',
      dependsOn: ['agent-research'],
    },
    {
      id: 'agent-social',
      name: '社媒经理',
      function: '分析近期火爆帖子 Hook，撰写 3 条 A/B 招募帖草稿，经 HitL 审核后发布',
      status: 'done',
      currentTask: '撰写 X 平台招募帖：3 个 A/B 版本',
      output: '招募帖已发布，版本 B（强调"一键开团"）互动率最高，已获 127 次转发。',
      dependsOn: ['agent-research', 'agent-design'],
    },
    {
      id: 'agent-outreach',
      name: '外展专家',
      function: '搜索 TikTok/Amazon 创作者，发送定制化私信，追踪回复',
      status: 'done',
      currentTask: '定向私信 TikTok/Amazon 创作者',
      output: '已发送 50 条私信，收到 8 条回复，3 位创作者表示有意向合作。',
      dependsOn: ['agent-social'],
    },
  ],
  tasks: [
    { id: 't1', title: '竞品调研', description: '分析前 3 名竞品的 onboarding 和 1 星评论', assignedTo: 'agent-research', status: 'done', output: '竞品分析报告' },
    { id: 't2', title: '原型设计', description: '基于竞品分析生成分享卡片设计 Prompt', assignedTo: 'agent-design', status: 'done', output: '设计 Prompt' },
    { id: 't3', title: '招募帖撰写', description: '撰写 3 个 A/B 版本招募帖草稿', assignedTo: 'agent-social', status: 'done', hitlRequired: true, output: '已发布招募帖' },
    { id: 't4', title: '创作者外展', description: '定向私信目标创作者', assignedTo: 'agent-outreach', status: 'done', output: '外展统计报告' },
  ],
  messages: [],
  createdAt: Date.now() - 3600000,
  completedAt: Date.now() - 600000,
}

// Simulated conversation replay for the Golden Case
export const GOLDEN_CASE_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: GOLDEN_CASE_BRIEF,
    timestamp: Date.now() - 3600000,
    type: 'text',
  },
  {
    id: 'm2',
    role: 'manager',
    content: '收到。我理解你需要完成一次 AI 购物 App 创作者招募活动。我来拆解一下这件事：\n\n**需要做 4 件事，按顺序推进：**\n1. 竞品调研 → 内容研究员负责\n2. 原型设计 → App 原型设计师负责（依赖竞品报告）\n3. 招募帖撰写 → 社媒经理负责（需要你审核）\n4. 创作者外展 → 外展专家负责（招募帖发布后启动）\n\n这个方案可以吗？',
    timestamp: Date.now() - 3580000,
    type: 'proposal',
  },
  {
    id: 'm3',
    role: 'user',
    content: '可以，开始吧',
    timestamp: Date.now() - 3560000,
    type: 'text',
  },
  {
    id: 'm4',
    role: 'manager',
    content: '好的，内容研究员已经开始分析竞品了，我会持续汇报进展。',
    timestamp: Date.now() - 3555000,
    type: 'progress',
  },
  {
    id: 'm5',
    role: 'manager',
    content: '**竞品调研完成。** 核心发现：Honey App 最大痛点是优惠码失效率高（34%），用户最想要的是"实时比价"。护城河已提炼，传给原型设计师了。',
    timestamp: Date.now() - 3000000,
    type: 'progress',
  },
  {
    id: 'm6',
    role: 'manager',
    content: '**原型设计完成。** 设计 Prompt 已生成，突出"一键开团"核心功能。社媒经理正在写招募帖草稿。',
    timestamp: Date.now() - 2400000,
    type: 'progress',
  },
  {
    id: 'm7',
    role: 'manager',
    content: '**招募帖草稿已准备好，需要你来决定：**\n\n**版本 A：** "AI 帮你省钱，我们帮你赚钱。招募 AI 购物 App 体验官，月入 5000+ 不是梦。"\n\n**版本 B：** "一键开团，AI 实时比价。我们在找第一批 AI 购物达人，你来吗？"\n\n**版本 C：** "购物这件事，AI 比你更懂。加入我们，成为 AI 购物时代的第一批创作者。"\n\n哪个更好？或者有修改意见？',
    timestamp: Date.now() - 1800000,
    type: 'gate',
  },
  {
    id: 'm8',
    role: 'user',
    content: '版本 B 不错，但语气再激动一点，强调"一键开团"',
    timestamp: Date.now() - 1750000,
    type: 'text',
  },
  {
    id: 'm9',
    role: 'manager',
    content: '明白！社媒经理正在修改版本 B，加强语气和"一键开团"的核心卖点。',
    timestamp: Date.now() - 1740000,
    type: 'progress',
  },
  {
    id: 'm10',
    role: 'manager',
    content: '**招募帖已发布！** 修改后的版本 B 已上线，目前互动数据不错。外展专家开始定向联系创作者了。',
    timestamp: Date.now() - 1200000,
    type: 'progress',
  },
  {
    id: 'm11',
    role: 'manager',
    content: '**全部完成 🎉**\n\n这次招募活动的结果：\n- 招募帖发布，127 次转发\n- 已私信 50 位目标创作者\n- 收到 8 条回复，3 位有合作意向\n\n所有交付物都在右侧面板，随时可以查看。',
    timestamp: Date.now() - 600000,
    type: 'complete',
  },
]
