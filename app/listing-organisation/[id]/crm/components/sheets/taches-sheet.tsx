"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Tag, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { SelectTrigger } from "@radix-ui/react-select"
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SheetClose, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type TaskSheetProps = {
  cardId: string
}

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

export default function TaskSheet({ cardId }: TaskSheetProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedContact, setSelectedContact] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ⚡️ Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      if (!cardId) return
      try {
        setLoading(true)
        const response = await fetch(`/api/tasks?opportunityId=${cardId}`)
        if (!response.ok) throw new Error("Échec de la récupération des tâches")
        const data = await response.json()
        const allTasks = data.contacts?.flatMap((contact: any) =>
          contact.tasks.map((task: any) => ({
            ...task,
            contact: {
              id: contact.id,
              name: contact.name,
            },
          }))
        ) || []
        
        setTasks(allTasks)
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [cardId])

  const contacts = [
    { id: "all", name: "Tous les contacts" },
    ...Array.from(new Set(tasks.map(t => t.contact.id)))
      .map(id => {
        const contact = tasks.find(t => t.contact.id === id)
        return contact ? { id, name: contact.contact.name } : null
      })
      .filter(Boolean) as { id: string, name: string }[]
  ]

  const filteredTasks =
    selectedContact === "all"
      ? tasks
      : tasks.filter((task) => task.contact.id === selectedContact)

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
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
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Factures</SheetTitle>
        <SheetDescription className="text-gray-400">
          Gérez les factures associées à cette opportunité
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tâches à suivre</h3>
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

        {loading && (
          <div className="text-center text-gray-500 py-4">Chargement des tâches...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-4">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune tâche pour le moment</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className={cn("transition-opacity", task.completed ? "opacity-70" : "")}
                >
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
                            <h4
                              className={cn(
                                "font-medium",
                                task.completed && "line-through text-gray-500"
                              )}
                            >
                              {task.title}
                            </h4>
                            <div className="text-xs text-[#7f1d1c] font-medium mt-1">
                              Contact: {task.contact.name}
                            </div>
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

                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{format(new Date(task.dueDate), "d MMM yyyy", { locale: fr })}</span>
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
                                <AvatarFallback>
                                  {task.assignedTo.name.charAt(0)}
                                </AvatarFallback>
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
        )}
      </div>

      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
          >
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
