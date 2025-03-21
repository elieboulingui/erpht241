"use client"

import { useState, useRef } from "react"
import type { Task, TaskStatus } from "@/types/task"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Circle,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Star,
  Edit,
  Copy,
  Tag,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import TaskTypeTag from "./task-type-tag"

interface TaskRowProps {
  task: Task
  isSelected: boolean
  onSelect: (isSelected: boolean) => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onToggleFavorite: (taskId: string) => void
}

export default function TaskRow({
  task,
  isSelected,
  onSelect,
  onStatusChange,
  onEditTask,
  onToggleFavorite,
}: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const getStatusIcon = () => {
    switch (task.status) {
      case "À faire":
        return <Circle className="h-4 w-4 text-gray-400" />
      case "En cours":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "Terminé":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "En attente":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "Annulé":
        return <X className="h-4 w-4 text-red-400" />
    }
  }

  const getPriorityIcon = () => {
    switch (task.priority) {
      case "Faible":
        return <ArrowDown className="h-4 w-4 text-gray-400" />
      case "Moyenne":
        return <ArrowDown className="h-4 w-4 text-yellow-400" />
      case "Élevée":
        return <ArrowUp className="h-4 w-4 text-red-400" />
    }
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="p-3">
        <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(!!checked)} />
      </td>
      <td className="p-3 font-mono text-sm text-gray-500">{task.id}</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <TaskTypeTag type={task.type} />
          <span className="truncate max-w-[400px] text-gray-900">{task.title}</span>
          {task.favorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-gray-700">{task.status}</span>
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {getPriorityIcon()}
          <span className="text-gray-700">{task.priority}</span>
        </div>
      </td>
      <td className="p-3 relative">
        <DropdownMenu onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <MoreHorizontal className="h-5 w-5 text-gray-400 hover:text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-gray-900 border-gray-200 w-48 shadow-lg">
            <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">
              <Edit className="mr-2 h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">
              <Copy className="mr-2 h-4 w-4" />
              <span>Faire une copie</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-gray-100" onClick={() => onToggleFavorite(task.id)}>
              <Star className={`mr-2 h-4 w-4 ${task.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
              <span>Favoris</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer focus:bg-gray-100">
                <Tag className="mr-2 h-4 w-4" />
                <span>Étiquettes</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-white text-gray-900 border-gray-200 shadow-lg">
                  <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">Projet</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">Sprint</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">Urgent</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-gray-100 text-red-600"
              onClick={() => onStatusChange(task.id, "Annulé")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Supprimer</span>
              <span className="ml-auto text-xs text-gray-500">⌘⌫</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

