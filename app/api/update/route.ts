import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { taskId, updatedTask } = await req.json()

    // Vérification des données reçues
    if (!taskId || !updatedTask) {
      return NextResponse.json(
        { error: "Task ID and updated task data are required" }, 
        { status: 400 }
      )
    }

    // Vérifier si la tâche existe
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" }, 
        { status: 404 }
      )
    }

    // Mise à jour de la tâche
    const updatedTaskInDb = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: updatedTask.title,
        description: updatedTask.description,
        type: updatedTask.type,
        status: updatedTask.status,
        priority: updatedTask.priority,
        assignee: updatedTask.assignee,
        organisationId: updatedTask.organisationId,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedTaskInDb)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}