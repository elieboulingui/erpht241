"use server"

import { revalidatePath } from "next/cache"


interface ContactUpdateData {
  name?: string
  email?: string
  phone?: string
  address?: string
  status_contact?: string[]
}

/**
 * Updates a contact's details in the database
 * @param contactId The ID of the contact to update
 * @param data The contact data to update
 */
export async function UpdateContactDetail(contactId: string, data: ContactUpdateData) {
  try {
    // Here you would connect to your database and update the contact record
    // This is a placeholder for your actual database operation
    console.log(`Updating contact ID: ${contactId}`, data)

    // Example database operation (replace with your actual implementation):
    // await db.contact.update({
    //   where: { id: contactId },
    //   data
    // })

    // Revalidate the contact page to reflect the changes
    revalidatePath(`/contact/${contactId}`)

    return { success: true, data }
  } catch (error) {
    console.error("Error updating contact:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}
