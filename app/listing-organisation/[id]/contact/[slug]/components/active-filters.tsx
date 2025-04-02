"use client"

import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ActiveFiltersProps {
  activeFilters: string[]
  removeFilter: (filter: string) => void
  clearAllFilters: () => void
}

export default function ActiveFilters({ activeFilters, removeFilter, clearAllFilters }: ActiveFiltersProps) {
  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center animate-fade-in">
      <span className="text-sm text-gray-500 flex items-center">
        <SlidersHorizontal className="h-3 w-3 mr-1" /> Filtres actifs:
      </span>
      {activeFilters.map((filter) => {
        const [type, value] = filter.split(":")
        return (
          <Badge
            key={filter}
            variant="outline"
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="text-xs">
              {type === "taxes"
                ? "Taxes: "
                : type === "statut"
                  ? "Statut: "
                  : type === "id"
                    ? "ID: "
                    : type === "date"
                      ? "Date: "
                      : ""}
              {type === "date"
                ? `${new Date(value.split("-")[0]).toLocaleDateString()}${
                    value.includes("-") ? ` - ${new Date(value.split("-")[1]).toLocaleDateString()}` : ""
                  }`
                : value}
            </span>
            <button
              onClick={() => removeFilter(filter)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )
      })}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        onClick={clearAllFilters}
      >
        Effacer tout
      </Button>
    </div>
  )
}

