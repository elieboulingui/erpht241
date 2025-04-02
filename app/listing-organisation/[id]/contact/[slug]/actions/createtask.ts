'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: {
  title: string
  description?: string
  type: string
  status: string
  priority: string
  contactId: string
}) {
  const session = await auth()
  if (!session?.user?.organisationId || !session.user.id) {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.task.create({
      data: {
        title: formData.title,
        description: formData.description,
        type: formData.type as 'FEATURE' | 'BUG' | 'DOCUMENTATION',
        status: formData.status as 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED',
        priority: formData.priority as 'HIGH' | 'MEDIUM' | 'LOW',
        contactId: formData.contactId,
        organisationId: session.user.organisationId,
        createdById: session.user.id
      }
    })

    revalidatePath('/tasks')
  } catch (error) {
    throw new Error('Failed to create task')
  }
}

export async function updateTask(
  id: string,
  formData: {
    title?: string
    description?: string
    type?: string
    status?: string
    priority?: string
    assigneeId?: string | null
    contactId?: string
  }
) {
  const session = await auth()
  if (!session?.user?.organisationId) {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.task.update({
      where: { id, organisationId: session.user.organisationId },
      data: {
        ...formData,
        type: formData.type as 'FEATURE' | 'BUG' | 'DOCUMENTATION' | undefined,
        status: formData.status as 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE' | 'CANCELLED' | undefined,
        priority: formData.priority as 'HIGH' | 'MEDIUM' | 'LOW' | undefined
      }
    })

    revalidatePath('/tasks')
  } catch (error) {
    throw new Error('Failed to update task')
  }
}

export async function deleteTask(id: string) {
  const session = await auth()
  if (!session?.user?.organisationId) {
    throw new Error('Unauthorized')
  }

  try {
    await prisma.task.delete({
      where: { id, organisationId: session.user.organisationId }
    })

    revalidatePath('/tasks')
  } catch (error) {
    throw new Error('Failed to delete task')
  }
}