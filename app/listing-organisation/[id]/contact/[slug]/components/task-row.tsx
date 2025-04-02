// "use client"

// import { useState, useRef } from "react"
// import type { Task, TaskStatus } from "@/types/task"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   MoreHorizontal,
//   ArrowUp,
//   ArrowDown,
//   Circle,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   X,
//   Star,
//   Edit,
//   Copy,
//   Tag,
//   Trash2,
// } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSub,
//   DropdownMenuSubTrigger,
//   DropdownMenuSubContent,
//   DropdownMenuPortal,
// } from "@/components/ui/dropdown-menu"
// import TaskTypeTag from "./task-type-tag"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { TableCell, TableRow } from "@/components/ui/table"
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetFooter,
// } from "@/components/ui/sheet"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"

// interface TaskRowProps {
//   task: Task
//   isSelected: boolean
//   onSelect: (isSelected: boolean) => void
//   onStatusChange: (taskId: string, newStatus: TaskStatus) => void
//   onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
//   onToggleFavorite: (taskId: string) => void
//   onDeleteTask: (taskId: string) => void
// }

// export default function TaskRow({
//   task,
//   isSelected,
//   onSelect,
//   onStatusChange,
//   onEditTask,
//   onToggleFavorite,
//   onDeleteTask,
// }: TaskRowProps) {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedTask, setEditedTask] = useState<Partial<Task>>({ ...task })
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
//   const menuRef = useRef<HTMLDivElement>(null)

//   const getStatusIcon = () => {
//     switch (task.status) {
//       case "À faire":
//         return <Circle className="h-4 w-4 text-gray-400" />
//       case "En cours":
//         return <Clock className="h-4 w-4 text-blue-400" />
//       case "Terminé":
//         return <CheckCircle className="h-4 w-4 text-green-400" />
//       case "En attente":
//         return <AlertCircle className="h-4 w-4 text-yellow-400" />
//       case "Annulé":
//         return <X className="h-4 w-4 text-red-400" />
//       default:
//         return <Circle className="h-4 w-4 text-gray-400" />
//     }
//   }

//   const getPriorityIcon = () => {
//     switch (task.priority) {
//       case "Faible":
//         return <ArrowDown className="h-4 w-4 text-gray-400" />
//       case "Moyenne":
//         return <ArrowDown className="h-4 w-4 text-yellow-400" />
//       case "Élevée":
//         return <ArrowUp className="h-4 w-4 text-red-400" />
//       default:
//         return <ArrowDown className="h-4 w-4 text-gray-400" />
//     }
//   }

//   const handleEditClick = () => {
//     setEditedTask({ ...task })
//     setIsEditing(true)
//     setMenuOpen(false)
//   }

//   const handleSave = () => {
//     onEditTask(task.id, editedTask)
//     setIsEditing(false)
//   }

//   const handleCancel = () => {
//     setIsEditing(false)
//     setEditedTask({ ...task })
//   }

//   const handleChange = (field: keyof Task, value: any) => {
//     setEditedTask(prev => ({
//       ...prev,
//       [field]: value
//     }))
//   }

//   const handleDeleteClick = () => {
//     setShowDeleteDialog(true)
//     setMenuOpen(false)
//   }

//   const confirmDelete = () => {
//     onDeleteTask(task.id)
//     setShowDeleteDialog(false)
//   }

//   const cancelDelete = () => {
//     setShowDeleteDialog(false)
//   }

