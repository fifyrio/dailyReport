"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { NoteForm } from "@/components/note-form"
import { NoteDetail } from "@/components/note-detail"
import { GrowthInsights } from "@/components/growth-insights"
import { Header } from "@/components/header"
import { Feather } from "lucide-react"
import type { Note } from "@/lib/types"
import { getNotes, addNote, updateNote, deleteNote } from "@/lib/storage"

type ViewType = "dashboard" | "growth"

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

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
    setSelectedNote(newNote)
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

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    setSelectedNote(null)
    setIsFormOpen(false)
    setEditingNote(null)
  }

  const handleViewGrowthInsights = () => {
    setCurrentView("growth")
    setSelectedNote(null)
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
      <Header
        onNewNote={() => {
          setEditingNote(null)
          setIsFormOpen(true)
          setCurrentView("dashboard")
        }}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <main className="container mx-auto px-4 md:px-6 py-8">
        {currentView === "growth" ? (
          <GrowthInsights
            notes={notes}
            onBack={() => setCurrentView("dashboard")}
          />
        ) : isFormOpen ? (
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
            allNotes={notes}
            onBack={() => setSelectedNote(null)}
            onEdit={() => handleEditNote(selectedNote)}
            onDelete={() => handleDeleteNote(selectedNote.id)}
            onViewGrowthInsights={handleViewGrowthInsights}
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
