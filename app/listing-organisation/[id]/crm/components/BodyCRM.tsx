"use client"

import { useEffect, useMemo, useState } from "react"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
import { type Contact, type Deal, type DealStage, initialDealsData, type Merchant, merchantsData } from "./types"
import { HeaderCRM } from "./HeaderCRM"
import { DealStageColumn } from "./DealStageColumn"
import { EditDealSheet } from "./EditDealSheet"
import { AddStageSheet } from "./AddStageSheet"
import { SelectColumnSheet } from "./SelectColumnSheet"
import { EditStageSheet } from "./EditStageSheet"
import { Button } from "@/components/ui/button"
import Chargement from "@/components/Chargement"

export default function BodyCRM() {
  const [dealStages, setDealStages] = useState<DealStage[]>([])
  const [dealsData, setDealsData] = useState<{ [key: string]: Deal[] }>(() => ({
    ...initialDealsData,
  }))

  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [isAddingNewDeal, setIsAddingNewDeal] = useState(false)
  const [addingStage, setAddingStage] = useState<DealStage | null>(null)
  const [editingStage, setEditingStage] = useState<DealStage | null>(null)
  const [newDealColumn, setNewDealColumn] = useState<string | null>(null)
  const [showColumnSelection, setShowColumnSelection] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // État pour suivre le chargement

  const [filters, setFilters] = useState({
    merchant: [] as string[],
    contact: [] as string[],
    tag: [] as string[],
    search: null as string | null,
  })

  useEffect(() => {
    const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/)
    if (!match) {
      console.error("Organisation ID not found in URL")
      setIsLoading(false) // Arrêter le chargement même en cas d'erreur
      return
    }

    const organisationId = match[1]
    const fetchStages = async () => {
      try {
        const res = await fetch(`/api/deal-stages?organisationId=${organisationId}`)
        if (!res.ok) throw new Error("Failed to fetch deal stages")

        const data: DealStage[] = await res.json()
        setDealStages(data)
        setDealsData((prev) => {
          const newData = { ...prev }
          data.forEach((stage) => {
            if (!newData[stage.id]) newData[stage.id] = []
          })
          return newData
        })
      } catch (e) {
        console.error("Error fetching deal stages", e)
      } finally {
        // Arrêter le chargement une fois les données récupérées ou en cas d'erreur
        setIsLoading(false)
      }
    }

    // Simuler un délai minimum pour éviter un flash de chargement trop rapide
    const timer = setTimeout(() => {
      fetchStages()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result
    if (!destination) return

    if (type === "COLUMN") {
      if (source.index === destination.index) return

      const reordered = [...dealStages]
      const [removed] = reordered.splice(source.index, 1)
      reordered.splice(destination.index, 0, removed)
      setDealStages(reordered)
      return
    }

    const updatedDeals = { ...dealsData }
    const src = updatedDeals[source.droppableId] || []
    const dest = updatedDeals[destination.droppableId] || []

    if (source.droppableId === destination.droppableId) {
      const items = [...src]
      const [moved] = items.splice(source.index, 1)
      items.splice(destination.index, 0, moved)
      updatedDeals[source.droppableId] = items
    } else {
      const [moved] = src.splice(source.index, 1)
      dest.splice(destination.index, 0, moved)
      updatedDeals[source.droppableId] = src
      updatedDeals[destination.droppableId] = dest
    }

    setDealsData(updatedDeals)
  }

  const handleSaveDeal = (updatedDeal: Deal) => {
    if (isAddingNewDeal) {
      const columnId = newDealColumn || "default"
      setDealsData((prev) => ({
        ...prev,
        [columnId]: [...(prev[columnId] || []), updatedDeal],
      }))
    } else {
      setDealsData((prev) => {
        const newData = { ...prev }
        for (const stage of dealStages) {
          const idx = newData[stage.id]?.findIndex((d) => d.id === updatedDeal.id)
          if (idx !== -1 && idx !== undefined) {
            newData[stage.id][idx] = updatedDeal
            break
          }
        }
        return newData
      })
    }
    setEditingDeal(null)
    setIsAddingNewDeal(false)
    setNewDealColumn(null)
  }

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal)
    setIsAddingNewDeal(false)
  }

  const handleDeleteDeal = (dealId: string) => {
    setDealsData((prev) => {
      const newData = { ...prev }
      for (const stage in newData) {
        newData[stage] = newData[stage].filter((deal) => deal.id !== dealId)
      }
      return newData
    })
  }

  const handleAddCardToColumn = (columnId: string) => {
    setNewDealColumn(columnId)
    setEditingDeal({
      id: `new-${Date.now()}`,
      label: "",
      amount: 0,
      tags: [],
      tagColors: [],
    })
    setIsAddingNewDeal(true)
  }

  const handleSaveStage = (newStage: DealStage) => {
    setDealStages((prev) => [...prev, newStage])
    setDealsData((prev) => ({ ...prev, [newStage.id]: [] }))
    setAddingStage(null)
  }

  const handleUpdateStage = (updatedStage: DealStage) => {
    setDealStages((prev) => prev.map((stage) => (stage.id === updatedStage.id ? updatedStage : stage)))
    setEditingStage(null)
  }

  const handleDeleteStage = (stageId: string) => {
    setDealStages((prev) => prev.filter((stage) => stage.id !== stageId))
    setDealsData((prev) => {
      const newData = { ...prev }
      delete newData[stageId]
      return newData
    })
  }

  const { merchants, contacts } = useMemo(() => {
    const allDeals = Object.values(dealsData).flat()
    const merchantsMap = new Map<string, Merchant>()
    const contactsMap = new Map<string, Contact>()

    merchantsData.forEach((merchant) => {
      merchant.contacts.forEach((contact) => {
        if (!contactsMap.has(contact.id)) contactsMap.set(contact.id, contact)
      })
    })

    allDeals.forEach((deal) => {
      if (deal.merchantId && !merchantsMap.has(deal.merchantId)) {
        const merchant = merchantsData.find((m) => m.id === deal.merchantId)
        if (merchant) merchantsMap.set(merchant.id, merchant)
      }

      if (deal.contactId && !contactsMap.has(deal.contactId)) {
        let found
        for (const m of merchantsData) {
          found = m.contacts.find((c) => c.id === deal.contactId)
          if (found) break
        }
        if (found) contactsMap.set(found.id, found)
      }
    })

    return {
      merchants: Array.from(merchantsMap.values()),
      contacts: Array.from(contactsMap.values()),
    }
  }, [dealsData])

  const filterDeals = (deals: Deal[]) => {
    return deals.filter((deal) => {
      if (filters.merchant.length > 0 && deal.merchantId && !filters.merchant.includes(deal.merchantId)) {
        return false
      }

      if (filters.contact.length > 0) {
        if (deal.contactId && filters.contact.includes(deal.contactId)) return true

        if (deal.merchantId) {
          const merchant = merchantsData.find((m) => m.id === deal.merchantId)
          if (merchant && merchant.contacts.some((c) => filters.contact.includes(c.id))) return true
        }

        return false
      }

      if (filters.tag.length > 0 && (!deal.tags || !filters.tag.some((tag) => deal.tags?.includes(tag)))) {
        return false
      }

      if (filters.search && !deal.label.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      return true
    })
  }

  const isEmptyBoard = dealStages.length === 0

  return (
    <div className="flex flex-col h-full bg-white">
      <HeaderCRM
        merchants={merchants}
        contacts={contacts}
        deals={Object.values(dealsData).flat()}
        onFilterChange={(type, value) => {
          setFilters((prev) => ({
            ...prev,
            [type]: value === null ? [] : Array.isArray(value) ? value : [value],
          }))
        }}
        onSearch={(searchTerm) => setFilters((prev) => ({ ...prev, search: searchTerm }))}
        currentFilters={filters}
        onAddClick={() => setShowColumnSelection(true)}
        onAddColumn={() =>
          setAddingStage({
            id: `stage-${Date.now()}`,
            label: "Nouvelle étape",
            color: "bg-gray-500",
          })
        }
      />
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <Chargement />
        ) : isEmptyBoard ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-base mb-4">Vous n'avez pas de colonne, créez-en</p>
            <Button
              onClick={() =>
                setAddingStage({
                  id: `stage-${Date.now()}`,
                  label: "Nouvelle étape",
                  color: "bg-gray-500",
                })
              }
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
            >
              Créer une colonne
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex px-6 pb-6 flex-1 w-full overflow-x-auto"
                >
                  <div className="flex gap-4 h-full min-h-full">
                    {dealStages.map((stage, index) => (
                      <Draggable key={stage.id} draggableId={stage.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex-shrink-0"
                            style={{ width: "300px", height: "100%" }}
                          >
                            <DealStageColumn
                              stage={stage}
                              deals={filterDeals(dealsData[stage.id] || [])}
                              onEditDeal={handleEditDeal}
                              onDelete={handleDeleteDeal}
                              onEditStage={() => setEditingStage(stage)}
                              onDeleteStage={() => handleDeleteStage(stage.id)}
                              onAddCard={() => handleAddCardToColumn(stage.id)}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <EditDealSheet
        deal={editingDeal}
        onSave={handleSaveDeal}
        onOpenChange={(open) => !open && setEditingDeal(null)}
        isAddingNew={isAddingNewDeal}
      />

      <AddStageSheet
        stage={addingStage}
        onSave={handleSaveStage}
        onOpenChange={() => setAddingStage(null)} />

      <SelectColumnSheet
        open={showColumnSelection}
        onOpenChange={setShowColumnSelection}
        columns={dealStages}
        onSelect={(columnId) => {
          handleAddCardToColumn(columnId)
          setShowColumnSelection(false)
        }}
        onAddColumn={() =>
          setAddingStage({
            id: `stage-${Date.now()}`,
            label: "Nouvelle étape",
            color: "bg-gray-500",
          })
        }
      />

      <EditStageSheet
        stage={editingStage}
        onOpenChange={() => setEditingStage(null)}
        onSave={handleUpdateStage} />
    </div>
  )
}
