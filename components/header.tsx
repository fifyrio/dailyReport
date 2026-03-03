"use client"

import { Button } from "@/components/ui/button"
import { Plus, Feather, Sparkles } from "lucide-react"

type ViewType = "dashboard" | "growth"

interface HeaderProps {
  onNewNote: () => void
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Header({ onNewNote, currentView, onViewChange }: HeaderProps) {
  return (
    <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Feather className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-wide">每日复盘</h1>
            <p className="text-sm text-muted-foreground mt-0.5">记录思考，沉淀智慧</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* 导航 Tabs */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/40">
            <button
              onClick={() => onViewChange("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === "dashboard"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Feather className="h-3.5 w-3.5" />
              复盘
            </button>
            <button
              onClick={() => onViewChange("growth")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === "growth"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              成长洞察
            </button>
          </div>
          <Button onClick={onNewNote} className="gap-2 px-5 py-2.5 shadow-sm">
            <Plus className="h-4 w-4" />
            新建笔记
          </Button>
        </div>
      </div>
    </header>
  )
}
