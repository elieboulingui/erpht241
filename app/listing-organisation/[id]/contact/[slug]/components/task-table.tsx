"use client"

import { useState, useRef } from "react"
import type { Task, TaskStatus, TaskType, TaskPriority } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, SlidersHorizontal, Star, Circle, ArrowUpDown, X, Search } from "lucide-react"
import PaginationGlobal from "@/components/paginationGlobal"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import TaskRow from "./task-row"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

type SortField = keyof Pick<Task, "id" | "title" | "description" | "type" | "status" | "priority">
type SortDirection = "asc" | "desc"

interface TaskTableProps {
  tasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  selectedTasks: string[]
  onSelectTask: (taskId: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onToggleFavorite: (taskId: string) => void
}

const statusColors: Record<TaskStatus, string> = {
  "À faire": "bg-gray-100 text-gray-800",
  "En cours": "bg-blue-100 text-blue-800",
  "Terminé": "bg-green-100 text-green-800",
  "En attente": "bg-yellow-100 text-yellow-800",
  "Annulé": "bg-red-100 text-red-800",
}

const priorityColors: Record<TaskPriority, string> = {
  "Faible": "bg-gray-100 text-gray-800",
  "Moyenne": "bg-yellow-100 text-yellow-800",
  "Élevée": "bg-red-100 text-red-800",
}

const typeColors: Record<TaskType, string> = {
  "Bug": "bg-red-100 text-red-800",
  "Fonctionnalité": "bg-blue-100 text-blue-800",
  "Documentation": "bg-purple-100 text-purple-800",
}

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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null)
  const [typeFilter, setTypeFilter] = useState<TaskType[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 ml-1"
      onClick={(e) => {
        e.stopPropagation()
        toggleSort(field)
      }}
    >
      <Filter className="h-3 w-3 text-gray-500" />
    </Button>
  )

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm 
      ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    const matchesStatus = statusFilter ? task.status === statusFilter : true
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true
    const matchesType = typeFilter.length > 0 ? typeFilter.includes(task.type) : true
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  if (sortField) {
    filteredTasks.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      return sortDirection === "asc" 
        ? String(aValue).localeCompare(String(bValue)) 
        : String(bValue).localeCompare(String(aValue))
    })
  }

  const totalItems = filteredTasks.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems)
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

  return (
    <div className="relative">
      <div className="flex items-center py-4 gap-2">
        <div className="relative flex-grow">
          <Input
            ref={searchInputRef}
            placeholder="Rechercher des tâches..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="max-w-sm pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-black"
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Circle className="h-4 w-4" />
                Statut
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuRadioGroup
                value={statusFilter || ""}
                onValueChange={(val) => {
                  setStatusFilter(val ? (val as TaskStatus) : null)
                  setCurrentPage(1)
                }}
              >
                <DropdownMenuRadioItem value="">Tous</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="À faire">À faire</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="En cours">En cours</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Terminé">Terminé</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="En attente">En attente</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Annulé">Annulé</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Priorité
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuRadioGroup
                value={priorityFilter || ""}
                onValueChange={(val) => {
                  setPriorityFilter(val ? (val as TaskPriority) : null)
                  setCurrentPage(1)
                }}
              >
                <DropdownMenuRadioItem value="">Toutes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Faible">Faible</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Moyenne">Moyenne</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Élevée">Élevée</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtre pour le type (conservé comme avant) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {Object.keys(typeColors).map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={typeFilter.includes(type as TaskType)}
                  onCheckedChange={(checked) => {
                    setTypeFilter(prev =>
                      checked
                        ? [...prev, type as TaskType]
                        : prev.filter(t => t !== type)
                    )
                    setCurrentPage(1)
                  }}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsContent value="tasks" className="p-0">
          <div className="border rounded-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={paginatedTasks.length > 0 && paginatedTasks.every(task => selectedTasks.includes(task.id))}
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                    />
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      ID Tâche
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Titre
                      {getSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Assigné à</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Aucune tâche trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />
    </div>
  )
}