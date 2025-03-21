"use client"

import { useState } from "react"
import type { Task, TaskStatus } from "@/types/task"
import { Filter } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import TaskRow from "./task-row"

interface TaskTableProps {
  tasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  selectedTasks: string[]
  onSelectTask: (taskId: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onToggleFavorite: (taskId: string) => void
}

type SortField = "id" | "title" | "status" | "priority"
type SortDirection = "asc" | "desc"

export default function TaskTable({
  tasks,
  onStatusChange,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onEditTask,
  onToggleFavorite,
}: TaskTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    return (
      <button className="ml-1 text-gray-400 hover:text-gray-700">
        <Filter size={14} />
      </button>
    )
  }

  // Sort tasks if needed
  const sortedTasks = [...tasks]
  if (sortField) {
    sortedTasks.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  return (
    <div className="border border-gray-200 rounded-md bg-white">
      <table className="w-full border-collapse text-gray-900">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 items-center">
            <th className="p-3 text-left w-10">
              <Checkbox
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </th>
            <th className="p-3 text-left mt-0.5 font-medium text-sm flex items-center">
              ID Tâche
              {getSortIcon("id")}
            </th>
            <th className="p-3 text-left font-medium text-sm cursor-pointer" onClick={() => toggleSort("title")}>
              <div className="flex items-center">
                Titre
                {getSortIcon("title")}
              </div>
            </th>
            <th className="p-3 text-left font-medium text-sm cursor-pointer" onClick={() => toggleSort("status")}>
              <div className="flex items-center">
                Statut
                {getSortIcon("status")}
              </div>
            </th>
            <th className="p-3 text-left font-medium text-sm cursor-pointer" onClick={() => toggleSort("priority")}>
              <div className="flex items-center">
                Priorité
                {getSortIcon("priority")}
              </div>
            </th>
            <th className="p-3 text-left w-10">
              <button className="text-gray-400 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Aucune tâche trouvée
              </td>
            </tr>
          ) : (
            sortedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isSelected={selectedTasks.includes(task.id)}
                onSelect={(isSelected) => onSelectTask(task.id, isSelected)}
                onStatusChange={onStatusChange}
                onEditTask={onEditTask}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

