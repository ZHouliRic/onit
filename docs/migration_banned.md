# OnIt 禁迁清单

**版本**：v1.0  
**日期**：2026-04-05  
**适用范围**：OnIt 新主线仓库首轮及后续所有迭代

---

## 说明

禁迁清单列出了**绝对不能带入 OnIt 新仓库的旧结构、旧命名、旧入口和旧页面**。违反禁迁原则的实现，即使技术上可运行，也直接判定为不通过。

---

## 禁迁项全量清单

### A. 旧默认入口与首页结构

| 禁迁项 | 原因 | 当前处理 |
|---|---|---|
| 旧 workspace 首页（项目列表 + 新建按钮） | 该入口把用户引导到"管理项目"而非"表达目标"，与 OnIt 主链相反 | 未迁入，OnIt 入口为 Brief 输入框 |
| 旧 Agent 面板（先展示 Agent 卡片） | 该入口要求用户先理解 Agent 体系，违反"少结构多智能"原则 | 未迁入 |
| 旧导航骨架（侧边栏 + 顶部 tab） | 旧导航结构反映旧产品信息架构，与 OnIt 新 IA 不兼容 | 未迁入 |

### B. 旧对象命名

| 禁迁项 | 原因 | OnIt 替代命名 |
|---|---|---|
| `Project`（旧项目对象） | 语义模糊，与旧 workspace 心智绑定 | `OnitProject` / `Mission` |
| `Task`（旧任务对象） | 与旧 pipeline task 语义混淆 | `AgentRole` |
| `pipelineRun` | Paperclip 内部实现细节，不应暴露到 OnIt 对象层 | `Execution` |
| `teamPlan` | 旧 workspace 叙事，暗示用户需要"组建团队" | `AgentRoster`（总管提案） |
| `approveTeamPlan` | 旧 API 命名，暗示用户在审批内部流程 | `confirmRoster` |

### C. 旧页面结构与布局

| 禁迁项 | 原因 | 当前处理 |
|---|---|---|
| 旧 workspace 布局（三栏：项目列表 + 主区 + 详情） | 旧布局服务于旧对象模型，与新 IA 不兼容 | 未迁入，OnIt 使用左右双栏（对话 + 状态） |
| 旧 Agent 卡片并排陈列 | 视觉上暗示用户需要理解并选择 Agent，违反"用户只管 What" | 未迁入，OnIt 的 AgentRole 是总管匹配结果，不是用户选择项 |
| 旧结果页（纯文本 resultSummary 展示） | 结果展示方式过于简陋，不体现 OnIt 的交付物组织 | 未迁入，OnIt 结果区展示结构化交付物列表 |

### D. Paperclip 前台结构

| 禁迁项 | 原因 | 当前处理 |
|---|---|---|
| Paperclip 的 issue 列表视图 | Paperclip 是执行层引擎，其前台结构不适合作为 OnIt 产品模板 | 未迁入 |
| Paperclip 的 Heartbeat 编排方式 | 本轮不采用 Heartbeat 模式 | 未迁入 |
| Paperclip 的 secret/credential 管理 UI | 执行层内部细节，不应暴露到 OnIt 前台 | 未迁入 |

### E. 旧数据库 Schema

| 禁迁项 | 原因 | 当前处理 |
|---|---|---|
| 旧 `projects` 表结构 | 字段命名与旧对象模型绑定 | 未迁入，OnIt 将重新设计 schema |
| 旧 `tasks` 表结构 | 同上 | 未迁入 |
| 旧 `pipelineRuns` 表结构 | Paperclip 内部实现细节 | 未迁入 |

---

## 保证未混入的机制

1. **新仓库从零搭建**：OnIt 仓库未从旧仓库 fork，而是全新初始化，从根本上切断了旧结构的默认继承。
2. **类型系统隔离**：`onit/src/types/onit.ts` 中所有类型均为新定义，不 re-export 旧类型。
3. **页面组件全新编写**：`HomePage.tsx` 和 `WorkspacePage.tsx` 均为新文件，不复用旧组件。
4. **命名审查**：代码中不出现 `project`（小写）、`task`、`pipelineRun`、`teamPlan`、`approveTeamPlan` 等旧命名。
