"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Sparkles, User } from "lucide-react"
import type { Note } from "@/lib/types"

interface NoteChatProps {
  note: Note
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function NoteChat({ note }: NoteChatProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // 构建笔记内容字符串
      const noteContent = `
标题：${note.title}
一句话要点：${note.summary}
三指标：
- 3秒：${note.threeMetrics.threeSeconds}
- 15秒：${note.threeMetrics.fifteenSeconds}
- 共鸣词：${note.threeMetrics.keywords.join("、")}
三步动作：
${note.threeActions.map((a, i) => `${i + 1}. ${a}`).join("\n")}
来源：${note.source}
标签：${note.tags.join("、")}
类型：${note.type}
`

      const response = await fetch("/api/chat-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent, userMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "请求失败")
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "抱歉，出现了一些问题，请稍后重试。" }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mt-8 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
      {/* 顶部装饰 */}
      <div className="h-1 bg-gradient-to-r from-accent/40 via-primary/60 to-accent/40" />

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
          <Sparkles className="h-4 w-4" />
          <span>AI 助手</span>
          <span className="text-muted-foreground font-normal ml-2">基于当前笔记内容进行对话</span>
        </div>

        {/* 消息列表 */}
        {messages.length > 0 && (
          <div className="mb-4 space-y-4 max-h-80 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-foreground border border-border/40"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3 border border-border/40">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 输入区域 */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题，如：帮我举几个相关案例..."
              rows={1}
              className="w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/60"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-sm"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>

        {/* 快捷提问 */}
        {messages.length === 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {["帮我深入解释这个概念", "给我更多相关案例", "如何落地执行这三步动作？"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/40"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
