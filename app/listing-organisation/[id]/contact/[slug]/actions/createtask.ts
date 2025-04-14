'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Fonction pour extraire l'organisation ID à partir de l'URL
function extractOrganisationId(url?: string): string | null {
  if (!url) return null
  console.log('Extracting organisationId from URL:', url)
  const match = url.match(/\/listing-organisation\/([^/]+)/)
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
  organisationId: string
  assignee: string | null
}

export async function createTask({
  title,
  description,
  type,
  status,
  priority,
  contactId,
  organisationId,
  assignee,
}: CreateTaskParams) {
  const session = await auth()
  console.log('Session:', session)

  const extractedOrganisationId = extractOrganisationId(organisationId)
  console.log('Extracted organisationId:', extractedOrganisationId)

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

  try {
    // ✅ Création de la tâche
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || '',
        type: type.toUpperCase() as 'FEATURE' | 'BUG' | 'DOCUMENTATION',
        status: statusInEnglish as 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED',
        priority: priorityInEnglish as 'HIGH' | 'MEDIUM' | 'LOW',
        organisationId: extractedOrganisationId || organisationId,
        createdById: session?.user.id,
        assigneeId,
      },
    })

    // ✅ Enregistrement dans le journal d'activité
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Task',
        entityId: newTask.id,
        entityName: newTask.title,
        newData: newTask,
        organisationId: newTask.organisationId,
        userId: session?.user.id,
        createdByUserId: session?.user.id,
        taskId: newTask.id,
        ipAddress: '', // Peut être ajouté via middleware ou headers
        userAgent: '', // Idem
        actionDetails: `Tâche "${newTask.title}" créée avec le statut "${newTask.status}" et priorité "${newTask.priority}".`,
      },
    })

    revalidatePath('/tasks')
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : error}`)
  }
}
