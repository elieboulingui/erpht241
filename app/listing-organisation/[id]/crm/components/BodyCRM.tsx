"use client";

import { useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Contact, Deal, DealStage, INITIAL_DEAL_STAGES, initialDealsData, Merchant, merchantsData } from "./types";
import { HeaderCRM } from "./HeaderCRM";
import { DealStageColumn } from "./DealStageColumn";
import { EditDealSheet } from "./EditDealSheet";
import { AddStageSheet } from "./AddStageSheet";
import { SelectColumnSheet } from "./SelectColumnSheet";
import { EditStageSheet } from "./EditStageSheet";
import { FilterModal } from "./FilterModal";

export default function BodyCRM() {
  const [dealStages, setDealStages] = useState<DealStage[]>(INITIAL_DEAL_STAGES);
  const [dealsData, setDealsData] = useState(() => {
    const data = { ...initialDealsData };
    INITIAL_DEAL_STAGES.forEach(stage => {
      if (!data[stage.id]) data[stage.id] = [];
    });
    return data;
  });

  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isAddingNewDeal, setIsAddingNewDeal] = useState(false);
  const [addingStage, setAddingStage] = useState<DealStage | null>(null);
  const [editingStage, setEditingStage] = useState<DealStage | null>(null);
  const [newDealColumn, setNewDealColumn] = useState<string | null>(null);
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  const [filters, setFilters] = useState<{
    merchant: string | null;
    contact: string | null;
    tag: string | null;
    search: string | null;
  }>({
    merchant: null,
    contact: null,
    tag: null,
    search: null,
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    
    if (!destination) return;

    if (type === "COLUMN") {
      if (source.index === destination.index) return;

      const newDealStages = [...dealStages];
      const [movedColumn] = newDealStages.splice(source.index, 1);
      newDealStages.splice(destination.index, 0, movedColumn);

      setDealStages(newDealStages);
      return;
    }

    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

    const newDealsData = { ...dealsData };

    if (!newDealsData[source.droppableId]) newDealsData[source.droppableId] = [];
    if (!newDealsData[destination.droppableId]) newDealsData[destination.droppableId] = [];

    if (source.droppableId === destination.droppableId) {
      const deals = [...newDealsData[source.droppableId]];
      const [movedDeal] = deals.splice(source.index, 1);
      deals.splice(destination.index, 0, movedDeal);
      newDealsData[source.droppableId] = deals;
    } else {
      const sourceDeals = [...newDealsData[source.droppableId]];
      const destDeals = [...newDealsData[destination.droppableId]];
      const [movedDeal] = sourceDeals.splice(source.index, 1);
      destDeals.splice(destination.index, 0, movedDeal);
      
      newDealsData[source.droppableId] = sourceDeals;
      newDealsData[destination.droppableId] = destDeals;
    }

    setDealsData(newDealsData);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDealsData(prev => {
      const newData = { ...prev };
      for (const stageId in newData) {
        newData[stageId] = newData[stageId].filter(deal => deal.id !== dealId);
      }
      return newData;
    });
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsAddingNewDeal(false);
  };

  const handleDeleteStage = (stageId: string) => {
    setDealStages(prev => prev.filter(stage => stage.id !== stageId));
    setDealsData(prev => {
      const newData = { ...prev };
      delete newData[stageId];
      return newData;
    });
  };

  const handleAddNewDeal = () => {
    setShowColumnSelection(true);
  };

  const handleAddNewColumn = () => {
    setAddingStage({
      id: `stage-${Date.now()}`,
      title: "Nouvelle étape",
      color: "bg-gray-500",
    });
  };

  const handleEditStage = (stage: DealStage) => {
    setEditingStage(stage);
  };

  const handleAddCardToColumn = (columnId: string) => {
    setNewDealColumn(columnId);
    setEditingDeal({
      id: `new-${Date.now()}`,
      title: "",
      amount: 0,
      tags: [],
      tagColors: [],
    });
    setIsAddingNewDeal(true);
  };

  const handleSaveStage = (newStage: DealStage) => {
    setDealStages(prev => [...prev, newStage]);
    setDealsData(prev => ({
      ...prev,
      [newStage.id]: [],
    }));
    setAddingStage(null);
  };

  const handleUpdateStage = (updatedStage: DealStage) => {
    setDealStages(prev => 
      prev.map(stage => 
        stage.id === updatedStage.id ? updatedStage : stage
      )
    );
    setEditingStage(null);
  };

  const handleSaveDeal = (updatedDeal: Deal) => {
    if (isAddingNewDeal) {
      const columnId = newDealColumn || "new";
      setDealsData(prev => ({
        ...prev,
        [columnId]: [...(prev[columnId] || []), updatedDeal]
      }));
    } else {
      setDealsData(prev => {
        const newData = { ...prev };
        for (const stage of dealStages) {
          const index = newData[stage.id]?.findIndex(d => d.id === updatedDeal.id);
          if (index !== -1 && index !== undefined) {
            newData[stage.id][index] = updatedDeal;
            break;
          }
        }
        return newData;
      });
    }
    setEditingDeal(null);
    setIsAddingNewDeal(false);
    setNewDealColumn(null);
  };

  const handleCloseEditDealSheet = (open: boolean) => {
    if (!open) {
      setEditingDeal(null);
      setIsAddingNewDeal(false);
      setNewDealColumn(null);
    }
  };

  const handleCloseAddStageSheet = (open: boolean) => {
    if (!open) {
      setAddingStage(null);
    }
  };

  const handleCloseEditStageSheet = (open: boolean) => {
    if (!open) {
      setEditingStage(null);
    }
  };

  const handleCloseColumnSelectionSheet = (open: boolean) => {
    if (!open) {
      setShowColumnSelection(false);
    }
  };

  // Récupération des merchants et contacts
  const { merchants, contacts } = useMemo(() => {
    const allDeals = Object.values(dealsData).flat();
    const merchantsMap = new Map<string, Merchant>();
    const contactsMap = new Map<string, Contact>();

    // Ajouter tous les contacts de merchantsData
    merchantsData.forEach(merchant => {
      merchant.contacts.forEach(contact => {
        if (!contactsMap.has(contact.id)) {
          contactsMap.set(contact.id, contact);
        }
      });
    });

    allDeals.forEach(deal => {
      if (deal.merchantId && !merchantsMap.has(deal.merchantId)) {
        const merchant = merchantsData.find(m => m.id === deal.merchantId);
        if (merchant) merchantsMap.set(merchant.id, merchant);
      }
      if (deal.contactId && !contactsMap.has(deal.contactId)) {
        // Trouver le contact dans merchantsData
        let contact: Contact | undefined;
        for (const merchant of merchantsData) {
          contact = merchant.contacts.find(c => c.id === deal.contactId);
          if (contact) break;
        }
        if (contact) contactsMap.set(contact.id, contact);
      }
    });

    return {
      merchants: Array.from(merchantsMap.values()),
      contacts: Array.from(contactsMap.values()),
    };
  }, [dealsData]);

  // Fonction de filtrage améliorée
  const filterDeals = (deals: Deal[]) => {
    if (!deals) return [];
    
    return deals.filter(deal => {
      // Filtre par marchand
      if (filters.merchant && deal.merchantId !== filters.merchant) return false;
      
      // Filtre par contact
      if (filters.contact) {
        // Si le deal a un contactId direct
        if (deal.contactId === filters.contact) return true;
        
        // Si le deal n'a pas de contactId mais a un merchantId,
        // vérifier si le contact fait partie des contacts du merchant
        if (deal.merchantId) {
          const merchant = merchantsData.find(m => m.id === deal.merchantId);
          if (merchant && merchant.contacts.some(c => c.id === filters.contact)) {
            return true;
          }
        }
        
        return false;
      }
      
      // Filtre par tag - CORRECTION ICI
      if (filters.tag) {
        if (!deal.tags || !deal.tags.length) return false;
        return deal.tags.includes(filters.tag);
      }
      
      // Filtre par recherche
      if (filters.search && !deal.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };
  return (
    <div className="flex flex-col h-full bg-white">
      <HeaderCRM
        onAddClick={handleAddNewDeal}
        onAddColumn={handleAddNewColumn}
        merchants={merchants}
        contacts={contacts}
        deals={Object.values(dealsData).flat()}
        onFilterChange={(filterType, value) => {
          setFilters(prev => ({ ...prev, [filterType]: value }));
        }}
        onSearch={(searchTerm) => {
          setFilters(prev => ({ ...prev, search: searchTerm }));
        }}
      />

      <div className="flex-1 overflow-hidden">
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
                          style={{ width: '300px', height: '100%' }}
                        >
                          <DealStageColumn
                            stage={stage}
                            deals={filterDeals(dealsData[stage.id] || [])}
                            onEditDeal={handleEditDeal}
                            onDelete={handleDeleteDeal}
                            onEditStage={handleEditStage}
                            onDeleteStage={handleDeleteStage}
                            onAddCard={handleAddCardToColumn}
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

        <EditDealSheet
          deal={editingDeal}
          onSave={handleSaveDeal}
          onOpenChange={handleCloseEditDealSheet}
          isAddingNew={isAddingNewDeal}
        />

        <AddStageSheet
          stage={addingStage}
          onSave={handleSaveStage}
          onOpenChange={handleCloseAddStageSheet}
        />

        <EditStageSheet
          stage={editingStage}
          onSave={handleUpdateStage}
          onOpenChange={handleCloseEditStageSheet}
        />

        <SelectColumnSheet
          open={showColumnSelection}
          onOpenChange={handleCloseColumnSelectionSheet}
          columns={dealStages}
          onSelect={(columnId) => {
            setNewDealColumn(columnId);
            setEditingDeal({
              id: `new-${Date.now()}`,
              title: "",
              amount: 0,
              tags: [],
              tagColors: [],
            });
            setIsAddingNewDeal(true);
          }}
        />
      </div>
    </div>
  );
}