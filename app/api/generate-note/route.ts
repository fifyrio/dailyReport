export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return Response.json({ error: "内容不能为空" }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({ error: "API Key未配置" }, { status: 500 })
    }

    const systemPrompt = `你是一个专业的知识管理助手，擅长将用户输入的内容整理成结构化的笔记卡片。

请根据用户输入的内容，生成以下JSON格式的笔记信息：

{
  "title": "简洁有力的标题，概括核心主题",
  "summary": "一句话要点，精炼概括核心内容",
  "threeMetrics": {
    "threeSeconds": "3秒概括，用 | 分隔的3个关键词或短语",
    "fifteenSeconds": "15秒展开，详细解释每个要点的含义和关联",
    "keywords": ["共鸣词1", "共鸣词2", "共鸣词3"]
  },
  "threeActions": ["行动1：具体可执行的步骤", "行动2：具体可执行的步骤", "行动3：具体可执行的步骤"],
  "tags": ["标签1", "标签2", "标签3"],
  "type": "原则卡/案例卡/概念卡/方法卡/灵感卡 中的一个",
  "level": 1-5的数字，表示内容价值等级
}

要求：
1. 标题要简洁有力，不超过20字
2. 一句话要点要精炼，不超过50字
3. 3秒概括用 | 分隔3个关键点
4. 15秒展开要有逻辑性，说明各要点之间的关联
5. 共鸣词2-5个，选择最能引发共鸣的关键词
6. 三步动作要具体可执行，每条以动词开头
7. 标签2-4个，选择最相关的分类词
8. 类型根据内容性质选择：原则卡(核心理念)、案例卡(具体案例)、概念卡(概念解释)、方法卡(方法论)、灵感卡(灵感想法)
9. 等级根据内容价值评估，5分最高

只返回JSON，不要有其他文字。`

    // 使用原生fetch调用OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://daily-note.vercel.app",
        "X-Title": "Daily Note",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] OpenRouter API error:", response.status, errorText)
      return Response.json({ error: `API调用失败: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    const generatedContent = data.choices?.[0]?.message?.content

    if (!generatedContent) {
      return Response.json({ error: "AI生成失败，未返回内容" }, { status: 500 })
    }

    // 解析JSON
    const jsonMatch = generatedContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: "解析AI返回内容失败" }, { status: 500 })
    }

    const noteData = JSON.parse(jsonMatch[0])

    return Response.json(noteData)
  } catch (error) {
    console.error("[v0] Generate note error:", error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return Response.json({ error: `生成笔记失败: ${errorMessage}` }, { status: 500 })
  }
}
