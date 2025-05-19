"use client"

import { Draggable } from "@hello-pangea/dnd"
import { format } from "date-fns"
import { FaRegTrashAlt } from "react-icons/fa"

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

export function KanbanCard({ card, index, onClick, onDelete }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex flex-col rounded-lg bg-white p-3 text-black shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 ${
            snapshot.isDragging ? "ring-2 ring-blue-500 shadow-lg" : ""
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium text-gray-900 truncate"
                onClick={onClick}
              >
                {card.title}
              </h3>
              
              <div className="mt-2 space-y-1 text-sm">
                {card.amount && (
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium">Amount:</span>
                    <span className="ml-2 font-semibold text-blue-600">
                      {card.amount.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                
                {card.deadline && (
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium">Due:</span>
                    <span className={`ml-2 font-medium ${
                      new Date(card.deadline) < new Date() 
                        ? "text-red-500" 
                        : "text-gray-700"
                    }`}>
                      {format(new Date(card.deadline), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
                
                {card.tags && card.tags.length > 0 && (
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium">Tags:</span>
                    <div className="ml-2 flex flex-wrap gap-1">
                      {card.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                
                {card.merchantId && (
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium">Merchant:</span>
                    <span className="ml-2 text-gray-700 truncate max-w-[120px]">
                      {card.merchantId}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Delete card"
            >
              <FaRegTrashAlt size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}