"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { auth } from "@/auth";

interface CreateNoteParams {
  contactId: string;
  title: string;
  content: string;
  color?: string; // La couleur peut être facultative
  isPinned?: boolean; // La note peut être épinglée ou non
}

export async function CreateNote({
  contactId, title, content, color = "default", isPinned = false
}: CreateNoteParams) {
  try {
    // Get the current user
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour créer une note"
      }
    }

    // Crée la note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        color,
        isPinned,
        contactId,
        userId: session.user.id,
      }
    })

    // Revalider le chemin pour mettre à jour la page du contact
    revalidatePath(`/contact/${contactId}`)

    return {
      success: true,
      data: note
    }
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la note"
    }
  }
}
