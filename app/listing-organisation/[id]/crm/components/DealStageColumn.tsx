"use client"

import { Droppable } from "@hello-pangea/dnd";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash } from "lucide-react";
import { DealCard } from "./DealCard";
import { DealStage, Deal } from "./types";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface DealStageColumnProps {
  stage: DealStage;
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  onEditStage: (stage: DealStage) => void;
  onDeleteStage: (stageId: string) => void; // Nouvelle prop
  onAddCard: (columnId: string) => void;
  dragHandleProps?: any;
}

export function DealStageColumn({
  stage,
  deals = [],
  onEditDeal,
  onDelete,
  onEditStage,
  onDeleteStage, // Nouvelle prop
  onAddCard,
  dragHandleProps
}: DealStageColumnProps) {
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDeleteStage(stage.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 h-full w-[300px] min-w-[300px] py-6">
      <div className="flex max-w-[280px] justify-between items-center" {...dragHandleProps}>
        <button
          onClick={() => onEditStage(stage)}
          className="text-sm font-semibold flex items-center "
        >
          <span className={`w-2 h-2 rounded-full ${stage.color} mr-2`} />
          {stage.title}
        </button>

        <div className="items-center">

        <button
            className=" mr-2"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" color="#7f1d1c" />
          </button>

          <button
            className="text-gray-400 hover:text-gray-800 "
            onClick={() => onAddCard(stage.id)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

      </div>


      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la colonne</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la colonne "{stage.title}" et toutes ses opportunités ? 
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white" 
              onClick={handleConfirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center max-w-[280px] gap-3">
        <div className="flex-1">
          <Progress
            value={Math.min(100, Math.max(0, (deals.length / 10) * 100))}
            className={`h-2 ${stage.color}`}
          />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {totalAmount.toLocaleString()} FCFA
        </span>
      </div>

      <Droppable droppableId={stage.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 overflow-y-auto flex-1 pb-4"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            {deals.map((deal, index) => (
              <DealCard
                key={deal.id}
                {...deal}
                index={index}
                onEdit={onEditDeal}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}