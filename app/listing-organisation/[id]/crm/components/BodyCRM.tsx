"use client";

import { useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Deal, DealStage, INITIAL_DEAL_STAGES, initialDealsData } from "./types";
import { HeaderCRM } from "./HeaderCRM";
import { DealStageColumn } from "./DealStageColumn";
import { EditDealSheet } from "./EditDealSheet";
import { AddStageSheet } from "./AddStageSheet";
import { SelectColumnSheet } from "./SelectColumnSheet";
import { EditStageSheet } from "./EditStageSheet";

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

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsAddingNewDeal(false);
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
      title: "Nouveau deal",
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

  return (
    <div className="flex flex-col h-full bg-white">
      <HeaderCRM
        onAddClick={handleAddNewDeal}
        onAddColumn={handleAddNewColumn}
      />

      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="COLUMN"
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex px-6 pb-6 flex-1 w-full overflow-x-auto"
              >
                <div className="flex gap-4 h-full min-h-full">
                  {dealStages.map((stage, index) => (
                    <Draggable
                      key={stage.id}
                      draggableId={stage.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex-shrink-0"
                          style={{
                            ...provided.draggableProps.style,
                            width: '300px',
                            height: '100%',
                          }}
                        >
                          <DealStageColumn
                            stage={stage}
                            deals={dealsData[stage.id] || []}
                            onEditDeal={handleEditDeal}
                            onEditStage={handleEditStage}
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
              title: "Nouveau deal",
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