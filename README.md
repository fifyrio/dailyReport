# 每日复盘

一款 AI 驱动的每日复盘笔记应用，帮助你记录、结构化和反思每天的学习与成长。

## 功能

- **AI 笔记生成** — 输入原始想法，AI 自动整理为结构化笔记卡片（标题、要点、三指标、行动步骤等）
- **语音输入** — 支持中英文语音录入，自动转文字
- **AI 对话** — 针对每条笔记与 AI 深入探讨
- **AI 成长建议** — 保存笔记后自动生成成长提示，独立页面提供多维度成长分析（今昨对比、周趋势、知识领域、行动力评估、成长路径）
- **数据看板** — 记录统计、连续打卡、类型分布、标签热度
- **日历视图** — 按月查看复盘完成情况
- **深色模式** — 支持亮色/暗色主题切换

## 技术栈

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- OpenRouter API (GPT-5-mini)
- OpenAI Whisper（语音转文字）
- localStorage 本地存储

## 快速开始

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp env.example .env
# 编辑 .env 填入你的 API Key

# 启动开发服务器
pnpm dev
```

打开 http://localhost:3000 即可使用。

## 环境变量

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API Key（用于语音转文字） |
| `OPENROUTER_API_KEY` | OpenRouter API Key（用于 AI 笔记生成和对话） |

## 项目结构

```
app/
  api/
    generate-note/   # AI 笔记生成
    chat-note/       # AI 对话
    growth-advice/   # AI 成长建议
    transcribe/      # 语音转文字
  page.tsx           # 主页面
components/
  dashboard.tsx      # 数据看板
  note-form.tsx      # 笔记表单
  note-detail.tsx    # 笔记详情
  note-chat.tsx      # AI 对话
  growth-insights.tsx      # 成长洞察页面
  growth-quick-advice.tsx  # 快速成长建议
  calendar-card.tsx  # 日历卡片
  header.tsx         # 顶部导航
lib/
  types.ts           # 类型定义
  storage.ts         # 本地存储
```
