"use client"

import type React from "react"
import { useState } from "react"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { X, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { KanbanCard } from "./kanban-card"
import { updateStep } from "../action/updateStep"
import { updateStepName } from "../action/udpateStep"

const listColors = {
  green: "#2e7d32",
  yellow: "#f9a825",
  orange: "#8B4513",
  red: "#c62828",
  purple: "#6a1b9a",
  blue: "#1565c0",
  teal: "#00695c",
  lime: "#827717",
  pink: "#ad1457",
  gray: "#546e7a",
} as const

const getProgressColor = (ratio: number) => {
  if (ratio < 0.3) return "#c62828"
  if (ratio < 0.6) return "#fbc02d"
  if (ratio < 0.9) return "#f9a825"
  return "#2e7d32"
}

type CardType = {
  id: string
  title: string
  description?: string
  amount?: number
  deadline?: string
  merchantId?: string | null
  contactId?: string | null
  tags?: string[]
}

type ListType = {
  id: string
  label: string
  title: string
  color?: string
  cards: CardType[]
  archived?: boolean
}

interface KanbanListProps {
  list: ListType
  index: number
  searchQuery: string
  onCardClick: (listId: string, cardId: string) => void
  onDeleteCard: (cardId: string) => void
  onAddCard: () => void
  addingCard: boolean
  newCardTitle: string
  setNewCardTitle: (title: string) => void
  handleAddCard: (listId: string) => Promise<void>
  setAddingCard: (listId: string | null) => void
  setListToDelete: (listId: string | null) => void
  stagesCache: React.MutableRefObject<Map<string, any>>
  getOrganisationId: () => string | null
}

export function KanbanList({
  list,
  index,
  searchQuery,
  onCardClick,
  onDeleteCard,
  onAddCard,
  addingCard,
  newCardTitle,
  setNewCardTitle,
  handleAddCard,
  setAddingCard,
  setListToDelete,
  stagesCache,
  getOrganisationId,
}: KanbanListProps) {
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListTitle, setEditingListTitle] = useState("")

  const calculateProgress = () => {
    const cardCount = list.cards.length
    const totalAmount = list.cards.reduce((sum, card) => sum + (card.amount || 0), 0)

    const maxCards = 10
    const maxAmount = 100000

    const cardRatio = Math.min(cardCount / maxCards, 1)
    const amountRatio = Math.min(totalAmount / maxAmount, 1)

    const combinedRatio = (cardRatio * 0.5) + (amountRatio * 0.5)

    return {
      cardCount,
      totalAmount,
      ratio: combinedRatio,
      color: getProgressColor(combinedRatio),
    }
  }

  const progress = calculateProgress()

  const getListStyle = (color?: string) => {
    if (!color) return { backgroundColor: "#f8f9fa" }
    return { backgroundColor: listColors[color as keyof typeof listColors] || "#f8f9fa" }
  }

  const handleColorChange = async (listId: string, colorKey: keyof typeof listColors | null = null) => {
    try {
      const organisationId = getOrganisationId()
      if (!organisationId) throw new Error("ID de l'organisation non trouvé")

      await updateStep(listId, list.label, colorKey, organisationId)

      const cachedData = stagesCache.current.get(organisationId)
      if (cachedData) {
        const updatedCache = cachedData.map((stage: any) =>
          stage.id === listId ? { ...stage, color: colorKey || null } : stage
        )
        stagesCache.current.set(organisationId, updatedCache)
      }
    } catch (e) {
      console.error("Échec de la mise à jour de la couleur de la liste", e)
    }
  }

  const handleListTitleUpdate = async (newTitle: string) => {
    if (newTitle.trim()) {
      try {
        await updateStepName(list.id, newTitle)
        const organisationId = getOrganisationId()
        if (organisationId) {
          const cachedData = stagesCache.current.get(organisationId)
          if (cachedData) {
            const updatedCache = cachedData.map((stage: any) =>
              stage.id === list.id ? { ...stage, label: newTitle } : stage
            )
            stagesCache.current.set(organisationId, updatedCache)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du titre:", error)
      }
    }
    setEditingListId(null)
  }

  const filteredCards = list.cards.filter((card) => {
    const query = searchQuery.toLowerCase()
    return (
      card.title.toLowerCase().includes(query) ||
      (card.description?.toLowerCase().includes(query) ?? false)
    )
  })

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`w-72 flex-shrink-0 rounded-lg overflow-hidden border-black/15 border ${snapshot.isDragging ? "dragging-list" : ""}`}
          style={{
            ...getListStyle(list.color),
            ...provided.draggableProps.style,
            height: "fit-content",
            minHeight: "100px",
          }}
        >
          <div {...provided.dragHandleProps} className="flex flex-col px-3 py-2.5 text-black">
            <div className="flex items-center justify-between w-full">
              {editingListId === list.id ? (
                <Input
                  value={editingListTitle}
                  onChange={(e) => setEditingListTitle(e.target.value)}
                  onBlur={() => handleListTitleUpdate(editingListTitle)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleListTitleUpdate(editingListTitle)
                    else if (e.key === "Escape") setEditingListId(null)
                  }}
                  autoFocus
                  className="h-6 bg-gray-800 w-60 text-sm font-medium text-white"
                />
              ) : (
                <h2
                  className="text-sm font-medium cursor-pointer"
                  onClick={() => {
                    setEditingListId(list.id)
                    setEditingListTitle(list.title)
                  }}
                >
                  {list.title}
                </h2>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-black/70 hover:text-black">
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 bg-gray-800 text-white border-gray-700 p-0 rounded-md">
                  <div className="flex items-center justify-between p-3 border-b border-gray-700">
                    <span className="text-sm font-medium">Actions de la liste</span>
                  </div>

                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm" onClick={onAddCard}>
                      Ajouter une carte
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                      Copier la liste
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                      Déplacer la liste
                    </button>

                    <div className="mt-2 border-t border-gray-700 pt-2">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="list-color" className="border-none">
                          <AccordionTrigger className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                            Changer la couleur de la liste
                          </AccordionTrigger>
                          <AccordionContent className="px-3 py-2">
                            <div className="grid grid-cols-5 gap-1">
                              {Object.keys(listColors).map((colorKey) => {
                                const key = colorKey as keyof typeof listColors
                                return (
                                  <div
                                    key={key}
                                    className="h-6 w-6 rounded-sm cursor-pointer"
                                    style={{ backgroundColor: listColors[key] }}
                                    onClick={() => handleColorChange(list.id, key)}
                                  />
                                )
                              })}
                            </div>
                            <button className="flex items-center px-10 mt-5 text-sm text-gray-300" onClick={() => handleColorChange(list.id, null)}>
                              <X size={14} className="mr-2" /> Supprimer la couleur
                            </button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div className="mt-2 border-t border-gray-700 pt-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm" onClick={() => setListToDelete(list.id)}>
                        Archiver cette liste
                      </button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Barre de progression */}
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{progress.cardCount} carte{progress.cardCount > 1 ? "s" : ""}</span>
                <span>Total: {progress.totalAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress.ratio * 100}%`,
                    backgroundColor: progress.color,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <Droppable droppableId={list.id} type="card">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 p-2" style={{ minHeight: "50px" }}>
                {filteredCards.map((card, index) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    index={index}
                    onClick={() => onCardClick(list.id, card.id)}
                    onDelete={() => onDeleteCard(card.id)}
                  />
                ))}
                {provided.placeholder}

                {addingCard ? (
                  <div className="rounded-md bg-[#f1f2f4] p-2">
                    <Textarea
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Entrez un titre pour cette carte..."
                      className="mb-2 resize-none bg-white text-black"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleAddCard(list.id)} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
                        Ajouter une carte
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setAddingCard(null)
                        setNewCardTitle("")
                      }}>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={onAddCard}
                    className="flex items-center gap-2 rounded-md p-2 text-black hover:bg-black/10"
                  >
                    <Plus size={16} />
                    <span>Ajouter une carte</span>
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
