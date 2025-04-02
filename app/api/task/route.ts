import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { TaskPriority, TaskStatus, TaskType } from "@prisma/client"
import { auth } from "@/auth"

// Type pour les données du formulaire de tâche
export type TaskFormData = {
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  dueDate?: Date
}

// GET - Récupérer toutes les tâches d'une organisation
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer l'organisationId depuis les paramètres de requête
    const { searchParams } = new URL(request.url)
    const organisationId = searchParams.get("organisationId")

    if (!organisationId) {
      return NextResponse.json({ success: false, error: "Organisation ID requis" }, { status: 400 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        organisationId,
        isArchived: false,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ success: false, error: "Échec de récupération des tâches" }, { status: 500 })
  }
}

// POST - Créer une nouvelle tâche
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { data, organisationId } = body

    if (!data || !organisationId) {
      return NextResponse.json({ success: false, error: "Données ou organisation ID manquants" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId === "unassigned" ? null : data.assigneeId,
        dueDate: data.dueDate,
        organisationId,
        createdById: userId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    revalidatePath("/tasks")
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ success: false, error: "Échec de création de la tâche" }, { status: 500 })
  }
}

// PUT - Mettre à jour une tâche existante
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { taskId, data } = body

    if (!taskId || !data) {
      return NextResponse.json({ success: false, error: "ID de tâche ou données manquants" }, { status: 400 })
    }

    // Si assigneeId est "unassigned", le définir à null
    if (data.assigneeId === "unassigned") {
      data.assigneeId = null
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    revalidatePath("/tasks")
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ success: false, error: "Échec de mise à jour de la tâche" }, { status: 500 })
  }
}

// PATCH - Mettre à jour le statut d'une tâche
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { taskId, status } = body

    if (!taskId || !status) {
      return NextResponse.json({ success: false, error: "ID de tâche ou statut manquant" }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    revalidatePath("/tasks")
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error("Error updating task status:", error)
    return NextResponse.json({ success: false, error: "Échec de mise à jour du statut de la tâche" }, { status: 500 })
  }
}

// DELETE - Supprimer (archiver) une tâche
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ success: false, error: "ID de tâche manquant" }, { status: 400 })
    }

    // Soft delete par archivage
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: userId,
      },
    })

    revalidatePath("/tasks")
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ success: false, error: "Échec de suppression de la tâche" }, { status: 500 })
  }
}

