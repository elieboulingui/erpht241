"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArchiveRestore, Bell, Clock, Image, MapPin, MoreVertical, Pin, Users, Palette } from "lucide-react"
import { IconButton } from "./icon-button"
import { NoteEditorModal } from "./NoteEditorModal"
import { SimpleMenu } from "./SimpleMenu"
import { CollaboratorsModal } from "./collaborators-modal"
import { ColorPickerMenu } from "./ColorPickerMenu"

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
  // Ajouter ces états et références en haut du composant NoteCard, avec les autres états
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false)
  const moreOptionsBtnRef = useRef<HTMLButtonElement>(null)
  const moreOptionsMenuRef = useRef<HTMLDivElement>(null)
  const [moreOptionsBtnPosition, setMoreOptionsBtnPosition] = useState({
    top: 0,
    left: 0,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const reminderMenuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu de rappel si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if clicking outside, not just moving the mouse
      if (
        reminderMenuRef.current &&
        !reminderMenuRef.current.contains(event.target as Node) &&
        event.type === "mousedown"
      ) {
        setShowReminderMenu(false)
      }
    }

    if (showReminderMenu) {
      // Only listen for mousedown, not mousemove
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showReminderMenu])

  // Ajouter cet effet pour gérer les clics en dehors du menu d'options
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if clicking outside, not just moving the mouse
      if (
        moreOptionsMenuRef.current &&
        !moreOptionsMenuRef.current.contains(event.target as Node) &&
        event.type === "mousedown"
      ) {
        setShowMoreOptionsMenu(false)
      }
    }

    if (showMoreOptionsMenu) {
      // Only listen for mousedown, not mousemove
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMoreOptionsMenu])

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
    setActiveMenu(menuName)
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

  // Position du bouton de rappel pour positionner le menu
  const [reminderBtnPosition, setReminderBtnPosition] = useState({
    top: 0,
    left: 0,
  })
  const reminderBtnRef = useRef<HTMLButtonElement>(null)

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

    setShowReminderMenu(true)
  }

  // Fonction pour gérer les collaborateurs
  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCollaboratorsModal(true)
  }

  // Position du bouton de couleur pour positionner le menu
  const [colorBtnPosition, setColorBtnPosition] = useState({ top: 0, left: 0 })
  const colorBtnRef = useRef<HTMLButtonElement>(null)

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

    setShowColorMenu(true)
  }

  // Fonction pour gérer la sélection de couleur
  const handleColorSelect = (color: string) => {
    onUpdateNote(note.id, { color })
  }

  // Ajouter cette fonction pour gérer le clic sur le bouton "Plus d'options"
  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (moreOptionsBtnRef.current) {
      const rect = moreOptionsBtnRef.current.getBoundingClientRect()
      setMoreOptionsBtnPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150, // Ajuster pour centrer le menu
      })
    }

    setShowMoreOptionsMenu(true)
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
              className="absolute bottom-0 left-0 w-full flex items-center justify-between gap-2 p-2  group-hover:opacity-100 opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()} // Arrêter la propagation au niveau du conteneur
            >
              <IconButton ref={reminderBtnRef} icon={Bell} name="Rappel" onClick={handleReminderClick} />
              <IconButton icon={Users} name="Collaborateurs" onClick={handleCollaboratorsClick} />
              <IconButton ref={colorBtnRef} icon={Palette} name="Modifier la couleur" onClick={handleColorClick} />
              <IconButton icon={Image} name="Ajouter une image" onClick={openMenu("image")} />
              <IconButton icon={ArchiveRestore} name="Archiver" onClick={handleArchive} />
              {/* Remplacer l'IconButton pour "Plus d'options" dans la barre d'outils */}
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
        <div
          ref={reminderMenuRef}
          className="fixed z-50 bg-white border rounded-md shadow-md w-64"
          style={{
            top: `${reminderBtnPosition.top}px`,
            left: `${reminderBtnPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          // Add this to prevent the menu from closing when the mouse moves within it
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            <div className="px-3 pb-2">
              <p className="text-sm font-medium">Me le rappeler plus tard</p>
              <p className="text-xs text-muted-foreground">Enregistré dans les rappels Google</p>
            </div>

            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => handleReminderSelect("today")}
              >
                <span>Plus tard dans la journée</span>
                <span className="text-muted-foreground">20:00</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => handleReminderSelect("tomorrow")}
              >
                <span>Demain</span>
                <span className="text-muted-foreground">08:00</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => handleReminderSelect("next-week")}
              >
                <span>Semaine prochaine</span>
                <span className="text-muted-foreground">lun., 08:00</span>
              </Button>
            </div>

            <hr className="my-1" />

            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-9 px-3 gap-2 rounded-none"
              onClick={() => handleReminderSelect("custom-time")}
            >
              <Clock className="h-4 w-4" />
              <span>Sélectionner la date et l'heure</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-9 px-3 gap-2 rounded-none"
              onClick={() => handleReminderSelect("custom-location")}
            >
              <MapPin className="h-4 w-4" />
              <span>Sélectionner le lieu</span>
            </Button>
          </div>
        </div>
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
        <div
          ref={moreOptionsMenuRef}
          className="fixed z-50 bg-white border rounded-md shadow-md w-64"
          style={{
            top: `${moreOptionsBtnPosition.top}px`,
            left: `${moreOptionsBtnPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          // Add this to prevent the menu from closing when the mouse moves within it
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="py-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Supprimer la note")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Supprimer la note</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Ajouter un libellé")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Ajouter un libellé</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Ajouter un dessin")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Ajouter un dessin</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Effectuer une copie")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Effectuer une copie</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Afficher les cases à cocher")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Afficher les cases à cocher</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Copier dans Google Docs")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Copier dans Google Docs</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal h-9 px-3 rounded-none"
                onClick={() => {
                  console.log("Historique des versions")
                  setShowMoreOptionsMenu(false)
                }}
              >
                <span>Historique des versions</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <NoteEditorModal
        note={note}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        onRefreshNotes={onRefreshNotes}
      />
    </>
  )
}

