"use client"

import { Draggable } from "@hello-pangea/dnd"
import { FaRegTrashAlt } from "react-icons/fa"

interface CardProps {
  card: {
    id: string
    title: string
  }
  index: number
  onClick: () => void
  onDelete: () => void
}

export function KanbanCard({ card, index, onClick, onDelete }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
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
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" onClick={onClick}>
            <p>{card.title}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="flex items-center gap-2 p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Supprimer"
          >
            <FaRegTrashAlt size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      )}
    </Draggable>
  )
}
