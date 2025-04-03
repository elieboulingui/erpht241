'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Function to extract the organisation ID from the URL
function extractOrganisationId(url?: string): string | null {
  if (!url) return null
  console.log('Extracting organisationId from URL:', url) // Debug
  const match = url.match(/\/listing-organisation\/([^/]+)/)
  return match ? match[1] : null
}

// Updated type definition to include assignee
export type CreateTaskParams = {
  title: string
  description?: string
  type: string
  status: string
  priority: string
  contactId: string
  organisationId: string
  assignee: string | null // Assignee can be null
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

  // Extract organisationId if needed
  const extractedOrganisationId = extractOrganisationId(organisationId)
  console.log('Extracted organisationId:', extractedOrganisationId)

  // Map French status to English
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

  // Convert the status and priority to English
  const statusInEnglish = statusMap[status] || status
  const priorityInEnglish = priorityMap[priority] || priority

  // Define valid status and priority options
  const validStatuses = ['TODO', 'IN_PROGRESS', 'WAITING', 'DONE', 'CANCELLED'] as const
  const validPriorities = ['HIGH', 'MEDIUM', 'LOW'] as const

  // Check if the mapped status is valid
  if (!validStatuses.includes(statusInEnglish as 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED')) {
    throw new Error(`Invalid task status: ${status}. Valid options are: TODO, IN_PROGRESS, WAITING, DONE, CANCELLED.`)
  }

  // Check if the mapped priority is valid
  if (!validPriorities.includes(priorityInEnglish as 'HIGH' | 'MEDIUM' | 'LOW')) {
    throw new Error(`Invalid task priority: ${priority}. Valid options are: HIGH, MEDIUM, LOW.`)
  }

  // Validate assignee if provided
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
    // Create the task in the database, including the assignee if valid
    await prisma.task.create({
      data: {
        title,
        description: description || '', // Ensure description defaults to an empty string if not provided
        type: type.toUpperCase() as 'FEATURE' | 'BUG' | 'DOCUMENTATION', // Map type to uppercase
        status: statusInEnglish as 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED',
        priority: priorityInEnglish as 'HIGH' | 'MEDIUM' | 'LOW',
        organisationId: extractedOrganisationId || organisationId, // Use extracted organisationId if available
        createdById: session?.user.id, // Ensure the user ID from the session is used
        assigneeId, // Only set assigneeId if it's valid
      },
    })

    // Revalidate the path to refresh the task list
    revalidatePath('/tasks')
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : error}`)
  }
}
