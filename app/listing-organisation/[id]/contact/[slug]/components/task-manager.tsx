// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { 
//   DropdownMenu, 
//   DropdownMenuTrigger, 
//   DropdownMenuContent, 
//   DropdownMenuItem 
// } from "@/components/ui/dropdown-menu"
// import { toast } from "sonner"
// import type { Task, TaskStatus } from "@/types/task"
// import TaskTable from "./task-table"
// import TaskKanban from "./task-kanban"
// import { TaskForm } from "./TaskForm"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { LayoutGrid, List, PenIcon, Plus, Sparkles } from "lucide-react"
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet"

// export default function TaskManager() {
//   const [tasks, setTasks] = useState<Task[]>([
//     {
//       id: "task-1",
//       title: "Corriger le bug de connexion",
//       type: "Bug",
//       status: "À faire",
//       priority: "Élevée",
//       favorite: false,
//       description: "Les utilisateurs ne peuvent pas se connecter après la mise à jour",
//     },
//     {
//       id: "task-2",
//       title: "Ajouter la page de contact",
//       type: "Fonctionnalité",
//       status: "En cours",
//       priority: "Moyenne",
//       favorite: true,
//     }
//   ])
  
//   const [selectedTasks, setSelectedTasks] = useState<string[]>([])
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
//   const [creationMode, setCreationMode] = useState<"manual" | "ai">("manual")

//   const handleCreateTask = (newTask: Omit<Task, "id" | "favorite">) => {
//     const taskWithId: Task = {
//       ...newTask,
//       id: `task-${Date.now()}`,
//       favorite: false
//     }
    
//     setTasks([...tasks, taskWithId])
//     setIsDialogOpen(false)
//     toast.success("Tâche créée avec succès")
//   }

//   const handleManualClick = () => {
//     setCreationMode("manual")
//     setIsDialogOpen(true)
//     setIsDropdownOpen(false)
//   }

//   const handleAIClick = () => {
//     setCreationMode("ai")
//     setIsDialogOpen(true)
//     setIsDropdownOpen(false)
//     toast.message("Création via IA", {
//       description: "La fonctionnalité de création via IA sera bientôt disponible"
//     })
//   }

//   const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
//     setTasks(tasks.map(task => 
//       task.id === taskId ? { ...task, status: newStatus } : task
//     ))
//   }

//   const handleSelectTask = (taskId: string, isSelected: boolean) => {
//     setSelectedTasks(isSelected 
//       ? [...selectedTasks, taskId] 
//       : selectedTasks.filter(id => id !== taskId)
//     )
//   }

//   const handleSelectAll = (isSelected: boolean) => {
//     setSelectedTasks(isSelected ? tasks.map(task => task.id) : [])
//   }

//   const handleDeleteTask = (taskId: string) => {
//     setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
//   }

//   const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
//     setTasks(tasks.map(task => 
//       task.id === taskId ? { ...task, ...updatedTask } : task
//     ))
//   }

//   const handleToggleFavorite = (taskId: string) => {
//     setTasks(tasks.map(task => 
//       task.id === taskId ? { ...task, favorite: !task.favorite } : task
//     ))
//   }

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Gestion des Tâches</h1>
        
//         <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
//           <DropdownMenuTrigger asChild>
//             <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold">
//               <Plus className="h-4 w-4 mr-1" /> Ajouter une tâche
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-[178px]">
//             <DropdownMenuItem onClick={handleManualClick} className="cursor-pointer">
//               <PenIcon className="h-4 w-4 mr-2" />
//               <span>Manuellement</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={handleAIClick} className="cursor-pointer">
//               <Sparkles className="h-4 w-4 mr-2" />
//               <span>Via IA</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <SheetContent className="sm:max-w-[600px]">
//             <SheetHeader>
//               <SheetTitle>
//                 {creationMode === "manual" ? "Créer une tâche manuellement" : "Créer une tâche avec IA"}
//               </SheetTitle>
//             </SheetHeader>
//             <div className="mt-6">
//               <TaskForm onSubmit={handleCreateTask} />
//             </div>
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div className="mb-4 flex justify-end">
//         <Tabs
//           value={viewMode}
//           onValueChange={(value) => setViewMode(value as "list" | "kanban")}
//         >
//           <TabsList>
//             <TabsTrigger value="list">
//               <List className="w-4 h-4 mr-2" /> Vue Liste
//             </TabsTrigger>
//             <TabsTrigger value="kanban">
//               <LayoutGrid className="w-4 h-4 mr-2" /> Vue Kanban
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {viewMode === "list" ? (
//         <TaskTable
//           tasks={tasks}
//           onStatusChange={handleStatusChange}
//           selectedTasks={selectedTasks}
//           onSelectTask={handleSelectTask}
//           onSelectAll={handleSelectAll}
//           onEditTask={handleEditTask}
//           onToggleFavorite={handleToggleFavorite}
//           onDeleteTask={handleDeleteTask}
//         />
//       ) : (
//         <TaskKanban
//           tasks={tasks}
//           onStatusChange={handleStatusChange}
//           selectedTasks={selectedTasks}
//           onSelectTask={handleSelectTask}
//           onEditTask={handleEditTask}
//           onToggleFavorite={handleToggleFavorite}
//         />
//       )}
//     </div>
//   )
// }




"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { Task, TaskStatus, TaskType, TaskPriority } from "@/types/task"
import TaskTable from "./task-table"
import TaskKanban from "./task-kanban"
import { TaskForm } from "./TaskForm"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List, PenIcon, Plus, Sparkles, Circle, ArrowUpDown, SlidersHorizontal } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

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
    },
    {
      id: "task-2",
      title: "Ajouter la page de contact",
      type: "Fonctionnalité",
      status: "En cours",
      priority: "Moyenne",
      favorite: true,
    }
  ])
  
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("manual")
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null)
  const [typeFilter, setTypeFilter] = useState<TaskType[]>([])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = searchTerm
      ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    const matchesStatus = statusFilter ? task.status === statusFilter : true
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true
    const matchesType =
      typeFilter.length > 0 ? typeFilter.includes(task.type) : true

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

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

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
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

      {/* Barre de filtres */}
      <div className="flex items-center py-4 gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Rechercher des tâches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <Button variant="outline" className="flex items-center gap-2">
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
                <DropdownMenuRadioItem value="À faire">
                  À faire
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="En cours">
                  En cours
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Terminé">
                  Terminé
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="En attente">
                  En attente
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Annulé">
                  Annulé
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
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
                <DropdownMenuRadioItem value="Faible">
                  Faible
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Moyenne">
                  Moyenne
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Élevée">
                  Élevée
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
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
                      checked
                        ? [...prev, type as TaskType]
                        : prev.filter((t) => t !== type)
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
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onSelectAll={handleSelectAll}
          onEditTask={handleEditTask}
          onToggleFavorite={handleToggleFavorite}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
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