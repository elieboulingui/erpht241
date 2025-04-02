// "use client"

// import { useState, useRef } from "react"
// import type { Task, TaskStatus } from "@/types/task"
// import { Button } from "@/components/ui/button"
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
// import { Tabs, TabsContent } from "@/components/ui/tabs"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Filter, SlidersHorizontal } from "lucide-react"
// import PaginationGlobal from "@/components/paginationGlobal"
// import TaskRow from "./task-row"

// type SortField = "id" | "title" | "status" | "priority"
// type SortDirection = "asc" | "desc"

// interface TaskTableProps {
//   tasks: Task[]
//   onStatusChange: (taskId: string, newStatus: TaskStatus) => void
//   selectedTasks: string[]
//   onSelectTask: (taskId: string, isSelected: boolean) => void
//   onSelectAll: (isSelected: boolean) => void
//   onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
//   onToggleFavorite: (taskId: string) => void
//   onDeleteTask: (taskId: string) => void
// }

// export default function TaskTable({
//   tasks,
//   onStatusChange,
//   selectedTasks,
//   onSelectTask,
//   onSelectAll,
//   onEditTask,
//   onToggleFavorite,
//   onDeleteTask,
// }: TaskTableProps) {
//   // États pour le tri et la pagination
//   const [sortField, setSortField] = useState<SortField | null>(null)
//   const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const searchInputRef = useRef<HTMLInputElement>(null)

//   // Fonction de tri
//   const toggleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("asc")
//     }
//   }

//   // Icône de tri
//   const getSortIcon = (field: SortField) => (
//     <Button
//       variant="ghost"
//       size="sm"
//       className="h-6 w-6 p-0 ml-1"
//       onClick={(e) => {
//         e.stopPropagation()
//         toggleSort(field)
//       }}
//     >
//       <Filter className="h-3 w-3 text-gray-500" />
//     </Button>
//   )

//   // Gestion de la recherche
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value)
//     setCurrentPage(1)
//   }

//   // Filtrage des tâches
//   const filteredTasks = tasks.filter((task) => {
//     if (!searchTerm) return true
//     return (
//       task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   })

//   // Tri des tâches
//   if (sortField) {
//     filteredTasks.sort((a, b) => {
//       const aValue = a[sortField]
//       const bValue = b[sortField]
//       if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
//       if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
//       return 0
//     })
//   }

//   // Pagination
//   const totalItems = filteredTasks.length
//   const totalPages = Math.ceil(totalItems / rowsPerPage)
//   const startIndex = (currentPage - 1) * rowsPerPage
//   const endIndex = Math.min(startIndex + rowsPerPage, totalItems)
//   const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

//   return (
//     <div className="relative">
//       <Tabs defaultValue="tasks">
//         <TabsContent value="tasks" className="p-0">
//           <div className="border border-gray-200 rounded-sm overflow-hidden">
//             <Table>
//               <TableHeader className="bg-[#e6e7eb]">
//                 <TableRow className="border-b border-gray-300">
//                   <TableHead className="text-gray-900 font-medium">
//                     <Checkbox
//                       checked={paginatedTasks.length > 0 && 
//                               paginatedTasks.every(task => selectedTasks.includes(task.id))}
//                       onCheckedChange={onSelectAll}
//                       className="border-gray-400"
//                     />
//                   </TableHead>
//                   <TableHead className="text-gray-900 font-medium">
//                     <div className="flex items-center">
//                       ID Tâche
//                       {getSortIcon("id")}
//                     </div>
//                   </TableHead>
//                   <TableHead className="text-gray-900 font-medium">
//                     <div className="flex items-center">
//                       Titre
//                       {getSortIcon("title")}
//                     </div>
//                   </TableHead>
//                   <TableHead className="text-gray-900 font-medium">
//                     Description
//                   </TableHead>
//                   <TableHead className="text-gray-900 font-medium">
//                     <div className="flex items-center">
//                       Statut
//                       {getSortIcon("status")}
//                     </div>
//                   </TableHead>
//                   <TableHead className="text-gray-900 font-medium">
//                     <div className="flex items-center">
//                       Priorité
//                       {getSortIcon("priority")}
//                     </div>
//                   </TableHead>
//                   <TableHead className="text-gray-900 font-medium">
//                     <div className="flex items-center justify-center">
//                       <SlidersHorizontal className="h-4 w-4 mr-5" />
//                     </div>
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
              