//   return (
//     <>
//       <TableRow className="border-b border-gray-200 hover:bg-gray-50">
//         <TableCell className="p-3">
//           <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(!!checked)} />
//         </TableCell>
//         <TableCell className="p-3 font-mono text-sm text-gray-500">{task.id}</TableCell>
//         <TableCell className="p-3">
//           <div className="flex items-center gap-2 w-[300px]">
//             <TaskTypeTag type={task.type} />
//             <span className="truncate max-w-[400px] text-gray-900">{task.title}</span>
//             {task.favorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
//           </div>
//         </TableCell>
//         <TableCell className="p-3">
//           <div className="line-clamp-2 text-sm text-gray-600 max-w-[500px]">
//             {task.description}
//           </div>
//         </TableCell>
//         <TableCell className="p-3">
//           <div className="flex items-center gap-2">
//             {getStatusIcon()}
//             <span className="text-gray-700">{task.status}</span>
//           </div>
//         </TableCell>
//         <TableCell className="p-3">
//           <div className="flex items-center gap-2">
//             {getPriorityIcon()}
//             <span className="text-gray-700">{task.priority}</span>
//           </div>
//         </TableCell>
//         <TableCell className="p-3 relative">
//           <DropdownMenu onOpenChange={setMenuOpen}>
//             <DropdownMenuTrigger asChild>
//               <button className="focus:outline-none">
//                 <MoreHorizontal className="h-5 w-5 text-gray-400 hover:text-gray-700" />
//               </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-white text-gray-900 border-gray-200 w-48 shadow-lg">
//               <DropdownMenuItem 
//                 className="cursor-pointer focus:bg-gray-100"
//                 onClick={handleEditClick}
//               >
//                 <Edit className="mr-2 h-4 w-4" />
//                 <span>Modifier</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">
//                 <Copy className="mr-2 h-4 w-4" />
//                 <span>Faire une copie</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem 
//                 className="cursor-pointer focus:bg-gray-100" 
//                 onClick={() => onToggleFavorite(task.id)}
//               >
//                 <Star className={`mr-2 h-4 w-4 ${task.favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
//                 <span>Favoris</span>
//               </DropdownMenuItem>
//               <DropdownMenuSub>
//                 <DropdownMenuSubTrigger className="cursor-pointer focus:bg-gray-100">
//                   <Tag className="mr-2 h-4 w-4" />
//                   <span>Étiquettes</span>
//                 </DropdownMenuSubTrigger>
//                 <DropdownMenuPortal>
//                   <DropdownMenuSubContent className="bg-white text-gray-900 border-gray-200 shadow-lg">
//                     <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">Projet</DropdownMenuItem>
//                     <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">Sprint</DropdownMenuItem>
//                     <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">Urgent</DropdownMenuItem>
//                   </DropdownMenuSubContent>
//                 </DropdownMenuPortal>
//               </DropdownMenuSub>
//               <DropdownMenuItem
//                 className="cursor-pointer focus:bg-gray-100 text-red-600"
//                 onClick={handleDeleteClick}
//               >
//                 <Trash2 className="mr-2 h-4 w-4" />
//                 <span>Supprimer</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </TableCell>
//       </TableRow>

//       {/* Sheet d'édition */}
//       <Sheet open={isEditing} onOpenChange={setIsEditing}>
//         <SheetContent className="w-full sm:max-w-xl">
//           <SheetHeader className="mb-6">
//             <SheetTitle>Modifier la tâche</SheetTitle>
//           </SheetHeader>
          
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Type</label>
//               <Select
//                 value={editedTask.type}
//                 onValueChange={(value) => handleChange('type', value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Tâche">Tâche</SelectItem>
//                   <SelectItem value="Bug">Bug</SelectItem>
//                   <SelectItem value="Amélioration">Amélioration</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Titre</label>
//               <Input
//                 value={editedTask.title || ''}
//                 onChange={(e) => handleChange('title', e.target.value)}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Description</label>
//               <Textarea
//                 value={editedTask.description || ''}
//                 onChange={(e) => handleChange('description', e.target.value)}
//                 rows={5}
//               />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Statut</label>
//                 <Select
//                   value={editedTask.status}
//                   onValueChange={(value) => handleChange('status', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Statut" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="À faire">À faire</SelectItem>
//                     <SelectItem value="En cours">En cours</SelectItem>
//                     <SelectItem value="Terminé">Terminé</SelectItem>
//                     <SelectItem value="En attente">En attente</SelectItem>
//                     <SelectItem value="Annulé">Annulé</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Priorité</label>
//                 <Select
//                   value={editedTask.priority}
//                   onValueChange={(value) => handleChange('priority', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Priorité" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Faible">Faible</SelectItem>
//                     <SelectItem value="Moyenne">Moyenne</SelectItem>
//                     <SelectItem value="Élevée">Élevée</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
          
