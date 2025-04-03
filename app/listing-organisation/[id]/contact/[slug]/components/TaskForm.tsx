"use client";
import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { createTask } from "../actions/createtask";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task";

const statusOptions: TaskStatus[] = [
  "À faire",
  "En cours",
  "Terminé",
  "En attente",
  "Annulé",
];

const priorityOptions: TaskPriority[] = ["Faible", "Moyenne", "Élevée"];
const typeOptions: TaskType[] = ["Bug", "Fonctionnalité", "Documentation"];

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "favorite">) => void;
  onCancel?: () => void;
  initialData?: Partial<Task>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [formData, setFormData] = useState<Omit<Task, "id" | "favorite">>({
    title: initialData?.title || "",
    type: initialData?.type || "Bug",
    status: initialData?.status || "À faire",
    priority: initialData?.priority || "Moyenne",
    description: initialData?.description || "",
  });

  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  // Directly extract IDs from pathname using regex
  useEffect(() => {
    if (pathname) {
      const organisationIdMatch = pathname.match(
        /\/listing-organisation\/([a-z0-9\-]+)/
      );
      const contactIdMatch = pathname.match(/\/contact\/([a-z0-9\-]+)/);

      if (organisationIdMatch) {
        setOrganisationId(organisationIdMatch[1]);
      }

      if (contactIdMatch) {
        setContactId(contactIdMatch[1]);
      }
    }
  }, [pathname]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!contactId || !organisationId) {
      console.error("Missing data for creating the task");
      return;
    }
  
    console.log("Form Data: ", formData);
  
    try {
      await createTask({
        title: formData.title,
        description: formData.description || "",
        status: formData.status,
        priority: formData.priority,
        type: formData.type,
        contactId: contactId,
        organisationId: organisationId, // Pass organisationId here
      });
  
      onSubmit(formData);
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title */}
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

        {/* Type and Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type */}
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
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
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
        </div>

        {/* Status */}
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
        >
          {initialData ? "Mettre à jour" : "Créer la tâche"}
        </Button>
      </div>
    </form>
  );
}
