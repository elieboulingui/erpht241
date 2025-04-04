"use client"

import type React from "react"

// components/TaskForm.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createTask } from "../actions/createtask"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task"

export interface CreateTaskParams {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  type: TaskType
  assignee: string
  contactId: string
  organisationId: string
}

type TaskWithAssignee = Omit<Task, "id" | "favorite"> & { assignee: string }

const statusOptions: TaskStatus[] = ["À faire", "En cours", "Terminé", "En attente", "Annulé"]

const priorityOptions: TaskPriority[] = ["Faible", "Moyenne", "Élevée"]
const typeOptions: TaskType[] = ["Bug", "Fonctionnalité", "Documentation"]

interface TaskFormProps {
  onSubmit: (task: TaskWithAssignee) => void
  onCancel?: () => void
  initialData?: Partial<Task>
  // Ajoutez cette prop pour notifier le parent qu'une tâche a été créée via l'API
  onTaskCreated?: () => void
}

export function TaskForm({ onSubmit, onCancel, initialData, onTaskCreated }: TaskFormProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false) // État de chargement

  const [formData, setFormData] = useState<TaskWithAssignee>({
    title: initialData?.title || "",
    type: initialData?.type || "Bug",
    status: initialData?.status || "À faire",
    priority: initialData?.priority || "Moyenne",
    description: initialData?.description || "",
    assignee: initialData?.assignee || "",
  })

  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)
  const [assigneeOptions, setAssigneeOptions] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (pathname) {
      const organisationIdMatch = pathname.match(/\/listing-organisation\/([a-z0-9-]+)/)
      const contactIdMatch = pathname.match(/\/contact\/([a-z0-9-]+)/)

      if (organisationIdMatch) {
        setOrganisationId(organisationIdMatch[1])
      }

      if (contactIdMatch) {
        setContactId(contactIdMatch[1])
      }
    }
  }, [pathname])

  useEffect(() => {
    if (organisationId) {
      const fetchAssignees = async () => {
        try {
          const response = await fetch(`/api/contact?organisationId=${organisationId}`)
          const data = await response.json()

          if (response.ok) {
            setAssigneeOptions(data)
          } else {
            console.error("Failed to fetch assignees", data.error)
          }
        } catch (error) {
          console.error("Error fetching assignees:", error)
        }
      }

      fetchAssignees()
    }
  }, [organisationId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true) // Activer l'état de chargement

    if (!contactId || !organisationId) {
      console.error("Missing data for creating the task")
      setIsSubmitting(false) // Désactiver l'état de chargement en cas d'erreur
      return
    }

    try {
      await createTask({
        title: formData.title,
        description: formData.description || "",
        status: formData.status,
        priority: formData.priority,
        type: formData.type,
        assignee: formData.assignee,
        contactId: contactId,
        organisationId: organisationId,
      })

      // Notifiez le parent qu'une tâche a été créée via l'API
      if (onTaskCreated) {
        onTaskCreated()
      }

      onSubmit(formData)
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error)
    } finally {
      setIsSubmitting(false) // Désactiver l'état de chargement dans tous les cas
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre de la tâche"
            required
          />
        </div>

        {/* Type, Priority, and Assignee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assigné à</Label>
            <Select value={formData.assignee} onValueChange={(value) => handleSelectChange("assignee", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un assigné" />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
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
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold"
          disabled={isSubmitting} // Désactiver le bouton pendant le chargement
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {initialData ? "Mise à jour..." : "Création..."}
            </span>
          ) : initialData ? (
            "Mettre à jour"
          ) : (
            "Créer la tâche"
          )}
        </Button>
      </div>
    </form>
  )
}