//           <SheetFooter className="mt-8">
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={handleCancel}>
//                 Annuler
//               </Button>
//               <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold" onClick={handleSave}>
//                 Enregistrer
//               </Button>
//             </div>
//           </SheetFooter>
//         </SheetContent>
//       </Sheet>

//       {/* Dialog de confirmation de suppression */}
//       <Dialog open={showDeleteDialog} onOpenChange={cancelDelete}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Supprimer la tâche</DialogTitle>
//             <DialogDescription>
//               Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={cancelDelete}>
//               Annuler
//             </Button>
//             <Button 
//               variant="destructive" 
//               onClick={confirmDelete}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Supprimer
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }



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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TaskRowProps {
  task: Task
  isSelected: boolean
  onSelect: (isSelected: boolean) => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onToggleFavorite: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function TaskRow({
  task,
  isSelected,
  onSelect,
  onStatusChange,
  onEditTask,
  onToggleFavorite,
  onDeleteTask,
}: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Partial<Task>>({ ...task })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
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
      default:
        return <ArrowDown className="h-4 w-4 text-gray-400" />
    }
  }

  const handleEditClick = () => {
    setEditedTask({ ...task })
    setIsEditing(true)
    setMenuOpen(false)
  }

  const handleSave = () => {
    onEditTask(task.id, editedTask)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTask({ ...task })
  }

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
    setMenuOpen(false)
  }

  const confirmDelete = () => {
    onDeleteTask(task.id)
    setShowDeleteDialog(false)
  }

  const cancelDelete = () => {
    setShowDeleteDialog(false)
  }

  return (
    <>
      <TableRow className="border-b border-gray-200 hover:bg-gray-50">
        <TableCell className="p-3">
          <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(!!checked)} />
        </TableCell>
        <TableCell className="p-3 font-mono text-sm text-gray-500">{task.id}</TableCell>
        <TableCell className="p-3">
          <div className="flex items-center gap-2 w-[300px]">
            <TaskTypeTag type={task.type} />
            <span className="truncate max-w-[400px] text-gray-900">{task.title}</span>
            {task.favorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
          </div>
        </TableCell>
        <TableCell className="p-3">
          <div className="line-clamp-2 text-sm text-gray-600 max-w-[500px]">
            {task.description}
          </div>
        </TableCell>
        <TableCell className="p-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-gray-700">{task.status}</span>
          </div>
        </TableCell>
        <TableCell className="p-3">
          <div className="flex items-center gap-2">
            {getPriorityIcon()}
            <span className="text-gray-700">{task.priority}</span>
          </div>
        </TableCell>
        <TableCell className="p-3 relative">
          <DropdownMenu onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <MoreHorizontal className="h-5 w-5 text-gray-400 hover:text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-gray-900 border-gray-200 w-48 shadow-lg">
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-gray-100"
                onClick={handleEditClick}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">
                <Copy className="mr-2 h-4 w-4" />
                <span>Faire une copie</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-gray-100" 
                onClick={() => onToggleFavorite(task.id)}
              >
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
                onClick={handleDeleteClick}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Sheet d'édition */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Modifier la tâche</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={editedTask.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tâche">Tâche</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Amélioration">Amélioration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input
                value={editedTask.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editedTask.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À faire">À faire</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priorité</label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faible">Faible</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Élevée">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-8">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold" onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={cancelDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer la tâche</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}