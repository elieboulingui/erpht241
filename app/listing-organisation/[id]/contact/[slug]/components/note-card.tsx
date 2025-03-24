"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArchiveRestore, Bell, Image, MoreVertical, Pin, Users, Palette } from "lucide-react"
import { IconButton } from "./icon-button"
import { NoteEditorModal } from "./NoteEditorModal"
import { SimpleMenu } from "./SimpleMenu"
import { CollaboratorsModal } from "./collaborators-modal"
import { ColorPickerMenu } from "./ColorPickerMenu"
import { DeleteNote } from "../actions/deleteNote"
import { DeleteNoteDialog } from "./DeleteNoteDialog"
import { AlerteNote } from "./AlerteNote"
import { MoreOptionsMenu } from "./MoreOptionsMenu"

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
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false)
  const moreOptionsBtnRef = useRef<HTMLButtonElement>(null)
  const [moreOptionsBtnPosition, setMoreOptionsBtnPosition] = useState({
    top: 0,
    left: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Position du bouton de rappel pour positionner le menu
  const [reminderBtnPosition, setReminderBtnPosition] = useState({
    top: 0,
    left: 0,
  })
  const reminderBtnRef = useRef<HTMLButtonElement>(null)

  // Position du bouton de couleur pour positionner le menu
  const [colorBtnPosition, setColorBtnPosition] = useState({ top: 0, left: 0 })
  const colorBtnRef = useRef<HTMLButtonElement>(null)

  const handleCardClick = () => {
    if (!showReminderMenu && !activeMenu && !showCollaboratorsModal && !showColorMenu && !showMoreOptionsMenu) {
      setIsModalOpen(true)
    }
  }

  const handleSaveNote = (updatedNote: Note) => {
    onUpdateNote(note.id, updatedNote)
  }

  // Fonction pour ouvrir un menu spécifique
  const openMenu = (menuName: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    // Toggle the menu - close if it's already open with the same name
    setActiveMenu((current) => (current === menuName ? null : menuName))
  }

  // Fonction pour fermer tous les menus
  const closeMenu = () => {
    setActiveMenu(null)
  }

  // Fonction pour gérer l'archivage
  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateNote(note.id, { archived: true })
    onRefreshNotes()
  }

  // Fonction pour gérer les rappels
  const handleReminderSelect = (time: string) => {
    console.log(`Rappel défini pour: ${time}`)
    setShowReminderMenu(false)
    // Ici vous pourriez mettre à jour la note avec les informations de rappel
  }

  // Mettre à jour la position du menu quand on clique sur le bouton
  const handleReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (reminderBtnRef.current) {
      const rect = reminderBtnRef.current.getBoundingClientRect()
      setReminderBtnPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    // Toggle the menu state - close if already open
    setShowReminderMenu((prev) => !prev)
  }

  // Fonction pour gérer les collaborateurs
  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCollaboratorsModal(true)
  }

  // Mettre à jour la position du menu quand on clique sur le bouton
  const handleColorClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (colorBtnRef.current) {
      const rect = colorBtnRef.current.getBoundingClientRect()
      setColorBtnPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150, // Centrer approximativement
      })
    }

    // Toggle the menu state - close if already open
    setShowColorMenu((prev) => !prev)
  }

  // Fonction pour gérer la sélection de couleur
  const handleColorSelect = (color: string) => {
    onUpdateNote(note.id, { color })
  }

  // Fonction pour gérer le clic sur le bouton "Plus d'options"
  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (moreOptionsBtnRef.current) {
      const rect = moreOptionsBtnRef.current.getBoundingClientRect()
      setMoreOptionsBtnPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150, // Ajuster pour centrer le menu
      })
    }

    // Toggle the menu state - close if already open
    setShowMoreOptionsMenu((prev) => !prev)
  }

  // Fonction pour gérer la suppression
  const handleDeleteConfirm = async () => {
    try {
      // Appeler l'action serveur pour marquer la note comme archivée
      await DeleteNote(note.id)

      // Fermer la boîte de dialogue
      setShowDeleteDialog(false)

      // Rafraîchir la liste des notes
      onRefreshNotes()
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error)
      // Vous pourriez ajouter une notification d'erreur ici
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

          {(isHovered || showReminderMenu || showColorMenu || showMoreOptionsMenu || activeMenu) && (
            <div
              className="absolute bottom-0 left-0 w-full flex items-center justify-between gap-2 p-2 group-hover:opacity-100 opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()} // Arrêter la propagation au niveau du conteneur
            >
              <IconButton ref={reminderBtnRef} icon={Bell} name="Rappel" onClick={handleReminderClick} />
              <IconButton icon={Users} name="Collaborateurs" onClick={handleCollaboratorsClick} />
              <IconButton ref={colorBtnRef} icon={Palette} name="Modifier la couleur" onClick={handleColorClick} />
              <IconButton icon={Image} name="Ajouter une image" onClick={openMenu("image")} />
              <IconButton icon={ArchiveRestore} name="Archiver" onClick={handleArchive} />
              <IconButton
                ref={moreOptionsBtnRef}
                icon={MoreVertical}
                name="Plus d'options"
                onClick={handleMoreOptionsClick}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu de rappel */}
      {showReminderMenu && (
        <AlerteNote
          position={reminderBtnPosition}
          onSelectReminder={handleReminderSelect}
          onClose={() => setShowReminderMenu(false)}
        />
      )}

      {/* Menu de couleurs */}
      {showColorMenu && (
        <ColorPickerMenu
          position={colorBtnPosition}
          onSelectColor={handleColorSelect}
          onClose={() => setShowColorMenu(false)}
          currentColor={note.color}
        />
      )}

      {/* Modal de collaborateurs */}
      <CollaboratorsModal
        isOpen={showCollaboratorsModal}
        onClose={() => setShowCollaboratorsModal(false)}
        noteId={note.id}
      />

      {/* Modal d'ajout d'image */}
      <SimpleMenu title="Ajouter une image" isOpen={activeMenu === "image"} onClose={closeMenu}>
        <div>Ajouter une image à venir</div>
      </SimpleMenu>

      {/* Menu de plus d'options */}
      {showMoreOptionsMenu && (
        <MoreOptionsMenu
          position={moreOptionsBtnPosition}
          onClose={() => setShowMoreOptionsMenu(false)}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />
      )}

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

