import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface TaskFormProps {
  onCancel: () => void
}

export function TaskForm({ onCancel }: TaskFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="id" className="text-right">
          ID Tâche
        </Label>
        <Input id="id" defaultValue="Généré automatiquement" className="col-span-3" disabled />
      </div> */}

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Titre
        </Label>
        <Input id="title" placeholder="Titre de la tâche" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
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

      <div className="grid grid-cols-4 items-center gap-4">
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

      <div className="grid grid-cols-4 items-center gap-4">
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

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button className="bg-black text-white hover:bg-black" type="submit">Ajouter la tâche</Button>
      </div>
    </div>
  )
}