# OnIt 白名单迁移清单

**版本**：v1.0  
**日期**：2026-04-05  
**来源仓库**：`ZHouliRic/Dummy`（旧 AgentCoord 仓库）

---

## 说明

白名单迁移原则：只迁移**已验证有效、且迁入后不会污染 OnIt 新对象模型的能力层代码**。所有迁移项必须完成语义清洗与命名清理，不得整页整块搬运旧产品结构。

---

## 已迁移项

| # | 来源文件 | 迁入位置 | 迁移原因 | 语义清洗方式 | 验证状态 |
|---|---|---|---|---|---|
| 1 | `agent-coord-platform/client/src/lib/utils.ts` | `onit/src/lib/utils.ts` | `cn()` 工具函数无语义绑定，是 Tailwind class 合并标准工具 | 直接复用，无需改名 | ✅ 已验证 |
| 2 | `agent-coord-platform/client/src/types/` (部分) | `onit/src/types/onit.ts` | 状态枚举逻辑可复用，但对象名称已全部重写 | `Project` → `OnitProject`，`Task` → `AgentRole`，`ChatMessage` 保留但重新定义 role 类型 | ✅ 已验证 |
| 3 | Golden Case 演示数据结构 | `onit/src/lib/goldenCase.ts` | Golden Case 主链数据是 OnIt 首轮演示的核心，需要完整保留 | 全部重写为新对象模型（`OnitProject` + `AgentRole` + `ChatMessage`），不含旧 workspace 字段 | ✅ 已验证 |
| 4 | Framer Motion 动效模式 | `onit/src/pages/WorkspacePage.tsx` | `y: 8 → 0, opacity: 0 → 1` 入场动效模式已验证有效 | 重新实现，不复制旧组件代码 | ✅ 已验证 |

---

## 待评估迁移项（P1）

| # | 来源 | 候选原因 | 迁移前提条件 |
|---|---|---|---|
| 1 | `agent-coord-platform/server/routers.ts` 中的 LLM 调用封装 | 执行层 LLM 调用逻辑已验证稳定 | 必须重新挂接到 OnIt 的 `Mission`/`AgentRole` 对象模型，不得保留旧 `project`/`task` 命名 |
| 2 | `agent-coord-platform/server/db.ts` 中的数据库查询 helper | 查询模式可复用 | 必须重新设计 schema，不得继承旧表结构 |
| 3 | `agent-coord-platform/client/src/components/AIChatBox.tsx` | 聊天气泡 UI primitive 已完善 | 必须剥离旧的 tRPC 绑定，重新接入 OnIt 的 `ChatMessage` 类型 |

---

## 迁移证据链

所有已迁移项的原始文件均保留在旧仓库 `ZHouliRic/Dummy`，可随时对比验证。迁入后的文件均已完成语义清洗，具体变更见各文件 git diff。
