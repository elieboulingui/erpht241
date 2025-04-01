export type TaskStatus = "À faire" | "En cours" | "Terminé" | "En attente" | "Annulé"
export type TaskPriority = "Faible" | "Moyenne" | "Élevée"
export type TaskType = "Bug" | "Fonctionnalité" | "Documentation"

export interface Task {
  id: string
  title: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  favorite?: boolean
  description?: string
  assignee?: string
}