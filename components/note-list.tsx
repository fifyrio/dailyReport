"use client"

import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Star, ArrowRight } from "lucide-react"
import type { Note } from "@/lib/types"

interface NoteListProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
}

export function NoteList({ notes, onSelectNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-border">
          <BookOpen className="h-10 w-10 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">笔记本空空如也</h3>
        <p className="text-muted-foreground max-w-sm leading-relaxed">点击上方「新建笔记」，开始记录你的第一篇复盘</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-border/60 pb-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">我的笔记</h2>
          <p className="text-muted-foreground mt-1">共 {notes.length} 条记录</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <article
            key={note.id}
            className="group relative bg-card rounded-xl border border-border/60 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
            onClick={() => onSelectNote(note)}
          >
            {/* 顶部装饰条 */}
            <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary/40 to-transparent" />

            <div className="p-5">
              {/* 头部信息 */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="text-xs font-normal bg-secondary/60">
                  {note.type}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(note.createdAt).toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* 标题 */}
              <h3 className="text-lg font-medium text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {note.title}
              </h3>

              {/* 摘要 */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{note.summary}</p>

              {/* 底部 */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{note.tags.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < note.level ? "fill-accent text-accent" : "text-border"}`} />
                  ))}
                </div>
              </div>

              {/* 悬浮时显示的箭头 */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
