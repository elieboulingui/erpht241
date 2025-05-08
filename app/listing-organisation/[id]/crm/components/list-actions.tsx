"use client"

import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ListActionsProps {
  onClose: () => void
}

export function ListActions({ onClose }: ListActionsProps) {
  const [expandColors, setExpandColors] = useState(false)
  const [expandAutomation, setExpandAutomation] = useState(false)

  const colors = [
    "bg-green-600",
    "bg-yellow-600",
    "bg-orange-600",
    "bg-red-600",
    "bg-purple-600",
    "bg-blue-600",
    "bg-teal-600",
    "bg-lime-600",
    "bg-pink-600",
    "bg-gray-500",
  ]

  return (
    <div className="p-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Liste des actions</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="flex flex-col">
        <Button variant="ghost" className="justify-start text-left text-gray-300 hover:bg-gray-700">
          Ajouter une carte
        </Button>
        <Button variant="ghost" className="justify-start text-left text-gray-300 hover:bg-gray-700">
          Copier la liste
        </Button>
        <Button variant="ghost" className="justify-start text-left text-gray-300 hover:bg-gray-700">
          Déplacer la liste
        </Button>
        <Button variant="ghost" className="justify-start text-left text-gray-300 hover:bg-gray-700">
          Suivre
        </Button>

        <div className="my-2 h-px bg-gray-700"></div>

        <button
          className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700"
          onClick={() => setExpandColors(!expandColors)}
        >
          <div className="flex items-center">
            <span>Modifier la couleur des listes</span>
            <span className="ml-2 rounded-sm bg-gray-600 px-1 py-0.5 text-xs">PREMIUM</span>
          </div>
          <ChevronDown size={16} className={`transition-transform ${expandColors ? "rotate-180" : ""}`} />
        </button>

        {expandColors && (
          <div className="mt-2">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color, index) => (
                <div key={index} className={`h-8 w-full rounded-sm ${color} cursor-pointer`}></div>
              ))}
            </div>
            <Button variant="ghost" className="mt-2 w-full justify-center text-gray-400 hover:bg-gray-700">
              <X size={16} className="mr-2" />
              Supprimer la couleur
            </Button>
          </div>
        )}

        <div className="my-2 h-px bg-gray-700"></div>

        <button
          className="flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700"
          onClick={() => setExpandAutomation(!expandAutomation)}
        >
          <span>Automatisation</span>
          <ChevronDown size={16} className={`transition-transform ${expandAutomation ? "rotate-180" : ""}`} />
        </button>

        {expandAutomation && (
          <div className="mt-2 flex flex-col gap-1 pl-2">
            <Button variant="ghost" className="justify-start text-left text-sm text-gray-300 hover:bg-gray-700">
              Lorsqu'une carte est ajoutée à la liste...
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm text-gray-300 hover:bg-gray-700">
              Tous les jours, trier la liste par...
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm text-gray-300 hover:bg-gray-700">
              Tous les lundis, trier la liste par...
            </Button>
            <Button variant="ghost" className="justify-start text-left text-sm text-gray-300 hover:bg-gray-700">
              Créer une règle
            </Button>
          </div>
        )}

        <div className="my-2 h-px bg-gray-700"></div>

        <Button variant="ghost" className="justify-start text-left text-gray-300 hover:bg-gray-700">
          Archiver cette liste
        </Button>
      </div>
    </div>
  )
}
