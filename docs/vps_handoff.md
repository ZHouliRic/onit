# OnIt VPS 配置交接文档

**VPS**：104.238.151.156（Vultr Tokyo）
**用户**：root / paperclip
**采集时间**：2026-04-08 UTC

---

## 1. 基础环境

| 项目 | 值 |
|------|------|
| Node.js | v22.22.0 |
| Claude Code | 2.1.92 |
| Paperclip | npx paperclipai（非全局安装） |
| OS | Ubuntu 22.04 |

## 2. Paperclip 服务

| 项目 | 值 |
|------|------|
| 运行方式 | `npm exec paperclipai run --no-repair`（paperclip 用户） |
| 监听端口 | 3100（0.0.0.0） |
| Dashboard URL | http://104.238.151.156:3100 |
| 数据库 | embedded-postgres，端口 54329（127.0.0.1） |
| 存储 | local_disk（`/home/paperclip/.paperclip/instances/default/data/storage`） |
| 认证 | authenticated 模式 |
| 公开 URL | http://104.238.151.156:3100 |

### 配置文件路径
```
/home/paperclip/.paperclip/instances/default/config.json
```

## 3. 公司与 Agent

### 公司
- **Company ID**：`cdf22110-85ad-4ba4-9145-585e0d48af34`
- **名称**：OnIt AI

### Agent 列表

| Agent | ID | Adapter | 角色 |
|-------|------|---------|------|
| Orchestrator-001 V2 | `8d2d6670-82b6-414b-8f28-7baadee1aef4` | claude_local | Task Orchestrator |
| Dev Agent v2 | `c90bc7b6-6eb5-4a7b-b12e-83a4678283fa` | claude_local | Development Engineer |

### AGENTS.MD 内容

**Orchestrator-001 V2**（`/home/paperclip/.paperclip/instances/default/companies/cdf22110-85ad-4ba4-9145-585e0d48af34/agents/8d2d6670-82b6-414b-8f28-7baadee1aef4/instructions/AGENTS.md`）：

```
角色名称：Orchestrator-001 VX
角色介绍：生成权唯一持有者、持有并管理 Agent 资料、版本等相关文档化内容工具
所属部门：人事管理 1/1
核心能力：
1. 任务分解与路由
2. Agent 生命周期管理
3. 合规审计
边界：只做编排、路由、审计和沟通，不写代码、不运行脚本、不做设计
```

**Dev Agent v2**（`/home/paperclip/.paperclip/instances/default/companies/cdf22110-85ad-4ba4-9145-585e0d48af34/agents/c90bc7b6-6eb5-4a7b-b12e-83a4678283fa/instructions/AGENTS.md`）：

```
角色名称：Dev Agent VX
角色介绍：编程权唯二持有者（Ops/Dev）
角色属性：工程研发 1/1
核心能力：
- 代码生成与修改
- Agent 创建与注册（Paperclip API）
- 系统配置
- API 集成
边界：只执行技术任务，不做编排/设计决策
```

## 4. 工作区

### Project 工作区
```
/home/paperclip/onit-workspace/
```
- Git remote：`https://github.com/ZHouliRic/onit.git`
- Branch：`main`
- 最新 commit：`15505bd docs: WP1 QA/Design 双审结论报告 — 通过`
- **node_modules 未安装**（需要 `pnpm install`）
- Owner：`paperclip:paperclip`

### Agent Home 目录（Paperclip 自动创建的 fallback 工作区）
```
/home/paperclip/.paperclip/instances/default/workspaces/8d2d6670-...  (Orchestrator，空)
/home/paperclip/.paperclip/instances/default/workspaces/c90bc7b6-...  (Dev Agent，空)
/home/paperclip/.paperclip/instances/default/workspaces/5958cb98-...  (未知 Agent)
```

### 关键问题
- On-demand heartbeat 的 Context 中 `paperclipWorkspaces: []` 为空
- Agent 使用 fallback workspace（agent home），不使用 project workspace
- `onit-workspace` 已 clone 但 Paperclip 未将其关联到 Agent Run

## 5. Worker 进程

两个独立的 Node.js worker 进程在后台运行：

| Worker | PID | 端口 | 文件 | 用途 |
|--------|-----|------|------|------|
| orchestrator-worker-v2.js | 2083852 | 3300 | `/home/paperclip/orchestrator-worker-v2.js` | Orchestrator HTTP adapter |
| dev-agent-worker-v2.js | 2095008 | 3200 | `/home/paperclip/dev-agent-worker-v2.js` | Dev Agent HTTP adapter |

**注意**：这两个 worker 是之前 HTTP adapter 模式的遗留进程。当前两个 Agent 已切换为 `claude_local` adapter，这些 worker 进程**不再被使用**，但仍在运行中占用资源。

### Worker 技术栈
- 使用 `http` 模块监听 HTTP 请求
- 调用 OpenAI 兼容 API（`forge.manus.ai/v1`，模型 `gpt-4.1-mini`）
- 通过 Paperclip REST API 管理 Issue
- 内嵌角色文档和治理规范 V3

## 6. Claude Code 配置

```
/home/paperclip/.claude/
├── backups/
├── debug/
├── policy-limits.json    → 禁用 remote_control 和 quick_web_setup
├── projects/             → 15 个 session jsonl 文件
└── sessions/
```

### Claude Session 历史
- Dev Agent workspace 有 2 个 session 文件
- paperclip home 有 13 个 session 文件

## 7. 项目代码结构（onit-workspace）

```
onit-workspace/
├── docs/
│   ├── P0_Blueprint.md
│   ├── migration_banned.md
│   ├── migration_whitelist.md
│   └── WP1_Review_Report.md
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── WorkspacePage.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── goldenCase.ts
│   │   └── projectFactory.ts
│   ├── types/
│   │   └── onit.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── public/
├── package.json          → React 19 + Vite 8 + TailwindCSS 4
├── vite.config.ts
└── tsconfig.json
```

## 8. 已知问题清单

| 编号 | 问题 | 严重度 | 状态 |
|------|------|--------|------|
| I-1 | Agent Run 使用 fallback workspace 而非 project workspace | 高 | 未解决 |
| I-2 | node_modules 未安装（onit-workspace） | 中 | 未解决 |
| I-3 | 遗留 HTTP worker 进程仍在运行（3200/3300 端口） | 低 | 未清理 |
| I-4 | Anthropic 529 overloaded_error 导致 Run 失败 | 高 | 外部依赖 |
| I-5 | git safe.directory 需要手动添加 | 低 | 已修复（root 用户） |

## 9. 环境变量（Agent Run 时自动注入）

```
AGENT_HOME=/home/paperclip/.paperclip/instances/default/workspaces/{agent-id}
ANTHROPIC_API_KEY=***REDACTED***
HOME=/home/paperclip
PAPERCLIP_AGENT_ID={agent-id}
PAPERCLIP_API_KEY=***REDACTED*** (run JWT)
PAPERCLIP_API_URL=http://localhost:3100
PAPERCLIP_COMPANY_ID=cdf22110-85ad-4ba4-9145-585e0d48af34
PAPERCLIP_RESOLVED_COMMAND=/usr/bin/claude
PAPERCLIP_RUN_ID={run-id}
PAPERCLIP_WORKSPACE_CWD=/home/paperclip/.paperclip/instances/default/workspaces/{agent-id}
PAPERCLIP_WORKSPACE_SOURCE=agent_home
PAPERCLIP_WORKSPACE_STRATEGY=project_primary
```
