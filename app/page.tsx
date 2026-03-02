"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { NoteForm } from "@/components/note-form"
import { NoteDetail } from "@/components/note-detail"
import { Feather } from "lucide-react"
import type { Note } from "@/lib/types"
import { getNotes, addNote, updateNote, deleteNote } from "@/lib/storage"

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedNotes = getNotes()
    setNotes(storedNotes)
    setIsLoading(false)
  }, [])

  const handleCreateNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    const updatedNotes = addNote(newNote)
    setNotes(updatedNotes)
    setIsFormOpen(false)
  }

  const handleUpdateNote = (note: Omit<Note, "id" | "createdAt">) => {
    if (!editingNote) return
    const updatedNote: Note = {
      ...note,
      id: editingNote.id,
      createdAt: editingNote.createdAt,
    }
    const updatedNotes = updateNote(updatedNote)
    setNotes(updatedNotes)
    setEditingNote(null)
    setIsFormOpen(false)
    setSelectedNote(updatedNote)
  }

  const handleDeleteNote = (id: string) => {
    const updatedNotes = deleteNote(id)
    setNotes(updatedNotes)
    setSelectedNote(null)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background paper-texture flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Feather className="h-6 w-6 animate-pulse" />
          <span className="font-serif">加载中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Feather className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground tracking-wide">每日复盘</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {isFormOpen ? (
          <NoteForm
            note={editingNote}
            onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingNote(null)
            }}
          />
        ) : selectedNote ? (
          <NoteDetail
            note={selectedNote}
            onBack={() => setSelectedNote(null)}
            onEdit={() => handleEditNote(selectedNote)}
            onDelete={() => handleDeleteNote(selectedNote.id)}
          />
        ) : (
          <Dashboard
            notes={notes}
            onSelectNote={setSelectedNote}
            onNewNote={() => {
              setEditingNote(null)
              setIsFormOpen(true)
            }}
          />
        )}
      </main>
    </div>
  )
}
