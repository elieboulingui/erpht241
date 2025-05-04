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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateTask, archivedTask } from "../actions/createtask";
import { toast } from "sonner";

interface TaskRowProps {
  task: Task;
  taskNumber: string;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onToggleFavorite: (taskId: string) => void;
  onArchiveTask: (taskId: string) => void;
}

export default function TaskRow({
  task,
  taskNumber,
  isSelected,
  onSelect,
  onStatusChange,
  onEditTask,
  onToggleFavorite,
  onArchiveTask,
}: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({ ...task });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    
    const toastId = toast.loading("Enregistrement de la tâche...");
    
    try {
      if (!editedTask.title) {
        throw new Error("Le titre est obligatoire");
      }

      const updatedTask = await updateTask(task.id, {
        title: editedTask.title || "",
        description: editedTask.description || "",
        type: editedTask.type || "FEATURE",
        status: editedTask.status || "TODO",
        priority: editedTask.priority || "MEDIUM",
        assignee: null,
      });

      onEditTask(task.id, updatedTask as any);
      setIsEditing(false);
      
      toast.success("Tâche mise à jour avec succès", {
        id: toastId,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour"
      );
      console.error("Erreur:", error);
      
      toast.error("Échec de la mise à jour de la tâche", {
        id: toastId,
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsSaving(false);
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
    setError(null);
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

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmArchive = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Suppression de la tâche...");
    
    try {
      await archivedTask(task.id);
      onArchiveTask(task.id);
      setShowDeleteDialog(false);
      
      toast.success("Tâche supprimée avec succès", {
        id: toastId,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError("Une erreur est survenue lors de la suppression");
      
      toast.error("Échec de la suppression de la tâche", {
        id: toastId,
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(task.id);
    toast.success(
      task.favorite 
        ? "Tâche retirée des favoris" 
        : "Tâche ajoutée aux favoris"
    );
  };

  return (
    <>
      <TableRow className="border-b border-gray-200 hover:bg-gray-50">
        <TableCell className="p-3">
          <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(!!checked)} />
        </TableCell>
        <TableCell className="p-3 font-mono text-sm text-gray-500">
          {taskNumber}
        </TableCell>
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
                onClick={handleToggleFavorite}
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
                value={editedTask.type || "FEATURE"}
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
                  value={editedTask.status || "TODO"}
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
                  value={editedTask.priority || "MEDIUM"}
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

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button onClick={handleCancel} variant="outline" className="mr-4">Annuler</Button>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </div>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la tâche</DialogTitle>
            <DialogDescription className="py-5">
              Êtes-vous sûr de vouloir archiver la tâche :
              <span className="font-semibold text-gray-900"> "{task.title}"</span> ?
              <br />
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Annuler
            </Button>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white"
              onClick={confirmArchive}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Suppression...
                </div>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}