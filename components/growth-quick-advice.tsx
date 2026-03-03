"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Lightbulb, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import type { Note, QuickGrowthAdvice } from "@/lib/types"

interface GrowthQuickAdviceProps {
  note: Note
  allNotes: Note[]
  onViewFullInsights: () => void
}

export function GrowthQuickAdvice({ note, allNotes, onViewFullInsights }: GrowthQuickAdviceProps) {
  const [advice, setAdvice] = useState<QuickGrowthAdvice | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAdvice = async () => {
    setIsLoading(true)
    setError(null)

    // 获取最近3天的笔记
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const recentNotes = allNotes
      .filter((n) => new Date(n.createdAt) >= threeDaysAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (recentNotes.length === 0) {
      setError("暂无足够的记录进行分析")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/growth-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: recentNotes, mode: "quick" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "请求失败")
      }

      const data = await response.json()
      setAdvice(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取建议失败")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvice()
  }, [note.id])

  if (error) {
    return (
      <div className="mt-8 p-6 bg-card rounded-2xl border border-border/60 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchAdvice} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
      {/* 顶部装饰 */}
      <div className="h-1.5 bg-gradient-to-r from-accent via-primary to-accent/40" />

      <div className="p-6 space-y-5">
        {/* 标题栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">AI 成长建议</h3>
          </div>
          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
            基于近3天记录
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">正在分析你的成长轨迹...</span>
          </div>
        ) : advice ? (
          <>
            {/* 今昨对比 */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <TrendingUp className="h-4 w-4" />
                <span>变化洞察</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{advice.todayVsYesterday}</p>
            </div>

            {/* 快速建议 */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Lightbulb className="h-4 w-4" />
                <span>成长提示</span>
              </div>
              {advice.quickTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            {/* 查看完整分析 */}
            <Button
              variant="outline"
              onClick={onViewFullInsights}
              className="w-full gap-2 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
            >
              查看完整成长分析
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
