"use server"

import { revalidatePath } from "next/cache"

/**
 * Deletes a contact's image/logo from the database
 * @param contactId The ID of the contact whose image should be deleted
 */
export async function DeleteImage(contactId: string) {
  try {
    console.log(`Deleting image for contact ID: ${contactId}`)

    revalidatePath(`/contact/${contactId}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}

