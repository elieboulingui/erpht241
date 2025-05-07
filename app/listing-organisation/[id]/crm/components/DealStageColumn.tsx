"use client";

import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DealCard } from "./DealCard";
import { deleteDealStage } from "../action/deleteDealStage";
import { Deal, DealStage } from "./types";

interface DealStageColumnProps {
  stage: DealStage;
  onEditDeal: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  onEditStage: (stage: DealStage) => void;
  onDeleteStage: (stageId: string) => void;
  onAddCard: (columnId: string) => void;
  dragHandleProps?: any;
}



export function DealStageColumn({
  stage,
  onEditDeal,
  onDelete,
  onEditStage,
  onDeleteStage,
  onAddCard,
  dragHandleProps,
}: DealStageColumnProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/);
    if (!match) {
      console.error("Organisation ID not found in URL");
      setIsLoading(false);
      return;
    }

    const organisationId = match[1];

    const fetchDeals = async () => {
      try {
        const res = await fetch(`/api/deal-stages?organisationId=${organisationId}`);
        if (!res.ok) throw new Error("Failed to fetch deal stages");

        const stages: DealStage[] = await res.json();
        const currentStage = stages.find((s) => s.id === stage.id);
        setDeals(currentStage?.opportunities || []);
      } catch (e) {
        console.error("Error fetching deal stages", e);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDeals();
    }, 500);

    return () => clearTimeout(timer);
  }, [stage.id]);

  const handleConfirmDelete = async () => {
    try {
      await deleteDealStage(stage.id);
      onDeleteStage(stage.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  };

  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const progressValue =
    deals.length > 0 ? Math.min(100, Math.max(0, (deals.length / 10) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4 h-full w-[300px] min-w-[300px] py-6">
      {/* Header */}
      <div className="flex justify-between items-center max-w-[280px] px-4" {...dragHandleProps}>
        <button
          onClick={() => onEditStage(stage)}
          className="text-sm font-semibold flex items-center"
        >
          <span className={`w-2 h-2 rounded-full ${stage.color} mr-2`} />
          {stage.label}
        </button>

        <div className="flex items-center space-x-2">
          <button className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4" />
          </button>
          <button
            className="text-gray-400 hover:text-gray-800"
            onClick={() => onAddCard(stage.id)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la colonne</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la colonne "{stage.label}" et toutes ses
              opportunités ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress + Amount */}
      <div className="flex justify-between items-center max-w-[280px] px-4">
        <div className="flex-1">
          <Progress value={progressValue} className={`h-2 ${stage.color}`} />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {totalAmount.toLocaleString()} FCFA
        </span>
      </div>

      {/* Deal Cards */}
      <Droppable droppableId={stage.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 overflow-y-auto flex-1 pb-4"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            {!isLoading &&
              deals.map((deal, index) => (
                <DealCard
                  key={deal.id}
                  id={deal.id}
                  label={deal.label}
                  amount={deal.amount}
                  index={index}
                  onEdit={onEditDeal}
                  onDelete={onDelete}
                  tags={deal.tags || []}
                  tagColors={deal.tagColors || []}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
