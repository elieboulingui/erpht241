"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TaskStatus, TaskPriority } from "@/types/task"
import { Circle, ArrowUpDown, X, Plus } from "lucide-react"

interface TaskFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: TaskStatus | null
  setStatusFilter: (status: TaskStatus | null) => void
  priorityFilter: TaskPriority | null
  setPriorityFilter: (priority: TaskPriority | null) => void
}

export default function TaskFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: TaskFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
      <div className="flex justify-between gap-2">
      <div className="relative flex-grow">
        <Input
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-md pl-10"
          placeholder="Rechercher une tâche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        {searchQuery && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            onClick={() => setSearchQuery("")}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        <PriorityFilter value={priorityFilter} onChange={setPriorityFilter} />
      </div>

      </div>

      <Button className="bg-black text-white hover:bg-gray-800 ml-auto">
        <Plus size={16} className="mr-2" />
        Ajouter une tâche
      </Button>
    </div>
  )
}

interface StatusFilterProps {
  value: TaskStatus | null
  onChange: (value: TaskStatus | null) => void
}

function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-black text-white hover:text-white/85 border-none hover:bg-black px-4 py-2 rounded-md"
        >
          <Circle className="h-4 w-4" />
          Statut
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuRadioGroup value={value || ""} onValueChange={(val) => onChange(val ? (val as TaskStatus) : null)}>
          <DropdownMenuRadioItem value="">Tous</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="À faire">À faire</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="En cours">En cours</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Terminé">Terminé</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="En attente">En attente</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Annulé">Annulé</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface PriorityFilterProps {
  value: TaskPriority | null
  onChange: (value: TaskPriority | null) => void
}

function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-black text-white hover:text-white/85 border-none hover:bg-black px-4 py-2 rounded-md"
        >
          <ArrowUpDown className="h-4 w-4" />
          Priorité
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuRadioGroup
          value={value || ""}
          onValueChange={(val) => onChange(val ? (val as TaskPriority) : null)}
        >
          <DropdownMenuRadioItem value="">Toutes</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Faible">Faible</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Moyenne">Moyenne</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Élevée">Élevée</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

