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
    "threeSeconds": "极简概括，用 | 分隔若干关键词或短语",
    "fifteenSeconds": "展开说明，详细解释每个要点的含义和关联",
    "keywords": ["共鸣词1", "共鸣词2", "..."]
  },
  "threeActions": ["行动1：具体可执行的步骤", "行动2：具体可执行的步骤", "..."],
  "tags": ["标签1", "标签2", "..."],
  "type": "原则卡/案例卡/概念卡/方法卡/灵感卡 中的一个",
  "level": 1-5的数字，表示内容价值等级
}

要求：
1. 标题要简洁有力，不超过20字
2. 一句话要点要精炼，不超过50字
3. threeSeconds 用 | 分隔关键点，按用户实际讲到的要点数量来生成（通常 2-6 个），不要为了凑数而强行拆分或合并
4. fifteenSeconds 要有逻辑性，说明各要点之间的关联
5. keywords 共鸣词按内容实际涵盖的主题来选，通常 2-6 个，选最能引发共鸣的关键词
6. threeActions 行动条目数量必须严格对应用户讲到的实际行动点 —— 用户讲了几个就生成几个，不要固定为 3 个；如果用户讲了 5 件事就生成 5 条，讲了 1 件就生成 1 条；每条以动词开头、具体可执行
7. tags 标签 2-4 个，选择最相关的分类词
8. 类型根据内容性质选择：原则卡(核心理念)、案例卡(具体案例)、概念卡(概念解释)、方法卡(方法论)、灵感卡(灵感想法)
9. 等级根据内容价值评估，5分最高

重要：threeActions 和 keywords 的数量要忠实反映用户原始内容的信息密度，宁可多也不要遗漏，更不要为了"凑齐三个"而编造内容。

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
        model: "bytedance-seed/seed-2.0-lite",
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
