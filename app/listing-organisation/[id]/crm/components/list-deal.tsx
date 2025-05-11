"use client"

import { useEffect, useState } from "react"
import { FaRegTrashAlt } from "react-icons/fa";
import { X, Plus, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { addStep } from "../action/createcolum"
import { DealStag } from "./types"
import { updateStep } from "../action/updateStep"
import { deleteDealStage } from "../action/deleteDealStage"
import { deleteDeal } from "../action/deletedeals"
import { createDeal } from "../action/createDeal"
import { CardDetail } from "./card-detail" // Assurez-vous que ce chemin d'import est correct
import Chargement from "@/components/Chargement"
import { toast } from "sonner";

type CardType = {
  id: string
  title: string
  description?: string
  amount?: number
  deadline?: string
  merchantId?: string | null
  contactId?: string | null
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

export default function ListDeal() {
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

  useEffect(() => {
    const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/)
    if (!match) {
      setError("ID de l'organisation non trouvé dans l'URL")
      setLoading(false)
      return
    }

    const organisationId = match[1]
    fetchStages(organisationId)
  }, [])

  const fetchStages = async (organisationId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/deal-stages?organisationId=${organisationId}`)
      
      if (!res.ok) {
        const responseBody = await res.json()
         console.log(responseBody)
        throw new Error(
          `Échec de la récupération des étapes de deal: ${JSON.stringify(responseBody)}`
        )
      }

      const data: DealStag[] = await res.json()

      const formattedLists: ListType[] = data.map((stage) => ({
        id: stage.id,
        label: stage.label,
        title: stage.label,
        color: stage.color || undefined,
        cards: stage.opportunities.map((opp: { id: any; label: any; description: any; amount: any; deadline: any; merchantId: any; contactId: any }) => ({
          id: opp.id,
          title: opp.label,
          description: opp.description,
          amount: opp.amount,
          deadline: opp.deadline,
          merchantId: opp.merchantId,
          contact: opp.contactId
        })),
      }))

      setLists(formattedLists)
      setError(null)
    } catch (e) {
      console.error("Erreur lors de la récupération des étapes de deal", e)
      setError(e instanceof Error ? e.message : "Échec de la récupération des données")
    } finally {
      setLoading(false)
    }
  }

  const handleAddList = async () => {
    const path = window.location.pathname
    const organisationId = path.match(/listing-organisation\/([a-zA-Z0-9]+)/)?.[1]

    if (!organisationId) {
      setError("ID de l'organisation non trouvé")
      return
    }

    if (newListTitle.trim()) {
      try {
        const { success, error } = await addStep(newListTitle, organisationId, null)

        if (success) {
          // Mise à jour optimiste de l'UI
          setLists(prev => [...prev, {
            id: Date.now().toString(), // ID temporaire
            label: newListTitle,
            title: newListTitle,
            cards: []
          }])
          
          setNewListTitle("")
          setAddingList(false)
          
          // Actualiser les données depuis le serveur
          fetchStages(organisationId)
        } else {
          setError(error || "Échec de l'ajout de la liste")
        }
      } catch (e) {
        setError("Une erreur est survenue lors de l'ajout de la liste")
      }
    }
  }

  const handleAddCard = async (listId: string) => {
    if (newCardTitle.trim()) {
      try {
        const result = await createDeal({
          label: newCardTitle,
          description: "",
          amount: 0,
          merchantId: undefined,
          contactId:  undefined,
          tags: [],
          tagColors: [],
          stepId: listId,
        })

        if (result.success) {
          // Mise à jour optimiste de l'UI
          setLists(prev =>
            prev.map(list =>
              list.id === listId
                ? {
                    ...list,
                    cards: [
                      ...list.cards,
                      {
                        id: result.deal?.id || Date.now().toString(),
                        title: newCardTitle,
                        description: "",
                        amount: 0
                      }
                    ]
                  }
                : list
            )
          )
          
          setNewCardTitle("")
          setAddingCard(null)
          
          // Actualiser les données depuis le serveur
          const organisationId = window.location.pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/)?.[1]
          if (organisationId) fetchStages(organisationId)
        } else {
          setError(result.error || "Échec de l'ajout de la carte")
        }
      } catch (e) {
        setError("Une erreur est survenue lors de l'ajout de la carte")
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
    list: { label: string }
  ) => {
    try {
      const organisationId = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/)?.[1]
      if (!organisationId) {
        setError("ID de l'organisation non trouvé")
        return
      }

      await updateStep(listId, list.label, colorKey, organisationId)
      
      // Mettre à jour l'état local
      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { ...list, color: colorKey || undefined }
            : list
        )
      )
    } catch (e) {
      setError("Échec de la mise à jour de la couleur de la liste")
    }
  }

  const archiveList = async (listId: string) => {
    try {
      await deleteDealStage(listId)
      setLists(prev => prev.filter(list => list.id !== listId))
    } catch (error) {
      setError("Échec de la suppression de la liste")
    }
  }

  const archiveCard = async (listId: string, cardId: string) => {
    try {
      await deleteDeal(cardId)
      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
            : list
        )
      )
    } catch (error) {
      setError("Échec de la suppression de la carte")
    }
  }

  const handleDelete = async (id: string) => {

    try {
      const result = await deleteDeal(id);
      if (result.success) {
        toast.message("Élément supprimé avec succès");
        // Optionnel : rafraîchir les données ou rediriger
      } else {
        toast.message("Erreur lors de la suppression ");
      }
    } catch (error) {
      toast.message("Une erreur inattendue est survenue");
    }
  };
  
  
  const getListStyle = (color?: string) => {
    if (!color) return {}
    return { backgroundColor: listColors[color as keyof typeof listColors] || "#000000" }
  }

  if (loading) {
    return (
      <>
        <Chargement/>
      </>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <div key={list.id} className="w-72 flex-shrink-0 rounded-md overflow-hidden" style={getListStyle(list.color)}>
            <div className="flex items-center justify-between px-3 py-2.5 text-white">
              {editingListId === list.id ? (
                <Input
                  value={editingListTitle}
                  onChange={(e) => setEditingListTitle(e.target.value)}
                  onBlur={() => {
                    if (editingListTitle.trim()) {
                      setLists(lists.map((l) => (l.id === list.id ? { ...l, title: editingListTitle } : l)))
                    }
                    setEditingListId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editingListTitle.trim()) {
                      setLists(lists.map((l) => (l.id === list.id ? { ...l, title: editingListTitle } : l)))
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
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-white/70 hover:text-white">
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 bg-gray-800 text-white border-gray-700 p-0 rounded-md">
                    <div className="flex items-center justify-between p-3 border-b border-gray-700">
                      <span className="text-sm font-medium">Actions de la liste</span>
                      <button className="text-gray-400 hover:text-white">
                        <X size={16} />
                      </button>
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
                              <span>Changer la couleur de la liste</span>
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
                                    ></div>
                                  )
                                })}
                              </div>
                              <button
                                className="flex items-center px-10 mt-5 text-sm text-gray-300"
                                onClick={() => handleColorChange(list.id, null, list)}
                              >
                                <X size={16} className="mr-2" /> Supprimer la couleur
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
            </div>

            <div className="flex flex-col gap-2 p-2">
              {list.cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-md bg-gray-800 p-2 text-white hover:bg-gray-700 cursor-pointer"
           
                >
                  <div className="flex items-center gap-2"        onClick={() => handleCardClick(list.id, card.id)}>
                  
                    <p>{card.title}</p>
                  </div>
                  <button
  type="button"
  onClick={() => handleDelete(card.id)}
  // Remplace par ta fonction de suppression
  className="flex items-center gap-2 p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
  aria-label="Supprimer"
>
  <FaRegTrashAlt size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
</button>

                </div>
              ))}

              {addingCard === list.id ? (
                <div className="rounded-md bg-gray-800 p-2">
                  <Textarea
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Entrez un titre pour cette carte..."
                    className="mb-2 resize-none bg-gray-800 text-white"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleAddCard(list.id)} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
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
                  className="flex items-center gap-2 rounded-md p-2 text-white/90 hover:bg-black/10"
                >
                  <Plus size={16} />
                  <span>Ajouter une carte</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {addingList ? (
          <div className="w-72 flex-shrink-0 rounded-md bg-black/20 p-2">
            <Input
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Entrez le titre de la liste..."
              className="mb-2 bg-gray-800 text-white"
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleAddList}  className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
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
            className="flex h-10 w-72 items-center gap-2 rounded-md bg-black/20 px-3 text-white/70 hover:bg-black/30 hover:text-white"
          >
            <Plus size={16} />
            <span>Ajouter une autre liste</span>
          </button>
        )}
      </div>

      {selectedCard && (
        <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
          <DialogContent className="max-w-3xl bg-gray-800 p-0 text-white border-gray-700">
            <CardDetail cardDetails={getCardDetails()} onClose={() => setSelectedCard(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}