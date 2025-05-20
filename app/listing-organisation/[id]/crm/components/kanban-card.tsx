"use client"

import { Draggable } from "@hello-pangea/dnd"
import { format } from "date-fns"
import { FaRegTrashAlt } from "react-icons/fa"
import clsx from "clsx"

interface CardProps {
  card: {
    id: string
    title: string
    amount?: number
    deadline?: string
    tags?: string[]
    contactId?: string | null
    merchantId?: string | null
  }
  index: number
  onClick: () => void
  onDelete: () => void
}

const tagColors = [
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
]

export function KanbanCard({ card, index, onClick, onDelete }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx(
            "group relative flex flex-col rounded-2xl border border-transparent p-5 bg-white shadow-sm hover:shadow-xl hover:scale-[1.015] transition-all duration-300",
            snapshot.isDragging && "shadow-lg scale-105 ring-2 ring-indigo-200"
          )}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-red-100 transition"
            aria-label="Delete card"
          >
            <FaRegTrashAlt size={14} className="text-gray-400 group-hover:text-red-500 transition" />
          </button>

          {/* Title */}
          <h3
            onClick={onClick}
            className="text-lg font-semibold text-gray-800 hover:underline cursor-pointer truncate"
          >
            {card.title}
          </h3>

          <div className="mt-4 space-y-3 text-sm text-gray-700">
            {/* Amount */}
            {card.amount !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Montant</span>
                <span className="font-bold">
                  {card.amount.toLocaleString()} FCFA
                </span>
              </div>
            )}

            {/* Deadline */}
            {card.deadline && (
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Échéance</span>
                <span
                  className={clsx(
                    "font-medium",
                    new Date(card.deadline) < new Date()
                      ? "text-red-500"
                      : "text-green-600"
                  )}
                >
                  {format(new Date(card.deadline), "dd MMM yyyy")}
                </span>
              </div>
            )}

            {/* Merchant */}
            {card.merchantId && (
              <div className="flex justify-between">
                <div className="truncate max-w-[160px] text-gray-800">
                  {card.merchantId}
                </div>
              </div>
            )}

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {card.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors[i % tagColors.length]} shadow-sm`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
