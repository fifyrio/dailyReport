"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Brain,
  Zap,
  Sprout,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
} from "lucide-react"
import type { Note, FullGrowthAdvice } from "@/lib/types"

interface GrowthInsightsProps {
  notes: Note[]
  onBack: () => void
}

const trendIcon = (trend: "up" | "down" | "stable") => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3.5 w-3.5 text-green-500" />
    case "down":
      return <TrendingDown className="h-3.5 w-3.5 text-red-500" />
    default:
      return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

export function GrowthInsights({ notes, onBack }: GrowthInsightsProps) {
  const [advice, setAdvice] = useState<FullGrowthAdvice | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFullAdvice = async () => {
    setIsLoading(true)
    setError(null)

    // 获取最近30天的笔记
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentNotes = notes
      .filter((n) => new Date(n.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (recentNotes.length === 0) {
      setError("暂无足够的记录进行分析，请先记录一些笔记")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/growth-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: recentNotes, mode: "full" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "请求失败")
      }

      const data = await response.json()
      setAdvice(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取分析失败")
    } finally {
      setIsLoading(false)
    }
  }

  // 首次进入自动加载
  useState(() => {
    fetchFullAdvice()
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <Button
          variant="outline"
          onClick={fetchFullAdvice}
          disabled={isLoading}
          className="gap-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          重新分析
        </Button>
      </div>

      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">成长洞察</h1>
            <p className="text-sm text-muted-foreground mt-0.5">基于最近 30 天的复盘记录</p>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-foreground font-medium">正在分析你的成长轨迹...</p>
            <p className="text-sm text-muted-foreground mt-1">AI 正在从多个维度分析你的复盘记录</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-foreground">{error}</p>
            <Button variant="outline" onClick={fetchFullAdvice} className="mt-4 gap-2">
              <RefreshCw className="h-4 w-4" />
              重试
            </Button>
          </div>
        </div>
      )}

      {/* 分析结果 */}
      {advice && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 今昨对比 */}
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-primary to-primary/40" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">今昨对比</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                {advice.todayVsYesterday.comparison}
              </p>
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">可提升方向</span>
                {advice.todayVsYesterday.improvements.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/10">
                    <ArrowUpRight className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 本周趋势 */}
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-accent to-accent/40" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">本周趋势</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                {advice.weeklyTrend.summary}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-medium text-green-600 uppercase tracking-wider">优势</span>
                  <div className="space-y-1.5 mt-2">
                    {advice.weeklyTrend.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">待提升</span>
                  <div className="space-y-1.5 mt-2">
                    {advice.weeklyTrend.gaps.map((g, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <ArrowDownRight className="h-3.5 w-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 知识领域分布 */}
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-500/40" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Brain className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground">知识领域分布</h3>
              </div>
              <div className="space-y-3 mb-4">
                {advice.knowledgeDistribution.areas.map((area, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {area.name}
                      </Badge>
                      {trendIcon(area.trend)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{area.count} 篇</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-foreground leading-relaxed">
                  {advice.knowledgeDistribution.suggestion}
                </p>
              </div>
            </div>
          </div>

          {/* 行动力评估 */}
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-500/40" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-yellow-500/10">
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-foreground">行动力评估</h3>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-foreground">{advice.actionability.score}</div>
                <div className="flex-1">
                  <Progress value={advice.actionability.score} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>需加强</span>
                    <span>优秀</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{advice.actionability.feedback}</p>
            </div>
          </div>

          {/* 成长路径 - 全宽 */}
          <div className="md:col-span-2 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary/40" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Sprout className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">成长路径</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">当前阶段</span>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">{advice.growthPath.currentLevel}</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">下一里程碑</span>
                  </div>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">{advice.growthPath.nextMilestone}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">长期成长建议</span>
                <div className="space-y-2.5 mt-3">
                  {advice.growthPath.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
