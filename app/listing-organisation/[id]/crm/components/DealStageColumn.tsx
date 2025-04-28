// DealStageColumn.tsx
import { Droppable } from "@hello-pangea/dnd";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { DealCard } from "./DealCard";
import { DealStage, Deal } from "./types";

interface DealStageColumnProps {
  stage: DealStage;
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onEditStage: (stage: DealStage) => void;
  onAddCard: (columnId: string) => void;
  dragHandleProps?: any;
}

export function DealStageColumn({
  stage,
  deals = [],
  onEditDeal,
  onEditStage,
  onAddCard,
  dragHandleProps
}: DealStageColumnProps) {
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="flex flex-col gap-3 h-full w-[300px] min-w-[300px] py-6">
      <div className="flex justify-between items-center" {...dragHandleProps}>
        <button 
          onClick={() => onEditStage(stage)}
          className="text-sm font-semibold flex items-center "
        >
          <span className={`w-2 h-2 rounded-full ${stage.color} mr-2`} />
          {stage.title}
        </button>
        <button
          className="text-gray-400 hover:text-gray-800"
          onClick={() => onAddCard(stage.id)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
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
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}