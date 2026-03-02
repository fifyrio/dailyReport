"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, Star, Quote, Lightbulb, Target, ListChecks, Tag } from "lucide-react"
import type { Note } from "@/lib/types"
import { NoteChat } from "./note-chat"

interface NoteDetailProps {
  note: Note
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function NoteDetail({ note, onBack, onEdit, onDelete }: NoteDetailProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            编辑
          </Button>
          <Button
            variant="ghost"
            onClick={onDelete}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 笔记卡片 */}
      <article className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        {/* 顶部装饰 */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-accent/40" />

        {/* 头部区域 */}
        <header className="px-8 pt-8 pb-6 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{note.type}</Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(note.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-0.5 ml-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < note.level ? "fill-accent text-accent" : "text-border"}`} />
              ))}
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">{note.title}</h1>
        </header>

        {/* 内容区域 - 带横线背景 */}
        <div className="px-8 py-8 space-y-8 paper-lines">
          {/* 一句话要点 */}
          <section>
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
              <Lightbulb className="h-4 w-4" />
              <span>一句话要点</span>
            </div>
            <p className="text-foreground leading-relaxed text-lg pl-6 border-l-2 border-primary/30">{note.summary}</p>
          </section>

          {/* 三指标 */}
          <section>
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <Target className="h-4 w-4" />
              <span>三指标</span>
            </div>
            <div className="space-y-4 pl-6">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">3秒理解</span>
                <p className="text-foreground mt-1.5">{note.threeMetrics.threeSeconds}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">15秒展开</span>
                <p className="text-foreground mt-1.5 leading-relaxed">{note.threeMetrics.fifteenSeconds}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">共鸣词</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.threeMetrics.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="bg-accent/10 border-accent/30 text-accent-foreground"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 三步动作 */}
          <section>
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <ListChecks className="h-4 w-4" />
              <span>三步动作</span>
            </div>
            <div className="space-y-3 pl-6">
              {note.threeActions.map((action, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start p-4 rounded-lg bg-card border border-border/40 shadow-sm"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-foreground leading-relaxed pt-1">{action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 来源/引用 */}
          <section>
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
              <Quote className="h-4 w-4" />
              <span>来源/引用</span>
            </div>
            <p className="text-muted-foreground pl-6 italic">{note.source}</p>
          </section>

          {/* 标签 */}
          <section className="pt-4 border-t border-border/40">
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
              <Tag className="h-4 w-4" />
              <span>标签</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        {/* 底部装饰 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </article>

      <NoteChat note={note} />
    </div>
  )
}
