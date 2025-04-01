import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  onCancel: () => void;
}

export function TaskForm({ onCancel }: TaskFormProps) {
  return (
    <div className="space-y-4">
      <div className="mt-2">
        <Label htmlFor="title" className="text-right">
          Titre
        </Label>
        <Input
          id="title"
          placeholder="Titre de la tâche"
          className="col-span-3"
        />
      </div>

      <div className="">
        <Label htmlFor="description" className="text-right pt-2">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Description détaillée de la tâche"
          className="col-span-3 min-h-[100px] pl-3"
        />
      </div>

      <div className="">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Select>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">Fonctionnalité</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <Label htmlFor="status" className="text-right">
          Statut
        </Label>
        <Select>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">À faire</SelectItem>
            <SelectItem value="in-progress">En cours</SelectItem>
            <SelectItem value="waiting">En attente</SelectItem>
            <SelectItem value="done">Terminé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <Label htmlFor="priority" className="text-right">
          Priorité
        </Label>
        <Select>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Sélectionner une priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Élevée</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="">
        <Label htmlFor="assignee" className="text-right">
          Assigné à
        </Label>
        <Input
          id="assignee"
          placeholder="Nom de la personne assignée"
          className="col-span-3"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
