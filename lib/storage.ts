import type { Note } from "./types"

const STORAGE_KEY = "daily-notes"

// 示例笔记数据
const defaultNotes: Note[] = [
  {
    id: "1",
    title: "改变人生的三件事：公开工作、分享知识、认真做事",
    summary: "公开工作、分享知识、认真做事，三者相互促进，持续执行可显著改变人生",
    threeMetrics: {
      threeSeconds: "公开工作 | 分享知识 | 认真做事",
      fifteenSeconds: "公开工作扩大接触面与信任，分享逼迫学习与提升地位，认真做事产出可交换价值，三者形成闭环",
      keywords: ["增长", "内容系统", "认知"],
    },
    threeActions: ["在大庭广众下工作并持续曝光", "每天分享一条所知所学", "选择一件事长期认真做出可交换的成果"],
    source: "原创",
    tags: ["增长", "内容系统", "认知"],
    type: "原则卡",
    level: 5,
    createdAt: new Date().toISOString(),
  },
]

export function getNotes(): Note[] {
  if (typeof window === "undefined") return defaultNotes

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // 首次访问，初始化默认数据
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotes))
    return defaultNotes
  }

  try {
    return JSON.parse(stored)
  } catch {
    return defaultNotes
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function addNote(note: Note): Note[] {
  const notes = getNotes()
  const updatedNotes = [note, ...notes]
  saveNotes(updatedNotes)
  return updatedNotes
}

export function updateNote(updatedNote: Note): Note[] {
  const notes = getNotes()
  const updatedNotes = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
  saveNotes(updatedNotes)
  return updatedNotes
}

export function deleteNote(id: string): Note[] {
  const notes = getNotes()
  const updatedNotes = notes.filter((n) => n.id !== id)
  saveNotes(updatedNotes)
  return updatedNotes
}
