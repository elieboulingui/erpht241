"use server"
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { inngest } from "@/inngest/client"

// Fonction pour extraire l'ID de l'organisation depuis l'URL
function extractOrganisationId(url?: string): string | null {
  if (!url) return null
  console.log('Extracting organisationId from URL:', url)
  const match = url.match(/\/contactId\/([^/]+)/)
  return match ? match[1] : null
}

// Type pour la création d'une tâche
export type CreateTaskParams = {
  title: string
  description?: string
  type: string
  status: string
  priority: string
  contactId: string
  assignee: string | null
  organisationId: string | undefined
}

export async function createTask({
  title,
  description,
  type,
  status,
  priority,
  contactId,
  assignee,
  organisationId,
}: CreateTaskParams) {
  const session = await auth()
  console.log('Session:', session)

  // Extraction de l'organisation ID depuis l'URL (si disponible)
  const extractedOrganisationId = extractOrganisationId(organisationId) || organisationId;
  console.log('Extracted organisationId:', extractedOrganisationId)

  // Vérification si organisationId est défini
  if (!extractedOrganisationId) {
    throw new Error('Organisation ID is required to create a task.');
  }

  const statusMap: { [key: string]: string } = {
    'À faire': 'TODO',
    'En cours': 'IN_PROGRESS',
    'En attente': 'WAITING',
    'Terminé': 'DONE',
    'Annulé': 'CANCELLED',
  }

  const priorityMap: { [key: string]: string } = {
    'Élevée': 'HIGH',
    'Moyenne': 'MEDIUM',
    'Faible': 'LOW',
  }

  const statusInEnglish = statusMap[status] || status
  const priorityInEnglish = priorityMap[priority] || priority

  const validStatuses = ['TODO', 'IN_PROGRESS', 'WAITING', 'DONE', 'CANCELLED'] as const
  const validPriorities = ['HIGH', 'MEDIUM', 'LOW'] as const

  if (!validStatuses.includes(statusInEnglish as any)) {
    throw new Error(`Invalid task status: ${status}. Valid options are: TODO, IN_PROGRESS, WAITING, DONE, CANCELLED.`)
  }

  if (!validPriorities.includes(priorityInEnglish as any)) {
    throw new Error(`Invalid task priority: ${priority}. Valid options are: HIGH, MEDIUM, LOW.`)
  }

  // Vérification si l'assignee existe
  let assigneeId: string | null = null
  if (assignee) {
    const user = await prisma.contact.findUnique({
      where: { id: assignee },
    })
    if (!user) {
      throw new Error(`Assignee with ID ${assignee} does not exist.`)
    }
    assigneeId = assignee
  }

  // Vérification si le contactId existe dans la base de données
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  })
  if (!contact) {
    throw new Error(`Contact with ID ${contactId} does not exist.`)
  }

  try {
    // Création de la tâche
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || '',
        type: type.toUpperCase() as 'FEATURE' | 'BUG' | 'DOCUMENTATION',
        status: statusInEnglish as 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED',
        priority: priorityInEnglish as 'HIGH' | 'MEDIUM' | 'LOW',
        organisationId: extractedOrganisationId,
        createdById: session?.user.id,
        assigneeId,
        contactId,
      },
    })

    // Log de l'événement
    console.log('Task created successfully:', newTask)

    // Envoi de l'événement d'ajout d'activité "task.added" via Inngest
    await inngest.send({
      name: 'activity/task.added', // Nom de l'événement
      data: {
        userId: session?.user.id,
        activity: `Task created: ${newTask.title}`,
        taskId: newTask.id,  // Assurez-vous que newTask.id est bien défini
        taskType: newTask.type,
        taskStatus: newTask.status,
        taskPriority: newTask.priority,
        organisationId: extractedOrganisationId, // Assurez-vous que cette valeur est correctement extraite
      },
    })

    // Revalidation du chemin des tâches
    revalidatePath('/tasks')

  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : error}`)
  }
}
