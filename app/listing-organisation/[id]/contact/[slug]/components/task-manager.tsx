"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Task, TaskStatus, TaskType, TaskPriority } from "@/types/task"
import TaskTable from "./task-table"
import TaskKanban from "./task-kanban"
import { TaskForm } from "./TaskForm"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutGrid,
  List,
  PenIcon,
  Plus,
  Sparkles,
  Circle,
  ArrowUpDown,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("manual")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null)
  const [typeFilter, setTypeFilter] = useState<TaskType[]>([])

  useEffect(() => {
    const url = window.location.pathname
    const regex = /\/listing-organisation\/([a-zA-Z0-9-]+)/

    const match = url.match(regex)
    if (match && match[1]) {
      const organisationId = match[1]

      const fetchTasks = async () => {
        const res = await fetch(`/api/task?organisationId=${organisationId}`)
        const data = await res.json()

        if (res.ok) {
          setTasks(data)
        } else {
          toast.error(data.error || "Erreur lors de la récupération des tâches")
        }
      }

      fetchTasks()
    } else {
      toast.error("ID d'organisation introuvable dans l'URL")
    }
  }, [refreshTrigger])

  const filteredTasks = tasks.filter((task) => {
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

  const handleCreateTask = (newTask: Omit<Task, "id" | "favorite">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      favorite: false,
    }

    setTasks([...tasks, taskWithId])
    setIsDialogOpen(false)
    toast.success("Tâche créée avec succès")
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleManualClick = () => {
    setCreationMode("manual")
    setIsDialogOpen(true)
    setIsDropdownOpen(false)
  }

  const handleAIClick = () => {
    setCreationMode("ai")
    setIsDialogOpen(true)
    setIsDropdownOpen(false)
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleSelectTask = (taskId: string, isSelected: boolean) => {
    setSelectedTasks(isSelected ? [...selectedTasks, taskId] : selectedTasks.filter((id) => id !== taskId))
  }

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedTasks(isSelected ? tasks.map((task) => task.id) : [])
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
  }

  const handleToggleFavorite = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, favorite: !task.favorite } : task)))
  }

  const handleDeleteSelected = (taskIds: string[]) => {
    setTasks((prev) => prev.filter((task) => !taskIds.includes(task.id)))
    setSelectedTasks([])
    toast.success(`${taskIds.length} tâche(s) supprimée(s)`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold">
              <Plus className="h-4 w-4 mr-1" /> Ajouter une tâche
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[178px]">
            <DropdownMenuItem onClick={handleManualClick}>
              <PenIcon className="h-4 w-4 mr-2" />
              Manuellement
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAIClick}>
              <Sparkles className="h-4 w-4 mr-2" />
              Via IA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog pour création tâche */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {creationMode === "manual"
                  ? "Créer une tâche manuellement"
                  : "Créer une tâche avec l'IA"}
              </DialogTitle>
              <DialogDescription>
                {creationMode === "manual"
                  ? "Remplissez le formulaire pour ajouter une tâche."
                  : "Décrivez la tâche, l'IA vous proposera une création automatique."}
              </DialogDescription>
            </DialogHeader>

            {creationMode === "manual" ? (
              <TaskForm
                onSubmit={handleCreateTask}
                onTaskCreated={handleTaskCreated}
              />
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Décrivez la tâche à générer..."
                  onChange={() => {}}
                />
                <Button
                  onClick={() => {
                    toast.message("Fonctionnalité IA à venir", {
                      description: "L'IA générera bientôt la tâche automatiquement.",
                    })
                    setIsDialogOpen(false)
                  }}
                  className="bg-[#7f1d1c] text-white hover:bg-[#7f1d1c]/80"
                >
                  Générer la tâche
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Rechercher des tâches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm pl-10 bg-[#e6e7eb]"
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

          {/* Filtres */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-[#e6e7eb]">
                  <Circle className="h-4 w-4" />
                  Statut
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={statusFilter || ""}
                  onValueChange={(val) => setStatusFilter(val ? (val as TaskStatus) : null)}
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
                <Button variant="outline" className="flex items-center gap-2 bg-[#e6e7eb]">
                  <ArrowUpDown className="h-4 w-4" />
                  Priorité
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={priorityFilter || ""}
                  onValueChange={(val) => setPriorityFilter(val ? (val as TaskPriority) : null)}
                >
                  <DropdownMenuRadioItem value="">Toutes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Faible">Faible</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Moyenne">Moyenne</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Élevée">Élevée</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 bg-[#e6e7eb]">
                  <SlidersHorizontal className="h-4 w-4" />
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {["Bug", "Fonctionnalité", "Documentation"].map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={typeFilter.includes(type as TaskType)}
                    onCheckedChange={(checked) => {
                      setTypeFilter((prev) =>
                        checked ? [...prev, type as TaskType] : prev.filter((t) => t !== type)
                      )
                    }}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "kanban")}>
          <TabsList>
            <TabsTrigger value="list">
              <List className="w-4 h-4 mr-2" /> Vue Liste
            </TabsTrigger>
            <TabsTrigger value="kanban">
              <LayoutGrid className="w-4 h-4 mr-2" /> Vue Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" ? (
        <TaskTable
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onSelectAll={handleSelectAll}
          onEditTask={handleEditTask}
          onToggleFavorite={handleToggleFavorite}
          onDeleteTask={handleDeleteTask}
          onDeleteSelected={handleDeleteSelected}
          refreshTrigger={refreshTrigger}
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
          onStatusChange={handleStatusChange as any}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onEditTask={handleEditTask}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  )
}
