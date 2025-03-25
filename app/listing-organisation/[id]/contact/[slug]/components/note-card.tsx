"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArchiveRestore, Bell, Trash, Pin, Users, Palette } from "lucide-react"
import { IconButton } from "./icon-button"
import { NoteEditorModal } from "./NoteEditorModal"
import { CollaboratorsModal } from "./collaborators-modal"
import { ColorPickerMenu } from "./ColorPickerMenu"
import { DeleteNote } from "../actions/deleteNote"
import { DeleteNoteDialog } from "./DeleteNoteDialog"
import { AlerteNote } from "./AlerteNote"

export interface Note {
  id: string
  title: string
  content?: string
  isPinned: boolean
  lastModified: Date
  color?: string
  archived?: boolean
}

interface NoteCardProps {
  note: Note
  isHovered: boolean
  onHover: (id: string | null) => void
  onTogglePin: (id: string) => void
  onUpdateNote: (id: string, updatedNote: Partial<Note>) => void
  onRefreshNotes: () => void
}

export function NoteCard({ note, isHovered, onHover, onTogglePin, onUpdateNote, onRefreshNotes }: NoteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Position du bouton de rappel
  const [reminderBtnPosition, setReminderBtnPosition] = useState({
    top: 0,
    left: 0
  })
  const reminderBtnRef = useRef<HTMLButtonElement>(null)

  // Position du bouton de couleur
  const [colorBtnPosition, setColorBtnPosition] = useState({ top: 0, left: 0 })
  const colorBtnRef = useRef<HTMLButtonElement>(null)

  const handleCardClick = () => {
    if (!showReminderMenu && !showCollaboratorsModal && !showColorMenu) {
      setIsModalOpen(true)
    }
  }

  const handleSaveNote = (updatedNote: Note) => {
    onUpdateNote(note.id, updatedNote)
  }

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateNote(note.id, { archived: true })
    onRefreshNotes()
  }

  const handleReminderSelect = (time: string) => {
    console.log(`Rappel défini pour: ${time}`)
    setShowReminderMenu(false)
  }

  const handleReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (reminderBtnRef.current) {
      const rect = reminderBtnRef.current.getBoundingClientRect()
      setReminderBtnPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    setShowReminderMenu((prev) => !prev)
  }

  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCollaboratorsModal(true)
  }

  const handleColorClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (colorBtnRef.current) {
      const rect = colorBtnRef.current.getBoundingClientRect()
      setColorBtnPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150,
      })
    }

    setShowColorMenu((prev) => !prev)
  }

  const handleColorSelect = (color: string) => {
    onUpdateNote(note.id, { color })
  }

  const handleDeleteConfirm = async () => {
    try {
      await DeleteNote(note.id)
      setShowDeleteDialog(false)
      onRefreshNotes()
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error)
    }
  }

  return (
    <>
      <Card
        className={cn(
          "relative transition-shadow hover:shadow-md cursor-pointer group h-36",
          note.color ? note.color : "bg-white",
        )}
        onMouseEnter={() => onHover(note.id)}
        onMouseLeave={() => onHover(null)}
        onClick={handleCardClick}
      >
        <CardContent className="py-4 px-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <span className="font-medium">{note.title}</span>
              {isHovered && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTogglePin(note.id)
                  }}
                  type="button"
                >
                  <Pin className="h-4 w-4" fill={note.isPinned ? "black" : "none"} />
                </Button>
              )}
            </div>
            {note.content && <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>}
          </div>

          {(isHovered || showReminderMenu || showColorMenu) && (
            <div
              className="absolute bottom-0 left-0 w-full flex items-center justify-between gap-2 p-2 group-hover:opacity-100 opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton ref={reminderBtnRef} icon={Bell} name="Rappel" onClick={handleReminderClick} />
              <IconButton icon={Users} name="Collaborateurs" onClick={handleCollaboratorsClick} />
              <IconButton ref={colorBtnRef} icon={Palette} name="Modifier la couleur" onClick={handleColorClick} />
              {/* <IconButton icon={ArchiveRestore} name="Archiver" onClick={handleArchive} /> */}
              <IconButton 
                icon={Trash} 
                name="Supprimer" 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      {showReminderMenu && (
        <AlerteNote
          position={reminderBtnPosition}
          onSelectReminder={handleReminderSelect}
          onClose={() => setShowReminderMenu(false)}
        />
      )}

      {showColorMenu && (
        <ColorPickerMenu
          position={colorBtnPosition}
          onSelectColor={handleColorSelect}
          onClose={() => setShowColorMenu(false)}
          currentColor={note.color}
        />
      )}

      <CollaboratorsModal
        isOpen={showCollaboratorsModal}
        onClose={() => setShowCollaboratorsModal(false)}
        noteId={note.id}
      />

      <NoteEditorModal
        note={note}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        onRefreshNotes={onRefreshNotes}
      />

      <DeleteNoteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}