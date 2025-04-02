"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Task, TaskStatus } from "@/types/task"
import TaskTable from "./task-table"
import TaskKanban from "./task-kanban"
import { TaskForm } from "./TaskForm"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List, PenIcon, Plus, Sparkles } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Corriger le bug de connexion",
      type: "Bug",
      status: "À faire",
      priority: "Élevée",
      favorite: false,
      description: "Les utilisateurs ne peuvent pas se connecter après la mise à jour",
      assignee: "Jean Dupont"
    },
    {
      id: "task-2",
      title: "Ajouter la page de contact",
      type: "Fonctionnalité",
      status: "En cours",
      priority: "Moyenne",
      favorite: true,
      assignee: "Marie Martin"
    }
  ])
  
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("manual")

  const handleCreateTask = (newTask: Omit<Task, "id" | "favorite">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      favorite: false
    }
    
    setTasks([...tasks, taskWithId])
    setIsDialogOpen(false)
    toast.success("Tâche créée avec succès")
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
    toast.message("Création via IA", {
      description: "La fonctionnalité de création via IA sera bientôt disponible"
    })
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const handleSelectTask = (taskId: string, isSelected: boolean) => {
    setSelectedTasks(isSelected 
      ? [...selectedTasks, taskId] 
      : selectedTasks.filter(id => id !== taskId)
    )
  }

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedTasks(isSelected ? tasks.map(task => task.id) : [])
  }

  const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ))
  }

  const handleToggleFavorite = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, favorite: !task.favorite } : task
    ))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Tâches</h1>
        
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold">
              <Plus className="h-4 w-4 mr-1" /> Ajouter une tâche
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[178px]">
            <DropdownMenuItem onClick={handleManualClick} className="cursor-pointer">
              <PenIcon className="h-4 w-4 mr-2" />
              <span>Manuellement</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAIClick} className="cursor-pointer">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Via IA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <SheetContent className="sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>
                {creationMode === "manual" ? "Créer une tâche manuellement" : "Créer une tâche avec IA"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <TaskForm onSubmit={handleCreateTask} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mb-4 flex justify-end">
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "list" | "kanban")}
        >
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
          tasks={tasks}
          onStatusChange={handleStatusChange}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onSelectAll={handleSelectAll}
          onEditTask={handleEditTask}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <TaskKanban
          tasks={tasks}
          onStatusChange={handleStatusChange}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onEditTask={handleEditTask}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  )
}