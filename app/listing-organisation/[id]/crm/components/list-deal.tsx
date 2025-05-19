"use client"

import { useState } from "react"
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Chargement from "@/components/Chargement"
import { KanbanList } from "./kanban-list"
import { CardDetail } from "./card-detail"
import { ConfirmationDialog } from "./confirmation-dialog"
import { useKanbanData } from "@/hooks/use-kanban-data"
import type { Deal, Merchant, Contact, AddStepResponse } from "./types"
import { updateDealdrage } from "../action/updateDealdrage"
import { addStep } from "../action/createcolum"
import { createDeal } from "../action/createDeal"
import { deleteDealStage } from "../action/deleteDealStage"
import { deleteDeal } from "../action/deletedeals"
import { reorderSteps } from "../action/updateSte"

interface ListDealProps {
  merchants?: Merchant[]
  contacts?: Contact[]
  deals?: Deal[]
}

export function ListDeal({ merchants, contacts, deals }: ListDealProps) {
  const [newListTitle, setNewListTitle] = useState("")
  const [addingList, setAddingList] = useState(false)
  const [addingCard, setAddingCard] = useState<string | null>(null)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [selectedCard, setSelectedCard] = useState<{ listId: string; cardId: string } | null>(null)
  const [listToDelete, setListToDelete] = useState<string | null>(null)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)

  const { lists, setLists, loading, error, isUpdating, setIsUpdating, fetchStages, getOrganisationId, stagesCache } =
    useKanbanData()

    const handleDragEnd = async (result: DropResult) => {
      const { source, destination, draggableId, type } = result;
    
      // If there's no destination or if the drag didn't change the position, do nothing.
      if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
        return;
      }
    
      const previousLists = [...lists];
      setIsUpdating(true);
    
      try {
        setLists((prev) => {
          const newLists = [...prev];
    
          // Handle "card" type dragging
          if (type === "card") {
            const srcList = newLists.find((l) => l.id === source.droppableId);
            const destList = newLists.find((l) => l.id === destination.droppableId);
    
            if (!srcList || !destList) return prev;
    
            const [movedCard] = srcList.cards.splice(source.index, 1);
            if (!movedCard) return prev;
    
            destList.cards.splice(destination.index, 0, movedCard);
          } 
          // Handle "list" type dragging
          else if (type === "list") {
            const [movedList] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, movedList);
          }
    
          return newLists;
        });
    
        // If it's a "card" move, update the backend and cache for the card.
        if (type === "card") {
          await updateDealdrage({
            id: draggableId,
            stepId: destination.droppableId, // Assuming stepId corresponds to the destination droppableId
          });
    
          const organisationId = getOrganisationId();
          if (organisationId) {
            const cachedData = stagesCache.current.get(organisationId);
            if (cachedData) {
              const updatedCache = [...cachedData];
              const srcStageIndex = updatedCache.findIndex((s) => s.id === source.droppableId);
              const destStageIndex = updatedCache.findIndex((s) => s.id === destination.droppableId);
    
              if (srcStageIndex !== -1 && destStageIndex !== -1) {
                const [movedOpp] = updatedCache[srcStageIndex].opportunities.splice(source.index, 1);
                updatedCache[destStageIndex].opportunities.splice(destination.index, 0, movedOpp);
                stagesCache.current.set(organisationId, updatedCache);
              }
            }
          }
    
          toast.success("Carte déplacée avec succès");
        } 
        // If it's a "list" move, update the backend and cache for the list.
        else if (type === "list") {
          const organisationId = getOrganisationId();
        
          if (!organisationId) return;
        
          if (organisationId) {
            const cachedData = stagesCache.current.get(organisationId);
            if (cachedData) {
              const updatedCache = [...cachedData];
              const [movedStage] = updatedCache.splice(source.index, 1);
              updatedCache.splice(destination.index, 0, movedStage);
        
              // Adjust stepNumber for the moved and destination stages
              const fromStage = updatedCache[source.index]; // The stage being moved
              const toStage = updatedCache[destination.index]; // The stage the item is dropped onto
        
              // Reorder the steps based on their new positions
              reorderSteps({
                organisationId,
                from: fromStage.stepNumber, // The step number of the moved stage
                to: toStage.stepNumber,     // The step number of the destination
              }).then(response => {
                if (response.success) {
                  // If the backend update was successful, update the frontend cache
                  stagesCache.current.set(organisationId, updatedCache);
                  toast.success("Liste déplacée avec succès");
                } else {
                  console.error('Erreur lors de la mise à jour des étapes:', response.error);
                }
              });
        
              // Update the cache to reflect the new order
              stagesCache.current.set(organisationId, updatedCache);
            }
          }
        
        }
        
      } catch (error) {
        console.error("Erreur lors du déplacement:", error);
        setLists(previousLists);
        toast.error("Erreur lors du déplacement. Les changements ont été annulés.");
      } finally {
        setIsUpdating(false);
      }
    };
    

  const handleAddList = async () => {
    const organisationId = getOrganisationId()
    if (!organisationId) {
      toast.error("ID de l'organisation non trouvé")
      return
    }

    if (newListTitle.trim()) {
      try {
        const tempId = `temp-${Date.now()}`
        toast("Ajout de la liste en cours...")

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

        const result = (await addStep(newListTitle, organisationId, null)) as AddStepResponse

        if (result.success) {
          const newId = result.newStep?.id || result.id || tempId
          setLists((prev) => prev.map((list) => (list.id === tempId ? { ...list, id: newId } : list)))

          const cachedData = stagesCache.current.get(organisationId);

          if (cachedData) {
            // Calculate the next stepNumber based on the highest stepNumber in the current cache
            const nextStepNumber = Math.max(...cachedData.map(stage => stage.stepNumber), 0) + 1;
          
            const updatedCache = [
              ...cachedData,
              {
                id: newId,                // Assuming `newId` is already defined
                label: newListTitle,      // Assuming `newListTitle` is already defined
                stepNumber: nextStepNumber, // Assign the calculated next stepNumber
                color: null,              // Default color (null in this case)
                opportunities: [],        // Empty array for opportunities (could be populated later)
              },
            ];
          
            // Update the cache with the new stage
            stagesCache.current.set(organisationId, updatedCache);
          }
          

          toast.success("Liste ajoutée avec succès")
        } else {
          setLists((prev) => prev.filter((list) => list.id !== tempId))
          toast.error(result.error || "Échec de l'ajout de la liste")
        }
      } catch (e) {
        toast.error("Une erreur est survenue lors de l'ajout de la liste")
      }
    }
  }

  const handleAddCard = async (listId: string) => {
    if (newCardTitle.trim()) {
      try {
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
              : list
          )
        )

        setNewCardTitle("")
        setAddingCard(null)

        const toastId = toast.loading("Création de la carte en cours...")

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
          setLists((prev) =>
            prev.map((list) =>
              list.id === listId
                ? {
                  ...list,
                  cards: list.cards.map((card) =>
                    card.id === tempId ? { ...card, id: result.deal?.id || card.id } : card
                  ),
                }
                : list
            )
          )

          toast.success("Carte créée avec succès", { id: toastId })
        } else {
          setLists((prev) =>
            prev.map((list) =>
              list.id === listId
                ? {
                  ...list,
                  cards: list.cards.filter((card) => card.id !== tempId),
                }
                : list
            )
          )
          toast.error(result.error || "Échec de la création de la carte", { id: toastId })
        }
      } catch (e) {
        toast.error("Une erreur est survenue lors de la création de la carte")
        console.error("Erreur lors de l'ajout de la carte", e)
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

  const archiveList = async (listId: string) => {
    const startTime = Date.now()
    const MIN_LOADING_TIME = 500 // 500ms minimum de chargement
    const currentLists = [...lists]
    const listToRemove = lists.find((list) => list.id === listId)

    if (!listToRemove) {
      toast.error("Liste introuvable")
      return
    }

    try {
      setIsUpdating(true)
      setLists((prev) => prev.filter((list) => list.id !== listId))
      toast("Suppression de la liste en cours...")

      await deleteDealStage(listId)

      const organisationId = getOrganisationId()
      if (organisationId) {
        const cachedData = stagesCache.current.get(organisationId)
        if (cachedData) {
          const updatedCache = cachedData.filter((stage) => stage.id !== listId)
          stagesCache.current.set(organisationId, updatedCache)
        }
      }

      toast.success("Liste supprimée avec succès")



      const elapsed = Date.now() - startTime
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsed))
      }
    } catch (error) {
      console.error("Échec de la suppression de la liste:", error)
      setLists(currentLists)
      toast.error("Échec de la suppression de la liste")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCard = async (id: string) => {
    const listContainingCard = lists.find((list) => list.cards.some((card) => card.id === id))

    if (!listContainingCard) {
      toast.error("Carte introuvable")
      return
    }

    try {
      toast("Suppression de la carte en cours...")

      setLists((prev) =>
        prev.map((list) =>
          list.id === listContainingCard.id
            ? { ...list, cards: list.cards.filter((card) => card.id !== id) }
            : list
        )
      )

      const result = await deleteDeal(id)

      if (result.success) {
        toast.success("Carte supprimée avec succès")

        const organisationId = getOrganisationId()
        if (organisationId) {
          const cachedData = stagesCache.current.get(organisationId)
          if (cachedData) {
            const updatedCache = cachedData.map((stage) =>
              stage.id === listContainingCard.id
                ? { ...stage, opportunities: stage.opportunities.filter((opp: any) => opp.id !== id) }
                : stage
            )
            stagesCache.current.set(organisationId, updatedCache)
          }
        }
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue")
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handleCardSave = async (updatedCardData: any) => {
    if (!selectedCard) return

    try {
      const toastId = toast.loading("Mise à jour de la carte en cours...")

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
                  : card
              ),
            }
            : list
        )
      )

      toast.success("Carte mise à jour avec succès", { id: toastId })

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
                    : opp
                ),
              }
              : stage
          )
          stagesCache.current.set(organisationId, updatedCache)
        }
      }
    } catch (error) {
      toast.error("Échec de la mise à jour de la carte")
      console.error("Erreur lors de la mise à jour de la carte:", error)
    }
  }

  if (loading || isUpdating) {
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
                <KanbanList
                  key={list.id}
                  list={list}
                  index={listIndex}
                  onCardClick={handleCardClick}
                  onDeleteCard={(cardId) => setCardToDelete(cardId)}
                  onAddCard={() => setAddingCard(list.id)}
                  addingCard={addingCard === list.id}
                  newCardTitle={newCardTitle}
                  setNewCardTitle={setNewCardTitle}
                  handleAddCard={handleAddCard}
                  setAddingCard={setAddingCard}
                  setListToDelete={setListToDelete}
                  stagesCache={stagesCache}
                  getOrganisationId={getOrganisationId}
                />
              ))}
              {provided.placeholder}

              {addingList ? (
                <div className="w-72 flex-shrink-0 rounded-md bg-[#f1f2f4] p-2">
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Entrez le titre de la liste..."
                    className="mb-2 bg-white text-black"
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
                      className=""
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingList(true)}
                  className="flex h-10 w-72 flex-shrink-0 items-center gap-2 rounded-md bg-[#f1f2f4] px-3 text-black hover:bg-black/10 font-medium"
                  style={{ minWidth: "288px" }}
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
          <DialogContent className="max-w-5xl px-5  text-white bg-[#f1f2f4]">
            <CardDetail cardDetails={getCardDetails()} onClose={() => setSelectedCard(null)} onSave={handleCardSave} />
          </DialogContent>
        </Dialog>
      )}

      <ConfirmationDialog
        open={!!listToDelete}
        title="Supprimer la liste"
        description="Êtes-vous sûr de vouloir supprimer cette liste ? Toutes les cartes qu'elle contient seront également supprimées. Cette action ne peut pas être annulée."
        onCancel={() => setListToDelete(null)}
        onConfirm={() => {
          if (listToDelete) {
            archiveList(listToDelete)
            setListToDelete(null)
          }
        }}
      />

      <ConfirmationDialog
        open={!!cardToDelete}
        title="Supprimer la carte"
        description="Êtes-vous sûr de vouloir supprimer cette carte ? Cette action ne peut pas être annulée."
        onCancel={() => setCardToDelete(null)}
        onConfirm={() => {
          if (cardToDelete) {
            handleDeleteCard(cardToDelete)
            setCardToDelete(null)
          }
        }}
      />
    </div>
  )
}