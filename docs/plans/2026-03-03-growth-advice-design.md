# AI 成长建议功能设计文档

**日期:** 2026-03-03
**状态:** 已批准

## 概述

在每日复盘应用中新增 AI 成长建议功能。用户保存笔记后自动生成简短成长建议，同时提供独立的「成长洞察」页面进行多维度综合分析。

## 方案选择

采用 **方案 A：单次 API 调用**，与现有代码风格一致，实现直接，AI 看到完整上下文时分析质量最好。

## API 设计

### POST `/api/growth-advice`

**输入参数：**
- `notes`: Note[] — 用户的历史笔记（quick 模式最近 3 天，full 模式最近 30 天）
- `mode`: "quick" | "full"

**quick 模式输出：**
```json
{
  "todayVsYesterday": "string",
  "quickTips": ["string", "string", "string"]
}
```

**full 模式输出：**
```json
{
  "todayVsYesterday": {
    "comparison": "string",
    "improvements": ["string"]
  },
  "weeklyTrend": {
    "summary": "string",
    "strengths": ["string"],
    "gaps": ["string"]
  },
  "knowledgeDistribution": {
    "areas": [{ "name": "string", "count": "number", "trend": "up|down|stable" }],
    "suggestion": "string"
  },
  "actionability": {
    "score": "number (0-100)",
    "feedback": "string"
  },
  "growthPath": {
    "currentLevel": "string",
    "nextMilestone": "string",
    "recommendations": ["string"]
  }
}
```

**AI Prompt 策略：**
- 系统角色：个人成长教练
- 分析字段：threeActions、tags、type、level、keywords
- 建议要求：具体可操作，避免空洞

## UI 设计

### 1. 快速建议（保存笔记后）

- 位置：`note-detail.tsx` 笔记详情页面底部
- 触发：保存新笔记后自动调用 quick 模式
- 展示：今昨对比摘要 + 3 条快速提示 + 「查看完整分析」链接
- 组件：`growth-quick-advice.tsx`

### 2. 成长洞察页面

- 入口：Header 顶部导航新增「成长洞察」Tab（TrendingUp 图标）
- 布局：多维度分析卡片网格
  - 今昨对比卡片
  - 本周趋势卡片
  - 知识领域分布卡片
  - 行动力评估卡片
  - 成长路径卡片（全宽）
  - 重新分析按钮
- 组件：`growth-insights.tsx`

### 3. 导航变更

- `page.tsx` 新增 `"growth"` 视图状态
- `header.tsx` 新增 Tab 切换按钮

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/api/growth-advice/route.ts` | 新增 | AI 成长建议 API |
| `lib/types.ts` | 修改 | GrowthAdvice 类型定义 |
| `components/growth-insights.tsx` | 新增 | 成长洞察主页面 |
| `components/growth-quick-advice.tsx` | 新增 | 快速建议卡片 |
| `components/header.tsx` | 修改 | 新增导航 Tab |
| `app/page.tsx` | 修改 | 新增 growth 视图状态 |
| `components/note-detail.tsx` | 修改 | 集成快速建议组件 |

## 错误处理

- 无历史记录：显示引导文案
- 仅今天记录无昨天：跳过今昨对比
- API 失败：友好提示 + 重试按钮

## 性能考虑

- quick 模式：仅传最近 3 天笔记
- full 模式：传最近 30 天笔记
- 限制传输数据量以控制 token 消耗