//               <TableBody>
//                 {paginatedTasks.length > 0 ? (
//                   paginatedTasks.map(task => (
//                     <TaskRow
//                       key={task.id}
//                       task={task}
//                       isSelected={selectedTasks.includes(task.id)}
//                       onSelect={(isSelected) => onSelectTask(task.id, isSelected)}
//                       onStatusChange={onStatusChange}
//                       onEditTask={onEditTask}
//                       onToggleFavorite={onToggleFavorite}
//                       onDeleteTask={onDeleteTask}
//                     />
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} className="h-24 text-center text-gray-500">
//                       Aucune tâche trouvée
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </TabsContent>
//       </Tabs>

//       <PaginationGlobal
//         currentPage={currentPage}
//         totalPages={totalPages}
//         rowsPerPage={rowsPerPage}
//         setCurrentPage={setCurrentPage}
//         setRowsPerPage={setRowsPerPage}
//         totalItems={totalItems}
//       />
//     </div>
//   )
// }




"use client"

import { useState, useRef } from "react"
import type { Task, TaskStatus } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, SlidersHorizontal } from "lucide-react"
import PaginationGlobal from "@/components/paginationGlobal"
import TaskRow from "./task-row"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SortField = "id" | "title" | "status" | "priority"
type SortDirection = "asc" | "desc"

interface TaskTableProps {
  tasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  selectedTasks: string[]
  onSelectTask: (taskId: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onToggleFavorite: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onDeleteSelected: (taskIds: string[]) => void
}

export default function TaskTable({
  tasks,
  onStatusChange,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onEditTask,
  onToggleFavorite,
  onDeleteTask,
  onDeleteSelected,
}: TaskTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true
    return (
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (sortField) {
    filteredTasks.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  const totalItems = filteredTasks.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems)
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

  return (
    <div className="relative">
      {/* Barre de sélection */}
      {selectedTasks.length > 0 && (
        <>
          <div className="flex items-center justify-between bg-[#e6e7eb] p-2 mb-2 rounded-sm border border-gray-300">
            <div className="flex items-center">
              <span className="text-sm text-gray-900">
                {selectedTasks.length} sélectionné(s)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-[#7f1d1d] bg-[#7f1d1d]"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Supprimer la sélection
            </Button>
          </div>

          {/* Dialogue de confirmation */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Supprimer les tâches sélectionnées</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer {selectedTasks.length} tâche(s) ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDeleteSelected(selectedTasks)
                    setShowDeleteConfirm(false)
                  }}
                >
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      <Tabs defaultValue="tasks">
        <TabsContent value="tasks" className="p-0">
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#e6e7eb]">
                <TableRow className="border-b border-gray-300">
                  <TableHead className="text-gray-900 font-medium">
                    <Checkbox
                      checked={paginatedTasks.length > 0 && 
                              paginatedTasks.every(task => selectedTasks.includes(task.id))}
                      onCheckedChange={onSelectAll}
                      className="border-gray-400"
                    />
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      ID Tâche
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      Titre
                      {getSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    Description
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      Statut
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      Priorité
                      {getSortIcon("priority")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center justify-center">
                      <SlidersHorizontal className="h-4 w-4 mr-5" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      isSelected={selectedTasks.includes(task.id)}
                      onSelect={(isSelected) => onSelectTask(task.id, isSelected)}
                      onStatusChange={onStatusChange}
                      onEditTask={onEditTask}
                      onToggleFavorite={onToggleFavorite}
                      onDeleteTask={onDeleteTask}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
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