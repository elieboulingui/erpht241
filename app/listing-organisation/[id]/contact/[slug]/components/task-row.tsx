"use client"
import { useState, useRef } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import TaskTypeTag from "./task-type-tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { update } from "../actions/update";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { $Enums } from "@prisma/client";

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onToggleFavorite: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({ ...task });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getStatusIcon = () => {
    switch (task.status) {
      case "À faire":
        return <Circle className="h-4 w-4 text-gray-400" />;
      case "En cours":
        return <Clock className="h-4 w-4 text-blue-400" />;
      case "Terminé":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "En attente":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "Annulé":
        return <X className="h-4 w-4 text-red-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  // Dans votre composant React côté client

  const handleSave = async () => {
    try {
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          updatedTask: {
            ...editedTask,
            status: editedTask.status,
            priority: editedTask.priority,
            type: editedTask.type?.toUpperCase() || "FEATURE", // Valeur par défaut
          },
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMsg = data?.error || 'Erreur inconnue';
        console.error('Erreur serveur:', data);
        throw new Error(`Erreur lors de la mise à jour de la tâche: ${errorMsg}`);
      }
  
      const updatedTask = data || {};
      onEditTask(task.id, updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la requête:', error instanceof Error ? error.message : error);
    }
  };
  
  

  const getPriorityIcon = () => {
    switch (task.priority) {
      case "Faible":
        return <ArrowDown className="h-4 w-4 text-gray-400" />;
      case "Moyenne":
        return <ArrowDown className="h-4 w-4 text-yellow-400" />;
      case "Élevée":
        return <ArrowUp className="h-4 w-4 text-red-400" />;
      default:
        return <ArrowDown className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleEditClick = () => {
    setEditedTask({ ...task });
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setMenuOpen(false);
  };

  const confirmDelete = () => {
    onDeleteTask(task.id);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

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
    <SelectItem value="FEATURE">Fonctionnalité</SelectItem>
    <SelectItem value="BUG">Bug</SelectItem>
    <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
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
                    <SelectItem value="TODO">À faire</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="DONE">Terminé</SelectItem>
                    <SelectItem value="WAITING">En attente</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
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
                    <SelectItem value="LOW">Faible</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button onClick={handleCancel} variant="outline" className="mr-4">Annuler</Button>
            <Button onClick={handleSave} >Enregistrer</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette tâche ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          
            <Button onClick={confirmDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
