"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Note } from "@/lib/types"

interface CalendarCardProps {
  notes: Note[]
  onDateSelect?: (date: Date) => void
}

export function CalendarCard({ notes, onDateSelect }: CalendarCardProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // 获取有复盘的日期集合
  const reviewedDates = useMemo(() => {
    const dates = new Set<string>()
    notes.forEach((note) => {
      const dateStr = new Date(note.createdAt).toDateString()
      dates.add(dateStr)
    })
    return dates
  }, [notes])

  // 计算当月统计
  const monthStats = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    let reviewedDays = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const todayDate = today.getDate()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      // 只统计到今天为止
      if (date > today) break
      if (reviewedDates.has(date.toDateString())) {
        reviewedDays++
      }
    }

    const totalDays = isCurrentMonth ? todayDate : daysInMonth
    const percentage = totalDays > 0 ? Math.round((reviewedDays / totalDays) * 100) : 0

    return { reviewedDays, totalDays, percentage }
  }, [currentMonth, reviewedDates])

  // 计算连续打卡天数
  const streak = useMemo(() => {
    let count = 0
    const checkDate = new Date()
    while (true) {
      if (reviewedDates.has(checkDate.toDateString())) {
        count++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }, [reviewedDates])

  // 生成日历数据
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay() // 0 = Sunday
    const daysInMonth = lastDay.getDate()
    const today = new Date()

    const days: {
      date: Date | null
      isToday: boolean
      isReviewed: boolean
      isFuture: boolean
      isPadding: boolean
      noteCount: number
    }[] = []

    // 前置空白
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, isToday: false, isReviewed: false, isFuture: false, isPadding: true, noteCount: 0 })
    }

    // 当月日期
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toDateString()
      const isToday = dateStr === today.toDateString()
      const isReviewed = reviewedDates.has(dateStr)
      const isFuture = date > today
      const noteCount = notes.filter((n) => new Date(n.createdAt).toDateString() === dateStr).length

      days.push({ date, isToday, isReviewed, isFuture, isPadding: false, noteCount })
    }

    return days
  }, [currentMonth, reviewedDates, notes])

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    if (next <= new Date()) {
      setCurrentMonth(next)
    }
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  return (
    <div className="bg-card rounded-xl border border-border/60 p-5">
      {/* 头部：年月 + 导航 */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">
          {currentMonth.toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
        </h4>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={goToToday}>
            今天
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goToNextMonth}
            disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1) > new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (day.isPadding || !day.date) {
            return <div key={`padding-${idx}`} className="aspect-square" />
          }

          return (
            <button
              key={day.date.toISOString()}
              onClick={() => day.isReviewed && onDateSelect?.(day.date!)}
              disabled={!day.isReviewed}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative transition-all
                ${day.isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                ${day.isReviewed ? "bg-amber-500/15 text-amber-700 font-medium hover:bg-amber-500/25 cursor-pointer" : ""}
                ${day.isFuture ? "text-muted-foreground/30 cursor-not-allowed" : ""}
                ${!day.isReviewed && !day.isFuture ? "text-muted-foreground hover:bg-muted/30" : ""}
              `}
              title={day.isReviewed ? `${day.noteCount} 条复盘` : undefined}
            >
              <span>{day.date.getDate()}</span>
              {day.isReviewed && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500" />}
            </button>
          )
        })}
      </div>

      {/* 底部统计 */}
      <div className="mt-4 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">本月完成率</span>
          <span className="text-sm font-medium text-foreground">
            {monthStats.reviewedDays}/{monthStats.totalDays} 天
          </span>
        </div>
        <div className="h-2 bg-muted/60 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${monthStats.percentage}%` }}
          />
        </div>
        {streak > 0 && (
          <div className="flex items-center justify-center gap-2 py-2 bg-amber-500/10 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">已连续打卡 {streak} 天</span>
          </div>
        )}
      </div>
    </div>
  )
}
