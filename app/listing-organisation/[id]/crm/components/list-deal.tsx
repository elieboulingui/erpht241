"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FaRegTrashAlt } from "react-icons/fa"
import { X, Plus, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { addStep } from "../action/createcolum"
import { updateStep } from "../action/updateStep"
import { deleteDealStage } from "../action/deleteDealStage"
import { deleteDeal } from "../action/deletedeals"
import { createDeal } from "../action/createDeal"
import { CardDetail } from "./card-detail"
import Chargement from "@/components/Chargement"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { updateDealdrage } from "../action/updateDealdrage"
import { updateStepName } from "../action/udpateStep"
import type { Deal, DealStag, Merchant, Contact, AddStepResponse } from "./types"
import { reorderSteps } from "../action/updateSte"

interface ListDealProps {
  merchants?: Merchant[]
  contacts?: Contact[]
  deals?: Deal[]
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

export function ListDeal({ merchants, contacts, deals }: ListDealProps) {
  const [lists, setLists] = useState<ListType[]>([])
  const [newListTitle, setNewListTitle] = useState("")
  const [addingList, setAddingList] = useState(false)
  const [addingCard, setAddingCard] = useState<string | null>(null)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [selectedCard, setSelectedCard] = useState<{ listId: string; cardId: string } | null>(null)
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListTitle, setEditingListTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    merchant: [] as string[],
    contact: [] as string[],
    tag: [] as string[],
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const stagesCache = useRef<Map<string, DealStag[]>>(new Map())

  const handleFilterChange = (filterType: string, value: string | string[] | null) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value ? (Array.isArray(value) ? value : [value]) : [],
    }))
  }

  const filterCards = (cards: CardType[]) => {
    return cards.filter((card) => {
      if (filters.merchant.length > 0 && (!card.merchantId || !filters.merchant.includes(card.merchantId))) {
        return false
      }
      if (filters.contact.length > 0 && (!card.contactId || !filters.contact.includes(card.contactId))) {
        return false
      }
      if (filters.tag.length > 0 && (!card.tags || !filters.tag.some((tag) => card.tags?.includes(tag)))) {
        return false
      }
      return true
    })
  }

  const hasFilteredCards = (list: ListType) => {
    return filterCards(list.cards).length > 0
  }

  const allListsEmpty = lists.every((list) => !hasFilteredCards(list))

  const getOrganisationId = useCallback(() => {
    const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/)
    return match ? match[1] : null
  }, [])

  const formatStagesData = (data: DealStag[]) => {
    return data.map((stage) => ({
      id: stage.id,
      label: stage.label,
      title: stage.label,
      color: stage.color || undefined,
      cards: stage.opportunities.map(
        (opp: {
          id: any
          label: any
          description: any
          amount: any
          deadline: any
          merchantId: any
          contactId: any
          tags: any
        }) => ({
          id: opp.id,
          title: opp.label,
          description: opp.description,
          amount: opp.amount,
          deadline: opp.deadline,
          merchantId: opp.merchantId,
          contactId: opp.contactId,
          tags: opp.tags || [],
        }),
      ),
    }))
  }

  const fetchStages = useCallback(async (organisationId: string) => {
    try {
      setLoading(true)

      // Check if we have cached data
      if (stagesCache.current.has(organisationId)) {
        const cachedData = stagesCache.current.get(organisationId)
        if (cachedData) {
          const formattedLists = formatStagesData(cachedData)
          setLists(formattedLists)
          setLoading(false)
          return
        }
      }

      const res = await fetch(`/api/deal-stages?organisationId=${organisationId}`)

      if (!res.ok) {
        const responseBody = await res.json()
        throw new Error(`Échec de la récupération des étapes de deal: ${JSON.stringify(responseBody)}`)
      }

      const data: DealStag[] = await res.json()

      // Cache the data
      stagesCache.current.set(organisationId, data)

      const formattedLists = formatStagesData(data)
      setLists(formattedLists)
      setError(null)
    } catch (e) {
      console.error("Erreur lors de la récupération des étapes de deal", e)
      setError(e instanceof Error ? e.message : "Échec de la récupération des données")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const organisationId = getOrganisationId()
    if (!organisationId) {
      setError("ID de l'organisation non trouvé dans l'URL")
      setLoading(false)
      return
    }

    fetchStages(organisationId)
  }, [fetchStages, getOrganisationId])

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result

    // Si pas de destination ou même position, ne rien faire
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return
    }

    const previousLists = [...lists]
    setIsUpdating(true)

    try {
      // Optimistic UI update
      setLists((prev) => {
        const newLists = [...prev]

        if (type === "card") {
          const srcList = newLists.find((l) => l.id === source.droppableId)
          const destList = newLists.find((l) => l.id === destination.droppableId)

          if (!srcList || !destList) {
            console.error("Liste source ou destination introuvable")
            return prev
          }

          const [movedCard] = srcList.cards.splice(source.index, 1)
          if (!movedCard) {
            console.error("Carte à déplacer introuvable")
            return prev
          }

          destList.cards.splice(destination.index, 0, movedCard)
        } else if (type === "list") {
          const [movedList] = newLists.splice(source.index, 1)
          newLists.splice(destination.index, 0, movedList)
        }

        return newLists
      })

      // Actual API call
      if (type === "card") {
        await updateDealdrage({
          id: draggableId,
          stepId: destination.droppableId,
        })

        // Update cache
        const organisationId = getOrganisationId()
        if (organisationId) {
          const cachedData = stagesCache.current.get(organisationId)
          if (cachedData) {
            const updatedCache = [...cachedData]
            const srcStageIndex = updatedCache.findIndex((s) => s.id === source.droppableId)
            const destStageIndex = updatedCache.findIndex((s) => s.id === destination.droppableId)

            if (srcStageIndex !== -1 && destStageIndex !== -1) {
              const [movedOpp] = updatedCache[srcStageIndex].opportunities.splice(source.index, 1)
              updatedCache[destStageIndex].opportunities.splice(destination.index, 0, movedOpp)
              stagesCache.current.set(organisationId, updatedCache)
            }
          }
        }

        toast.success("Carte déplacée avec succès")
      } else if (type === "list") {
        const organisationId = getOrganisationId()
        if (!organisationId) {
          throw new Error("ID d'organisation non trouvé")
        }

        await reorderSteps({
          organisationId,
          from: source.index + 1, // +1 car les étapes commencent à 1 dans la base
          to: destination.index + 1,
        })

        // Update cache
        if (organisationId) {
          const cachedData = stagesCache.current.get(organisationId)
          if (cachedData) {
            const updatedCache = [...cachedData]
            const [movedStage] = updatedCache.splice(source.index, 1)
            updatedCache.splice(destination.index, 0, movedStage)
            stagesCache.current.set(organisationId, updatedCache)
          }
        }

        toast.success("Liste déplacée avec succès")
      }
    } catch (error) {
      console.error("Erreur lors du déplacement:", error)
      setLists(previousLists)
      toast.error("Erreur lors du déplacement. Les changements ont été annulés.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddList = async () => {
    const organisationId = getOrganisationId()
    if (!organisationId) {
      setError("ID de l'organisation non trouvé")
      return
    }

    if (newListTitle.trim()) {
      try {
        // Optimistic UI update - ajoute toujours à la fin
        const tempId = `temp-${Date.now()}`

        // Notification de l'action en cours
        toast.loading("Ajout de la liste en cours...")

        // Ajout à la fin des listes existantes
        setLists((prev) => [
          ...prev,
          {
            id: tempId,
            label: newListTitle,
            title: newListTitle,
            cards: [],
          },
        ])

        setNewListTitle("")
        setAddingList(false)

        // Actual API call
        const result = (await addStep(newListTitle, organisationId, null)) as AddStepResponse

        if (result.success) {
          // Update with real ID but preserve position at the end
          const newId = result.newStep?.id || result.id || tempId
          setLists((prev) => prev.map((list) => (list.id === tempId ? { ...list, id: newId } : list)))

          // Update cache while preserving order at the end
          const cachedData = stagesCache.current.get(organisationId)
          if (cachedData) {
            const updatedCache = [
              ...cachedData,
              {
                id: newId,
                label: newListTitle,
                color: null,
                opportunities: [],
              },
            ]
            stagesCache.current.set(organisationId, updatedCache)
          }

          // Notification de succès
          toast.success("Liste ajoutée avec succès")
        } else {
          // Revert on error
          setLists((prev) => prev.filter((list) => list.id !== tempId))
          setError(result.error || "Échec de l'ajout de la liste")
          toast.error("Échec de l'ajout de la liste")
        }
      } catch (e) {
        setError("Une erreur est survenue lors de l'ajout de la liste")
        toast.error("Une erreur est survenue lors de l'ajout de la liste")
      }
    }
  }

  const handleAddCard = async (listId: string) => {
    if (newCardTitle.trim()) {
      try {
        // Optimistic UI update
        const tempId = `temp-card-${Date.now()}`
        setLists((prev) =>
          prev.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  cards: [
                    ...list.cards,
                    {
                      id: tempId,
                      title: newCardTitle,
                      description: "",
                      amount: 0,
                      tags: [],
                    },
                  ],
                }
              : list,
          ),
        )

        setNewCardTitle("")
        setAddingCard(null)

        // Actual API call
        const result = await createDeal({
          label: newCardTitle,
          description: "",
          amount: 0,
          merchantId: undefined,
          contactId: undefined,
          tags: [],
          tagColors: [],
          stepId: listId,
        })

        if (result.success) {
          // Update with real ID
          setLists((prev) =>
            prev.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === tempId ? { ...card, id: result.deal?.id || card.id } : card,
                    ),
                  }
                : list,
            ),
          )

          // Update cache
          const organisationId = getOrganisationId()
          if (organisationId) {
            const cachedData = stagesCache.current.get(organisationId)
            if (cachedData) {
              const updatedCache = [...cachedData]
              const stageIndex = updatedCache.findIndex((s) => s.id === listId)

              if (stageIndex !== -1) {
                updatedCache[stageIndex].opportunities.push({
                  id: result.deal?.id || tempId,
                  label: newCardTitle,
                  description: "",
                  amount: 0,
                  tags: [],
                  tagColors: [],
                })
                stagesCache.current.set(organisationId, updatedCache)
              }
            }
          }
        } else {
          // Revert on error
          setLists((prev) =>
            prev.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.filter((card) => card.id !== tempId),
                  }
                : list,
            ),
          )
          setError(result.error || "Échec de l'ajout de la carte")
          toast.error("Échec de l'ajout de la carte")
        }
      } catch (e) {
        setError("Une erreur est survenue lors de l'ajout de la carte")
        toast.error("Une erreur est survenue lors de l'ajout de la carte")
      }
    }
  }

  const handleCardClick = (listId: string, cardId: string) => {
    setSelectedCard({ listId, cardId })
  }

  const getCardDetails = () => {
    if (!selectedCard) return null
    const list = lists.find((l) => l.id === selectedCard.listId)
    if (!list) return null
    const card = list.cards.find((c) => c.id === selectedCard.cardId)
    if (!card) return null
    return { list, card }
  }

  const handleColorChange = async (
    listId: string,
    colorKey: keyof typeof listColors | null = null,
    list: { label: string },
  ) => {
    try {
      // Optimistic UI update
      setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, color: colorKey || undefined } : l)))

      // Actual API call
      const organisationId = getOrganisationId()
      if (!organisationId) {
        setError("ID de l'organisation non trouvé")
        return
      }

      await updateStep(listId, list.label, colorKey, organisationId)

      // Update cache
      const cachedData = stagesCache.current.get(organisationId)
      if (cachedData) {
        const updatedCache = cachedData.map((stage) =>
          stage.id === listId ? { ...stage, color: colorKey || null } : stage,
        )
        stagesCache.current.set(organisationId, updatedCache)
      }
    } catch (e) {
      setError("Échec de la mise à jour de la couleur de la liste")
      toast.error("Échec de la mise à jour de la couleur de la liste")
    }
  }

  const archiveList = async (listId: string) => {
    const currentLists = [...lists]
    const listToRemove = lists.find((list) => list.id === listId)

    if (!listToRemove) {
      toast.error("Liste introuvable")
      return
    }

    try {
      // Optimistic UI update
      setLists((prev) => prev.filter((list) => list.id !== listId))

      // Notification de l'action en cours
      toast.loading("Suppression de la liste en cours...")

      // Actual API call
      await deleteDealStage(listId)

      // Update cache
      const organisationId = getOrganisationId()
      if (organisationId) {
        const cachedData = stagesCache.current.get(organisationId)
        if (cachedData) {
          const updatedCache = cachedData.filter((stage) => stage.id !== listId)
          stagesCache.current.set(organisationId, updatedCache)
        }
      }

      // Notification de succès
      toast.success("Liste supprimée avec succès")
    } catch (error) {
      console.error("Échec de la suppression de la liste:", error)
      setLists(currentLists)
      toast.error("Échec de la suppression de la liste")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const listContainingCard = lists.find((list) => list.cards.some((card) => card.id === id))

      if (!listContainingCard) {
        toast.error("Carte introuvable")
        return
      }

      // Optimistic UI update
      setLists((prev) =>
        prev.map((list) =>
          list.id === listContainingCard.id ? { ...list, cards: list.cards.filter((card) => card.id !== id) } : list,
        ),
      )

      // Actual API call
      const result = await deleteDeal(id)

      if (result.success) {
        toast.success("Élément supprimé avec succès")

        // Update cache
        const organisationId = getOrganisationId()
        if (organisationId) {
          const cachedData = stagesCache.current.get(organisationId)
          if (cachedData) {
            const updatedCache = cachedData.map((stage) =>
              stage.id === listContainingCard.id
                ? { ...stage, opportunities: stage.opportunities.filter((opp: any) => opp.id !== id) }
                : stage,
            )
            stagesCache.current.set(organisationId, updatedCache)
          }
        }
      } else {
        toast.error("Erreur lors de la suppression")
        const organisationId = getOrganisationId()
        if (organisationId) {
          fetchStages(organisationId)
        }
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue")
      console.error("Erreur lors de la suppression:", error)
      const organisationId = getOrganisationId()
      if (organisationId) {
        fetchStages(organisationId)
      }
    }
  }

  const handleCardSave = (updatedCardData: any) => {
    if (!selectedCard) return

    setLists((prev) =>
      prev.map((list) =>
        list.id === selectedCard.listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === selectedCard.cardId
                  ? {
                      ...card,
                      title: updatedCardData.title,
                      description: updatedCardData.description,
                      amount: updatedCardData.amount,
                      merchantId: updatedCardData.merchantId,
                      contactId: updatedCardData.contactId,
                      deadline: updatedCardData.deadline,
                      tags: updatedCardData.tags,
                    }
                  : card,
              ),
            }
          : list,
      ),
    )

    // Update cache
    const organisationId = getOrganisationId()
    if (organisationId) {
      const cachedData = stagesCache.current.get(organisationId)
      if (cachedData) {
        const updatedCache = cachedData.map((stage) =>
          stage.id === selectedCard.listId
            ? {
                ...stage,
                opportunities: stage.opportunities.map((opp: any) =>
                  opp.id === selectedCard.cardId
                    ? {
                        ...opp,
                        label: updatedCardData.title,
                        description: updatedCardData.description,
                        amount: updatedCardData.amount,
                        merchantId: updatedCardData.merchantId,
                        contactId: updatedCardData.contactId,
                        deadline: updatedCardData.deadline,
                        tags: updatedCardData.tags,
                      }
                    : opp,
                ),
              }
            : stage,
        )
        stagesCache.current.set(organisationId, updatedCache)
      }
    }
  }

  const getListStyle = (color?: string) => {
    if (!color) return {}
    return { backgroundColor: listColors[color as keyof typeof listColors] || "#fff" }
  }

  if (loading) {
    return <Chargement />
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <style jsx global>{`
        .dragging-card {
          opacity: 0.8;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
          transform: rotate(2deg);
        }
        
        .dragging-list {
          opacity: 0.9;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transform: rotate(1deg);
        }
      `}</style>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="lists" direction="horizontal" type="list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-4 overflow-x-auto pb-4">
              {lists.map((list, listIndex) => (
                <Draggable key={list.id} draggableId={list.id} index={listIndex}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`w-72 flex-shrink-0 rounded-lg overflow-hidden shadow-md border-black/30 border ${
                        snapshot.isDragging ? "dragging-list" : ""
                      }`}
                      style={{
                        ...getListStyle(list.color),
                        ...provided.draggableProps.style,
                        height: "fit-content",
                        minHeight: "100px",
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between px-3 py-2.5 text-black"
                      >
                        {editingListId === list.id ? (
                          <Input
                            value={editingListTitle}
                            onChange={(e) => setEditingListTitle(e.target.value)}
                            onBlur={async () => {
                              if (editingListTitle.trim()) {
                                setLists(
                                  lists.map((l) =>
                                    l.id === list.id ? { ...l, title: editingListTitle, label: editingListTitle } : l,
                                  ),
                                )
                                await updateStepName(list.id, editingListTitle)
                                const organisationId = getOrganisationId()
                                if (organisationId) {
                                  const cachedData = stagesCache.current.get(organisationId)
                                  if (cachedData) {
                                    const updatedCache = cachedData.map((stage) =>
                                      stage.id === list.id ? { ...stage, label: editingListTitle } : stage,
                                    )
                                    stagesCache.current.set(organisationId, updatedCache)
                                  }
                                }
                              }
                              setEditingListId(null)
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" && editingListTitle.trim()) {
                                setLists(
                                  lists.map((l) =>
                                    l.id === list.id ? { ...l, title: editingListTitle, label: editingListTitle } : l,
                                  ),
                                )
                                await updateStepName(list.id, editingListTitle)
                                const organisationId = getOrganisationId()
                                if (organisationId) {
                                  const cachedData = stagesCache.current.get(organisationId)
                                  if (cachedData) {
                                    const updatedCache = cachedData.map((stage) =>
                                      stage.id === list.id ? { ...stage, label: editingListTitle } : stage,
                                    )
                                    stagesCache.current.set(organisationId, updatedCache)
                                  }
                                }
                                setEditingListId(null)
                              } else if (e.key === "Escape") {
                                setEditingListId(null)
                              }
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
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm"
                                onClick={() => setAddingCard(list.id)}
                              >
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
                                              onClick={() => handleColorChange(list.id, key, list)}
                                            />
                                          )
                                        })}
                                      </div>
                                      <button
                                        className="flex items-center px-10 mt-5 text-sm text-gray-300"
                                        onClick={() => handleColorChange(list.id, null, list)}
                                      >
                                        <X size={14} className="mr-2" /> Supprimer la couleur
                                      </button>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>

                              <div className="mt-2 border-t border-gray-700 pt-2">
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm"
                                  onClick={() => archiveList(list.id)}
                                >
                                  Archiver cette liste
                                </button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Droppable droppableId={list.id} type="card">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-col gap-2 p-2"
                            style={{
                              minHeight: "50px",
                            }}
                          >
                            {list.cards.map((card, index) => (
                              <Draggable key={card.id} draggableId={card.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`flex items-center justify-between rounded-md bg-gray-800 p-2 text-white hover:bg-gray-700 cursor-pointer ${
                                      snapshot.isDragging ? "dragging-card" : ""
                                    }`}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div
                                      className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                                      onClick={() => handleCardClick(list.id, card.id)}
                                    >
                                      <p>{card.title}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(card.id)
                                      }}
                                      className="flex items-center gap-2 p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                                      aria-label="Supprimer"
                                    >
                                      <FaRegTrashAlt
                                        size={14}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                      />
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}

                            {addingCard === list.id ? (
                              <div className="rounded-md bg-gray-800 p-2">
                                <Textarea
                                  value={newCardTitle}
                                  onChange={(e) => setNewCardTitle(e.target.value)}
                                  placeholder="Entrez un titre pour cette carte..."
                                  className="mb-2 resize-none bg-gray-800 text-white"
                                  autoFocus
                                />
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={() => handleAddCard(list.id)}
                                    className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80"
                                  >
                                    Ajouter une carte
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setAddingCard(null)
                                      setNewCardTitle("")
                                    }}
                                    className="text-white"
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setAddingCard(list.id)}
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
              ))}
              {provided.placeholder}

              {addingList ? (
                <div className="w-72 flex-shrink-0 rounded-md bg-black/20 p-2">
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Entrez le titre de la liste..."
                    className="mb-2 bg-gray-800 text-white"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleAddList} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
                      Ajouter une liste
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAddingList(false)
                        setNewListTitle("")
                      }}
                      className="text-white"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingList(true)}
                  className="flex h-10 w-72 items-center gap-2 rounded-md bg-black/20 px-3 text-black hover:bg-black/30 hover:text-white font-bold"
                >
                  <Plus size={16} />
                  <span>Ajouter une autre liste</span>
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedCard && (
        <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
          <DialogContent className="max-w-5xl px-5 mt-8 text-white border-gray-700">
            <CardDetail cardDetails={getCardDetails()} onClose={() => setSelectedCard(null)} onSave={handleCardSave} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}