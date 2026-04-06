# OnIt Phase 1 - WP1 结构化回传双审结论报告

**审查日期**：2026-04-06
**审查人**：Manus AI
**审查对象**：OnIt 主线仓库 `ZHouliRic/onit`，Commit `a4f5e45` (WP1: decouple custom brief path from Golden Case demo path)

---

## 1. 审查概述

本次审查针对 OnIt Phase 1 的核心交付物——**WP1 结构化回传**进行 QA（质量保证）与 Design（设计语义）双重视角的全面评估。WP1 的核心目标是在代码层将用户自定义输入（Custom Brief）与 Golden Case 演示路径彻底分流，确保新系统不被旧系统（Dummy 仓库）的结构污染。

经过代码审查、编译验证与逻辑分析，**WP1 结构化回传通过双审，准予进入 WP2 阶段。**

---

## 2. QA 审查结论 (Quality Assurance)

QA 审查主要关注代码的正确性、编译状态以及两条路径的物理隔离情况。

### 2.1 编译与构建验证
- **TypeScript 严格检查**：执行 `npx tsc --noEmit`，退出码为 `0`，无任何类型错误。
- **生产环境构建**：执行 `npx vite build`，成功构建客户端环境，无报错，耗时约 371ms。

### 2.2 路径隔离验证
WP1 成功实现了 Custom 路径与 Demo 路径的硬隔离：
- **工厂模式隔离**：新增 `src/lib/projectFactory.ts` 作为 Custom 路径的唯一构造器。该文件内**没有任何**对 `goldenCase.ts` 的引用。
- **状态机隔离**：
  - Custom 路径（`createFreshProject`）初始状态为 `UNDERSTANDING`，并带有明确的占位提示（"WP1 骨架验证中 — LLM 接入将在 WP2 完成"）。
  - Demo 路径（`GOLDEN_CASE_PROJECT`）初始状态为 `COMPLETE`，直接展示完整结果。
- **入口分流**：`HomePage.tsx` 中，用户提交 Brief 走 `handleSubmit` 调用工厂函数；点击"查看演示案例"走 `handleLoadGoldenCase` 加载静态数据。两者在 `App.tsx` 层面通过 `WorkspaceMode` (`'custom' | 'demo'`) 进行显式区分。

**QA 结论：通过。代码结构清晰，编译通过，两条执行路径在逻辑上实现了完全解耦。**

---

## 3. Design 审查结论 (Design & Semantics)

Design 审查主要依据 `migration_banned.md` 和 `P0_Blueprint.md`，评估系统是否彻底摆脱了旧系统的语义污染。

### 3.1 禁迁项排查
通过对 `src/` 目录的全局检索，确认以下旧系统污染源已被彻底清除：
- **旧对象命名**：未发现 `pipelineRun`、`teamPlan`、`approveTeamPlan` 等 Paperclip 内部或旧工作流命名。
- **旧类型污染**：未发现旧的、无作用域的 `Project` 类型定义，全部统一使用 `OnitProject`。
- **旧入口结构**：首页已重构为以 Brief 输入框为核心的单一入口，彻底废弃了旧版的"项目列表 + 新建按钮"模式。

### 3.2 UI 分流与心智隔离
- **模式标识 (Mode Badge)**：`WorkspacePage.tsx` 顶部增加了明确的模式标识。Demo 模式显示醒目的琥珀色"演示" Badge，Custom 模式显示灰色的"自定义" Badge，有效防止用户产生"为什么我输入的内容变成了购物 App 招募"的认知混淆。
- **空状态处理**：在 Custom 模式下，当 Agent 团队尚未组建时，UI 会明确提示"Agent 团队待组建"及"LLM 接入后自动生成"，管理了用户的预期。
- **Golden Case 降级**：Golden Case 仅作为静态演示数据存在于 `src/lib/goldenCase.ts` 中，不再作为任何新项目的模板或默认值。首页的 `EXAMPLE_BRIEFS` 也已移除了 Golden Case 相关的快捷输入。

**Design 结论：通过。系统成功确立了"少结构多智能"的新基线，语义边界清晰，未发现旧系统心智残留。**

---

## 4. 后续建议 (WP2 展望)

WP1 已成功搭建了干净的骨架，为 WP2 接入真实 LLM 扫清了障碍。针对下一阶段，提出以下建议：

1. **LLM 接入点**：在 `projectFactory.ts` 生成初始项目后，WP2 需要在 `WorkspacePage` 或一个全局的协调层中，监听 `UNDERSTANDING` 状态，并触发真实的 LLM 调用以解析 Brief。
2. **状态流转闭环**：目前 Custom 模式停留在 `UNDERSTANDING` 状态。WP2 需要实现从 `UNDERSTANDING` -> `PROPOSING` -> `CONFIRMING` 的状态流转逻辑。
3. **流式输出 UI**：为配合 LLM 的流式输出，`ChatPanel` 可能需要增加对流式文本渲染的支持，以提升用户体验。

---
*本报告由 Manus AI 自动生成并验证。*
