# OnIt

**AI 团队帮你做完。**

OnIt 是一个 AI 团队协调层：用户贴入材料、brief 或目标，系统先理解输入，再抽取岗位职能与任务结构，随后按具体任务匹配或雇佣合适的 Agent，之后进入执行、阻塞、恢复与结果回流。

## 当前阶段

**首轮迁移与重构**（2026-04-05）

- 新主线仓库已建立，完成语义切割
- P0 Blueprint 已输出（见 `docs/P0_Blueprint.md`）
- 白名单迁移清单与禁迁清单已形成（见 `docs/`）
- 最小可运行界面已交付（入口页 + 工作区页）
- Golden Case 演示可运行

## 快速启动

```bash
pnpm install
pnpm dev
# 访问 http://localhost:5174
```

## 目录结构

```
onit/
├── docs/
│   ├── P0_Blueprint.md          # 对象模型、默认入口、主流程、状态流转
│   ├── migration_whitelist.md   # 白名单迁移清单
│   └── migration_banned.md      # 禁迁清单
├── src/
│   ├── types/onit.ts            # 核心数据类型
│   ├── lib/goldenCase.ts        # Golden Case 演示数据
│   ├── pages/HomePage.tsx       # 默认入口（Brief 输入）
│   └── pages/WorkspacePage.tsx  # 工作区（对话 + 执行状态）
└── README.md
```

## 迁移原则

OnIt 是全新主线仓库，不是旧 AgentCoord 仓库的换皮延续。旧仓库（`ZHouliRic/Dummy`）今后只作为参考库。
