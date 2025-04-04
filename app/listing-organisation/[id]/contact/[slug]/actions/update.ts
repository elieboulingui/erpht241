"use server"
import prisma from "@/lib/prisma";
 // Adjust import path to your Prisma client
import { Prisma, TaskType, TaskStatus, Task } from "@prisma/client"; // Import Prisma's types
export async function update({ taskId, updatedTask }: { taskId: string; updatedTask: Partial<Task> }) {
    const taskUpdateData: Prisma.TaskUpdateInput = {
      ...updatedTask,
      type: updatedTask.type ? { set: updatedTask.type as TaskType } : undefined,
      status: updatedTask.status ? { set: updatedTask.status as TaskStatus } : undefined,
    };
  
    try {
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: taskUpdateData,
      });
  
      return new Response(JSON.stringify(updated), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Task update failed", { status: 500 });
    }
  }
  