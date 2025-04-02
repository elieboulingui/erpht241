// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// interface TaskFormProps {
//   onCancel: () => void;
// }

// export function TaskForm({ onCancel }: TaskFormProps) {
//   return (
//     <div className="space-y-4">
//       <div className="mt-2">
//         <Label htmlFor="title" className="text-right">
//           Titre
//         </Label>
//         <Input
//           id="title"
//           placeholder="Titre de la tâche"
//           className="col-span-3"
//         />
//       </div>

//       <div className="">
//         <Label htmlFor="description" className="text-right pt-2">
//           Description
//         </Label>
//         <Textarea
//           id="description"
//           placeholder="Description détaillée de la tâche"
//           className="col-span-3 min-h-[100px] pl-3"
//         />
//       </div>

//       <div className="">
//         <Label htmlFor="type" className="text-right">
//           Type
//         </Label>
//         <Select>
//           <SelectTrigger className="col-span-3">
//             <SelectValue placeholder="Sélectionner un type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="feature">Fonctionnalité</SelectItem>
//             <SelectItem value="bug">Bug</SelectItem>
//             <SelectItem value="documentation">Documentation</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="">
//         <Label htmlFor="status" className="text-right">
//           Statut
//         </Label>
//         <Select>
//           <SelectTrigger className="col-span-3">
//             <SelectValue placeholder="Sélectionner un statut" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="todo">À faire</SelectItem>
//             <SelectItem value="in-progress">En cours</SelectItem>
//             <SelectItem value="waiting">En attente</SelectItem>
//             <SelectItem value="done">Terminé</SelectItem>
//             <SelectItem value="cancelled">Annulé</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="">
//         <Label htmlFor="priority" className="text-right">
//           Priorité
//         </Label>
//         <Select>
//           <SelectTrigger className="col-span-3">
//             <SelectValue placeholder="Sélectionner une priorité" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="high">Élevée</SelectItem>
//             <SelectItem value="medium">Moyenne</SelectItem>
//             <SelectItem value="low">Faible</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="">
//         <Label htmlFor="assignee" className="text-right">
//           Assigné à
//         </Label>
//         <Input
//           id="assignee"
//           placeholder="Nom de la personne assignée"
//           className="col-span-3"
//         />
//       </div>

//       <div className="flex justify-end gap-2 pt-4">
//         <Button variant="outline" onClick={onCancel}>
//           Annuler
//         </Button>
//         <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
//           Enregistrer
//         </Button>
//       </div>
//     </div>
//   );
// }



"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task"

const statusOptions: TaskStatus[] = ["À faire", "En cours", "Terminé", "En attente", "Annulé"]
const priorityOptions: TaskPriority[] = ["Faible", "Moyenne", "Élevée"]
const typeOptions: TaskType[] = ["Bug", "Fonctionnalité", "Documentation"]

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "favorite">) => void
  onCancel?: () => void
  initialData?: Partial<Task>
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, "id" | "favorite">>({
    title: initialData?.title || "",
    type: initialData?.type || "Bug",
    status: initialData?.status || "À faire",
    priority: initialData?.priority || "Moyenne",
    description: initialData?.description || "",
    assignee: initialData?.assignee || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre de la tâche"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description détaillée..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignee">Assigné à</Label>
          <Input
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            placeholder="Personne assignée"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
        )}
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? "Mettre à jour" : "Créer la tâche"}
        </Button>
      </div>
    </form>
  )
}
