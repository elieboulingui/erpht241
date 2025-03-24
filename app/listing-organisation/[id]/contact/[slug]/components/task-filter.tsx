"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskStatus, TaskPriority } from "@/types/task";
import { Circle, ArrowUpDown, X, Plus, Search } from "lucide-react";

interface TaskFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: TaskStatus | null;
  setStatusFilter: (status: TaskStatus | null) => void;
  priorityFilter: TaskPriority | null;
  setPriorityFilter: (priority: TaskPriority | null) => void;
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
            className=" bg-[#e6e7eb] border border-gray-300 rounded-md pl-10"
            placeholder="Rechercher une tâche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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

      <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold  ml-auto">
        <Plus size={16} className="" />
        Ajouter une tâche
      </Button>
    </div>
  );
}

interface StatusFilterProps {
  value: TaskStatus | null;
  onChange: (value: TaskStatus | null) => void;
}

function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-[#e6e7eb] text-black  border-none  px-4 py-2 rounded-md"
        >
          <Circle className="h-4 w-4" />
          Statut
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuRadioGroup
          value={value || ""}
          onValueChange={(val) => onChange(val ? (val as TaskStatus) : null)}
        >
          <DropdownMenuRadioItem value="">Tous</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="À faire">À faire</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="En cours">
            En cours
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Terminé">Terminé</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="En attente">
            En attente
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Annulé">Annulé</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface PriorityFilterProps {
  value: TaskPriority | null;
  onChange: (value: TaskPriority | null) => void;
}

function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-[#e6e7eb] text-black border-none  px-4 py-2 rounded-md"
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
  );
}
