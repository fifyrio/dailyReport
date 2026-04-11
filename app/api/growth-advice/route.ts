export async function POST(request: Request) {
  try {
    const { notes, mode } = await request.json()

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return Response.json({ error: "没有可分析的笔记记录" }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({ error: "API Key未配置" }, { status: 500 })
    }

    const isQuick = mode === "quick"

    const notesText = notes
      .map(
        (n: { createdAt: string; title: string; summary: string; threeMetrics: { threeSeconds: string; keywords: string[] }; threeActions: string[]; tags: string[]; type: string; level: number }) =>
          `[${new Date(n.createdAt).toLocaleDateString("zh-CN")}] 标题:${n.title} | 要点:${n.summary} | 关键词:${n.threeMetrics.threeSeconds} | 共鸣词:${n.threeMetrics.keywords.join(",")} | 行动:${n.threeActions.join(";")} | 标签:${n.tags.join(",")} | 类型:${n.type} | 价值:${n.level}/5`
      )
      .join("\n")

    const quickPrompt = `你是一位专业的个人成长教练，擅长从日常复盘记录中发现成长模式和提升空间。

请分析以下用户最近的复盘笔记，生成简短的成长建议。

用户笔记记录：
${notesText}

请返回以下JSON格式（只返回JSON，不要有其他文字）：
{
  "todayVsYesterday": "对比最近两天的记录，总结变化和进步（如果只有一天记录则分析当天的特点），不超过100字",
  "quickTips": ["具体可操作的成长建议1", "具体可操作的成长建议2", "具体可操作的成长建议3"]
}

要求：
1. 对比分析要具体，指出哪些方面有进步，哪些方面可以提升
2. 建议要具体可操作，以动词开头
3. 结合用户的实际记录内容给出个性化建议，避免泛泛而谈`

    const fullPrompt = `你是一位专业的个人成长教练，擅长从日常复盘记录中发现成长模式、识别薄弱环节、规划提升路径。

请对以下用户的复盘笔记进行多维度综合分析，提供全面的成长洞察。

用户笔记记录：
${notesText}

请返回以下JSON格式（只返回JSON，不要有其他文字）：
{
  "todayVsYesterday": {
    "comparison": "对比最近两天的记录，详细分析变化：内容深度、关注领域、行动力等方面的变化（如果只有一天记录则分析当天特点），150字以内",
    "improvements": ["可提升点1：具体描述+提升方向", "可提升点2：具体描述+提升方向"]
  },
  "weeklyTrend": {
    "summary": "分析最近一周的整体趋势：记录频率、内容质量（level变化）、关注点变化等，150字以内",
    "strengths": ["优势1", "优势2"],
    "gaps": ["不足1", "不足2"]
  },
  "knowledgeDistribution": {
    "areas": [{"name": "领域名称", "count": 该领域笔记数量, "trend": "up/down/stable"}],
    "suggestion": "知识领域覆盖建议，指出哪些领域可以加强，100字以内"
  },
  "actionability": {
    "score": 0到100的行动力评分,
    "feedback": "行动力评估：分析用户行动计划的具体性、可执行性、完成度等，100字以内"
  },
  "growthPath": {
    "currentLevel": "描述用户当前的成长阶段和特点，80字以内",
    "nextMilestone": "下一个成长里程碑建议，80字以内",
    "recommendations": ["长期成长建议1：具体可操作", "长期成长建议2：具体可操作", "长期成长建议3：具体可操作"]
  }
}

要求：
1. 所有分析必须基于用户的实际记录内容，引用具体笔记内容
2. 建议要个性化、具体可操作，避免泛泛而谈
3. 知识领域areas数组根据tags和type统计，最多列出5个主要领域
4. 行动力评分考虑：行动计划的具体性（是否有明确步骤）、领域多样性、记录频率
5. 成长路径要有前瞻性，结合用户的关注领域提出可行的下一步`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://daily-note.vercel.app",
        "X-Title": "Daily Note",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "bytedance-seed/seed-2.0-lite",
        messages: [
          { role: "system", content: isQuick ? quickPrompt : fullPrompt },
          { role: "user", content: "请根据以上笔记记录生成成长建议分析。" },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[growth-advice] OpenRouter API error:", response.status, errorText)
      return Response.json({ error: `API调用失败: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    const generatedContent = data.choices?.[0]?.message?.content

    if (!generatedContent) {
      return Response.json({ error: "AI生成失败，未返回内容" }, { status: 500 })
    }

    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: "解析AI返回内容失败" }, { status: 500 })
    }

    const adviceData = JSON.parse(jsonMatch[0])
    return Response.json(adviceData)
  } catch (error) {
    console.error("[growth-advice] Error:", error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return Response.json({ error: `生成成长建议失败: ${errorMessage}` }, { status: 500 })
  }
}
