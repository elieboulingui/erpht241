"use client"

import { useEffect, useState } from "react"
import { X, Plus, MoreHorizontal, Circle, ExternalLink } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CardDetail } from "./card-detail"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { addStep } from "../action/createcolum"
import { DealStag } from "./types"
import { updateStep } from "../action/updateStep"
import { deleteDealStage } from "../action/deleteDealStage"
import { deleteDeal } from "../action/deletedeals"

type ListType = {
  id: string
  label: string; 
  title: string
  color?: string
  cards: { id: string; title: string }[]
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
}

export default function ListDeal() {
  const [lists, setLists] = useState<ListType[]>([])
  const [newListTitle, setNewListTitle] = useState("")
  const [addingList, setAddingList] = useState(false)
  const [addingCard, setAddingCard] = useState<string | null>(null)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [selectedCard, setSelectedCard] = useState<{ listId: string; cardId: string } | null>(null)
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListTitle, setEditingListTitle] = useState("")

  useEffect(() => {
    const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/)
    if (!match) {
      console.error("Organisation ID not found in URL")
      return
    }

    const organisationId = match[1]

    const fetchStages = async () => {
      try {
        const res = await fetch(`/api/deal-stages?organisationId=${organisationId}`)
        if (!res.ok) {
          const responseBody = await res.json()
          throw new Error(
            `Failed to fetch deal stages, status: ${res.status} and message: ${JSON.stringify(responseBody)}`
          )
        }

        const data: DealStag[] = await res.json()

        const formattedLists: ListType[] = data.map((stage) => ({
          id: stage.id,
          label : stage.label,
          title: stage.label,
          color: stage.color || undefined,
          cards: [], // Tu peux remplir les cartes plus tard si tu les récupères aussi
        }))

        setLists(formattedLists)
      } catch (e) {
        console.error("Error fetching deal stages", e)
      }
    }

    fetchStages()
  }, [])
  const handleAddList = async () => {
    // Use window.location to get the current URL
    const path = window.location.pathname;
    
    // Extract the organisationId using regex from the URL
    const organisationId = path.match(/listing-organisation\/([a-zA-Z0-9]+)/)?.[1];
  
    if (!organisationId) {
      console.error('Organisation ID not found');
      return;
    }
  
    if (newListTitle.trim()) {
      const { success, error } = await addStep(newListTitle, organisationId, null);
  
      if (success) {
        // Add new list if step was successful
        setLists([...lists, { id: `list${Date.now()}`, label : '', title: newListTitle, cards: [] }]);
        setNewListTitle("");
        setAddingList(false);
      } else {
        console.error('Error adding step:', error);
      }
    }
  };
  

  const handleAddCard = (listId: string) => {
    if (newCardTitle.trim()) {
      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, { id: `card${Date.now()}`, title: newCardTitle }] }
            : list,
        ),
      )
      setNewCardTitle("")
      setAddingCard(null)
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

  const handleColorChange = (
    listId: string,
    colorKey: keyof typeof listColors | null = null,
    list: { label: string }
  ) => {
    // Vérifier que la couleur est valide
    if (colorKey && listColors[colorKey]) {
      const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/);
      if (match && match[1]) {
        const organisationId = match[1];
        updateStep(listId, list.label, colorKey, organisationId);
      }
    } else {
      // Si la couleur est invalide, tu peux soit ne rien faire, soit gérer une valeur par défaut
      console.error('Couleur invalide ou non trouvée');
    }
  };
  
  
  
  
  const changeListColor = (listId: string, color?: string) => {
    setLists(lists.map((list) => (list.id === listId ? { ...list, color } : list)))
  }
  const archiveList = async (listId: string) => {
    try {
      await deleteDealStage(listId); // Passe listId à deleteDealStage
  
      setLists(
        lists
          .map((list) => (list.id === listId ? { ...list, archived: true } : list))
          .filter((list) => !list.archived)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape :", error);
    }
  };
  
  

  const archiveAllCards = async (listId: string) => {
    try {
      await deleteDeal(listId); // Passe listId à deleteDealStage
  
      setLists(
        lists
          .map((list) => (list.id === listId ? { ...list, archived: true } : list))
          .filter((list) => !list.archived)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape :", error);
    }
  }

  const getListStyle = (color?: string) => {
    if (!color) return {}
    return { backgroundColor: listColors[color as keyof typeof listColors] || "#000000" }
  }

  const visibleLists = lists.filter((list) => !list.archived)

  return (
    <div className="min-h-screen p-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {visibleLists.map((list) => (
          <div key={list.id} className="w-72 flex-shrink-0 rounded-md overflow-hidden" style={getListStyle(list.color)}>
            <div className="flex items-center justify-between px-3 py-2.5  text-white">
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
                      <span className="text-sm font-medium">Liste des actions</span>
                      <button className="text-gray-400 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                        Ajouter une carte
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                        Copier la liste
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                        Déplacer la liste
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                        Déplacer toutes les cartes de cette liste
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                        Suivregbt
                      </button>

                      <div className="mt-2 border-t border-gray-700 pt-2">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="list-color" className="border-none">
                            <AccordionTrigger className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                              <div className="">
                                <span>Modifier la couleur des listes</span>

                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 py-2">
  <div className="grid grid-cols-5 gap-1">
    {Object.keys(listColors).map((colorKey) => {
      const key = colorKey as keyof typeof listColors;  // Assertion de type
      return (
        <div
          key={key}
          className="h-6 w-6 rounded-sm cursor-pointer"
          style={{
            backgroundColor: listColors[key],  // Utilisation du key dans listColors
          }}
          onClick={() => handleColorChange(list.id, key, list)}  // Appel avec key comme colorKey
        ></div>
      );
    })}
  </div>
  <button
    className="flex items-center px-10 mt-5 text-sm text-gray-300"
    onClick={() => handleColorChange(list.id, null, list)}  // Appel avec null pour supprimer la couleur
  >
    <X size={16} className="mr-2" /> Supprimer la couleur
  </button>
</AccordionContent>



                          </AccordionItem>
                        </Accordion>
                      </div>

                      <div className="mt-2 border-t border-gray-700 pt-2">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="automation" className="border-none">
                            <AccordionTrigger className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                              Automatisation
                            </AccordionTrigger>
                            <AccordionContent className="px-3">
                              <button className="w-full text-left py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                                Lorsqu'une carte est ajoutée à la liste...
                              </button>
                              <button className="w-full text-left py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                                Tous les jours, trier la liste par...
                              </button>
                              <button className="w-full text-left py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                                Tous les lundis, trier la liste par...
                              </button>
                              <div className="flex items-center justify-between w-full text-left py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm">
                                <span>Créer une règle</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                                </svg>
                              </div>
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
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-sm"
                          onClick={() => archiveAllCards(list.id)}
                        >
                          Archiver toutes les cartes de cette liste
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
                  onClick={() => handleCardClick(list.id, card.id)}
                >
                  <div className="flex items-center gap-2">
                    <Input type="radio" name="card" value={card.id} className="h-4 w-4 text-gray-400 bg-black" />
                    <p>{card.title}</p>
                  </div>
                  <ExternalLink size={14} className="text-gray-400" />
                </div>
              ))}

              {addingCard === list.id ? (
                <div className="rounded-md bg-gray-800 p-2">
                  <Textarea
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Saisissez un titre pour cette carte..."
                    className="mb-2 resize-none bg-gray-800 text-white"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleAddCard(list.id)}
                      className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
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
                  <div className="ml-auto">
                    <span className="text-lg">⊞</span>
                  </div>
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
              placeholder="Saisissez le titre de la liste..."
              className="mb-2 bg-gray-800 text-white"
            />
            <div className="flex items-center gap-2">
              <Button onClick={handleAddList} className="bg-blue-500 text-white hover:bg-blue-600">
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
            <span>Ajoutez une autre liste</span>
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
