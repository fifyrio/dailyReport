"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Star, ArrowRight, Plus, Flame, Target, Lightbulb, TrendingUp, Clock } from "lucide-react"
import { CalendarCard } from "@/components/calendar-card"
import type { Note } from "@/lib/types"

interface DashboardProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
  onNewNote: () => void
}

export function Dashboard({ notes, onSelectNote, onNewNote }: DashboardProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayNotes = notes.filter((n) => new Date(n.createdAt).toDateString() === today)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekNotes = notes.filter((n) => new Date(n.createdAt) >= weekAgo)

    // 计算连续天数
    const sortedDates = [...new Set(notes.map((n) => new Date(n.createdAt).toDateString()))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    )
    let streak = 0
    const checkDate = new Date()
    for (const dateStr of sortedDates) {
      if (new Date(dateStr).toDateString() === checkDate.toDateString()) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    // 类型统计
    const typeCount: Record<string, number> = {}
    notes.forEach((n) => {
      typeCount[n.type] = (typeCount[n.type] || 0) + 1
    })

    // 标签统计
    const tagCount: Record<string, number> = {}
    notes.forEach((n) => {
      n.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    return {
      total: notes.length,
      todayCount: todayNotes.length,
      weekCount: weekNotes.length,
      streak,
      hasTodayNote: todayNotes.length > 0,
      todayNote: todayNotes[0],
      typeCount,
      topTags,
    }
  }, [notes])

  // 按日期分组笔记
  const groupedNotes = useMemo(() => {
    const groups: Record<string, Note[]> = {}
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    notes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .forEach((note) => {
        const dateStr = new Date(note.createdAt).toDateString()
        let label = new Date(note.createdAt).toLocaleDateString("zh-CN", {
          month: "long",
          day: "numeric",
          weekday: "short",
        })
        if (dateStr === today) label = "今天"
        else if (dateStr === yesterday) label = "昨天"

        if (!groups[label]) groups[label] = []
        groups[label].push(note)
      })

    return Object.entries(groups).slice(0, 5)
  }, [notes])

  const typeIcons: Record<string, typeof Lightbulb> = {
    原则卡: Target,
    案例: BookOpen,
    方法论: Lightbulb,
    灵感: Flame,
    反思: TrendingUp,
  }

  const typeColors: Record<string, string> = {
    原则卡: "bg-amber-500/10 text-amber-600 border-amber-200",
    案例: "bg-blue-500/10 text-blue-600 border-blue-200",
    方法论: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    灵感: "bg-purple-500/10 text-purple-600 border-purple-200",
    反思: "bg-rose-500/10 text-rose-600 border-rose-200",
  }

  return (
    <div className="space-y-8">
      <section className="grid lg:grid-cols-3 gap-6">
        {/* 左侧欢迎区 */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-card to-card border border-border/60 p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {new Date().toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-foreground mb-3">
              {stats.hasTodayNote ? "今日已复盘" : "开始今日复盘"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {stats.hasTodayNote ? "很棒！保持每日记录的习惯，让成长可见。" : "记录今天的所学所思，让每一天都有沉淀。"}
            </p>
            <Button onClick={onNewNote} size="lg" className="gap-2 shadow-md">
              <Plus className="h-5 w-5" />
              {stats.hasTodayNote ? "继续记录" : "开始复盘"}
            </Button>
          </div>
          {/* 装饰元素 */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.03]">
            <BookOpen className="h-48 w-48" />
          </div>
        </div>

        {/* 右侧日历打卡 */}
        <CalendarCard notes={notes} />
      </section>

      <section className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">本周记录</span>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.weekCount}</div>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">连续天数</span>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.streak}</div>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">总笔记数</span>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-semibold text-foreground">{stats.total}</div>
        </div>
      </section>

      {/* 主内容区：左侧时间线 + 右侧概览 */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* 时间线 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">复盘时间线</h3>
          </div>

          {groupedNotes.length === 0 ? (
            <div className="bg-card rounded-xl border border-border/60 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">还没有笔记</h4>
              <p className="text-muted-foreground text-sm">点击上方按钮，开始你的第一篇复盘</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedNotes.map(([dateLabel, dateNotes]) => (
                <div key={dateLabel} className="relative">
                  {/* 日期标签 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        dateLabel === "今天"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {dateLabel}
                    </div>
                    <div className="h-px flex-1 bg-border/60" />
                    <span className="text-xs text-muted-foreground">{dateNotes.length} 条</span>
                  </div>

                  {/* 笔记卡片 */}
                  <div className="space-y-3 pl-2">
                    {dateNotes.map((note) => {
                      const TypeIcon = typeIcons[note.type] || Lightbulb
                      return (
                        <article
                          key={note.id}
                          onClick={() => onSelectNote(note)}
                          className="group flex gap-4 p-4 bg-card rounded-xl border border-border/60 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
                        >
                          {/* 类型图标 */}
                          <div
                            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${
                              typeColors[note.type] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            <TypeIcon className="h-5 w-5" />
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {note.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{note.summary}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {note.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                              <div className="flex items-center gap-0.5 ml-auto">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < note.level ? "fill-amber-400 text-amber-400" : "text-border"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 箭头 */}
                          <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-5 w-5 text-primary" />
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右侧概览 */}
        <div className="space-y-6">
          {/* 类型分布 */}
          <div className="bg-card rounded-xl border border-border/60 p-5">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              笔记类型
            </h4>
            <div className="space-y-3">
              {Object.entries(stats.typeCount).map(([type, count]) => {
                const TypeIcon = typeIcons[type] || Lightbulb
                const percentage = Math.round((count / stats.total) * 100)
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{type}</span>
                      </div>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {Object.keys(stats.typeCount).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">暂无数据</p>
              )}
            </div>
          </div>

          {/* 常用标签 */}
          <div className="bg-card rounded-xl border border-border/60 p-5">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              常用标签
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.topTags.map(([tag, count]) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 bg-muted/60 hover:bg-muted transition-colors cursor-default"
                >
                  {tag}
                  <span className="ml-1.5 text-muted-foreground">({count})</span>
                </Badge>
              ))}
              {stats.topTags.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 w-full">暂无标签</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
