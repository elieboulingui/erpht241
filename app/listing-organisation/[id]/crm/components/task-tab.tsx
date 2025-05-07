"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Tag, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  description?: string
  dueDate: Date | null
  completed: boolean
  priority: "low" | "medium" | "high"
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
  contact: {
    id: string
    name: string
  }
}

export default function TaskTab() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Relancer le client pour la signature du contrat",
      description: "Le contrat a été envoyé il y a 5 jours, prévoir une relance téléphonique pour finaliser la vente",
      dueDate: new Date(2025, 4, 10),
      completed: false,
      priority: "high",
      assignedTo: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "2",
      title: "Préparer une offre personnalisée pour le nouveau prospect",
      description:
        "Suite à l'entretien de découverte, élaborer une proposition commerciale adaptée aux besoins spécifiques",
      dueDate: new Date(2025, 4, 8),
      completed: true,
      priority: "medium",
      assignedTo: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "3",
      title: "Envoyer la documentation technique demandée",
      description: "Le directeur technique a demandé des spécifications détaillées sur notre solution",
      dueDate: new Date(2025, 4, 12),
      completed: false,
      priority: "low",
      contact: {
        id: "contact3",
        name: "Client 123",
      },
    },
    {
      id: "4",
      title: "Analyser le potentiel de vente additionnelle",
      description: "Identifier les opportunités de cross-selling et up-selling pour ce client existant",
      dueDate: new Date(2025, 4, 15),
      completed: false,
      priority: "medium",
      assignedTo: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "5",
      title: "Mettre à jour la fiche client dans le CRM",
      description: "Ajouter les nouvelles informations obtenues lors du dernier échange",
      dueDate: new Date(2025, 4, 7),
      completed: true,
      priority: "low",
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
  ])

  const [selectedContact, setSelectedContact] = useState<string>("all")
  const contacts = [
    { id: "all", name: "Tous les contacts" },
    { id: "contact1", name: "Entreprise ABC" },
    { id: "contact2", name: "Société XYZ" },
    { id: "contact3", name: "Client 123" },
  ]

  const filteredTasks = selectedContact === "all" ? tasks : tasks.filter((task) => task.contact.id === selectedContact)

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Haute"
      case "medium":
        return "Moyenne"
      case "low":
        return "Basse"
      default:
        return "Moyenne"
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tâches à suivre</h3>
        <div className="flex items-center gap-2">
          <Select value={selectedContact} onValueChange={setSelectedContact}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune tâche pour le moment</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={cn("transition-opacity", task.completed ? "opacity-70" : "")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={cn("font-medium", task.completed && "line-through text-gray-500")}>
                          {task.title}
                        </h4>
                        <div className="text-xs text-[#7f1d1c] font-medium mt-1">Contact: {task.contact.name}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(task.dueDate, "d MMM yyyy", { locale: fr })}</span>
                        </div>
                      )}

                      <Badge className={getPriorityColor(task.priority)}>
                        <Tag className="h-3 w-3 mr-1" />
                        {getPriorityLabel(task.priority)}
                      </Badge>

                      {task.assignedTo && (
                        <div className="flex items-center gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={task.assignedTo.avatar || "/placeholder.svg"}
                              alt={task.assignedTo.name}
                            />
                            <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{task.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
