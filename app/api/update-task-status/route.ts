import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function POST(req: NextRequest) {
  try {
    const { taskId, newStatus } = await req.json();

    if (!taskId || !newStatus) {
      return NextResponse.json(
        { error: "Task ID and new status are required" },
        { status: 400 }
      );
    }

    const oldTask = await prisma.task.findUnique({ where: { id: taskId } });

    if (!oldTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    // 👉 Envoi de l'événement Inngest pour le logging
    await inngest.send({
      name: "task/status.updated.log-only",
      data: {
        taskId,
        oldData: oldTask,
        newData: updatedTask,
        userId: updatedTask.createdById,
        organisationId: updatedTask.organisationId,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de la tâche" },
      { status: 500 }
    );
  }
}
