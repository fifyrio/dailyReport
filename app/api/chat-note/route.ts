export async function POST(request: Request) {
  try {
    const { noteContent, userMessage } = await request.json()

    if (!userMessage || userMessage.trim().length === 0) {
      return Response.json({ error: "消息不能为空" }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({ error: "API Key未配置" }, { status: 500 })
    }

    const systemPrompt = `你是一个专业的知识管理助手，擅长帮助用户深化理解和应用所学知识。

当前用户正在复盘的笔记内容如下：
---
${noteContent}
---

请基于这篇笔记的内容，回答用户的问题或提供相关帮助。你可以：
1. 深入解释笔记中的概念
2. 提供更多相关案例
3. 帮助用户制定行动计划
4. 回答用户的疑问
5. 提供延伸阅读建议

回答要求：
- 紧密结合笔记内容
- 语言简洁清晰
- 提供实用的建议
- 适当使用结构化格式（如要点列表）`

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
          { role: "user", content: userMessage },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] OpenRouter API error:", response.status, errorText)
      return Response.json({ error: `API调用失败: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      return Response.json({ error: "AI生成失败，未返回内容" }, { status: 500 })
    }

    return Response.json({ reply })
  } catch (error) {
    console.error("[v0] Chat note error:", error)
    const errorMessage = error instanceof Error ? error.message : "未知错误"
    return Response.json({ error: `对话失败: ${errorMessage}` }, { status: 500 })
  }
}
