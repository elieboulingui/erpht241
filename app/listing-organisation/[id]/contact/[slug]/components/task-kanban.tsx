"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { Task, TaskStatus } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Ellipsis, Star } from "lucide-react";

// Traduction des statuts de tâche
const statusTranslation: Record<string, string> = {
  "À faire": "TODO",
  "En cours": "IN_PROGRESS",
  "En attente": "WAITING",
  "Terminé": "DONE",
  "Annulé": "CANCELLED"
};

const statusOrder: string[] = ["À faire", "En cours", "En attente", "Terminé", "Annulé"];

interface TaskKanbanProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => void;
  selectedTasks: string[];
  onSelectTask: (taskId: string, isSelected: boolean) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onToggleFavorite: (taskId: string) => void;
}

export default function TaskKanban({
  tasks,
  onStatusChange,
  selectedTasks,
  onSelectTask,
  onEditTask,
  onToggleFavorite,
}: TaskKanbanProps) {
  const tasksByStatus: Record<string, Task[]> = {
    "À faire": [],
    "En cours": [],
    "En attente": [],
    "Terminé": [],
    "Annulé": [],
  };

  tasks.forEach(task => {
    // Utilisation de la traduction des statuts
    const translatedStatus = Object.keys(statusTranslation).find(key => statusTranslation[key] === task.status);
    if (translatedStatus) {
      tasksByStatus[translatedStatus].push(task);
    }
  });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;

    // Traduction inverse du statut
    const newStatus = statusTranslation[result.destination.droppableId as keyof typeof statusTranslation];

    // Appeler l'API pour mettre à jour le statut de la tâche
    try {
      const response = await fetch("/api/update-task-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          newStatus,
        }),
      });

      if (response.ok) {
        // Mettre à jour l'état local pour refléter les changements
        onStatusChange(taskId, newStatus);
      } else {
        console.error("Échec de la mise à jour du statut de la tâche");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "À faire": return "bg-gray-200";
      case "En cours": return "bg-blue-200";
      case "En attente": return "bg-red-200";
      case "Terminé": return "bg-green-200";
      case "Annulé": return "bg-yellow-200";
      default: return "bg-gray-200";
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statusOrder.map((status) => (
          <div key={status} className="bg-gray-50 rounded-lg p-2">
            <div className={`${getStatusColor(status)} p-2 rounded-md mb-3`}>
              <h3 className="font-semibold text-center">{status}</h3>
              <span className="text-xs block text-center">
                {tasksByStatus[status].length} tâche(s)
              </span>
            </div>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-20"
                >
                  {tasksByStatus[status].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <Checkbox
                              checked={selectedTasks.includes(task.id)}
                              onCheckedChange={(checked) => onSelectTask(task.id, !!checked)}
                              className="mt-1 border-gray-400"
                            />
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onToggleFavorite(task.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Star
                                  className={`h-4 w-4 ${task.favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                                />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Ellipsis className="h-4 w-4 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                          <div className="ml-6">
                            <p className="font-medium text-sm">{task.title}</p>
                            <div className="flex justify-between items-center mt-2">
                              {/* <span className="text-xs text-gray-500">{task.id}</span> */}
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === "Élevée" ? "bg-red-100 text-red-800" :
                                task.priority === "Moyenne" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
