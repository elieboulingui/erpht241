'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createDocument(documentData: {
  name: string
  type: string
  date: string // Received as a string
  size: string
  status: string
  contactId: string
  url: string // Required here
}) {
  try {
    // Parse the date string into a Date object
    let parsedDate = new Date(documentData.date)

    // If the date is invalid, set it to the current date (Date.now())
    if (isNaN(parsedDate.getTime())) {
      console.warn("La date fournie est invalide, utilisation de la date actuelle.")
      parsedDate = new Date(Date.now()) // Use the current timestamp
    }

    // Create a new document record in the database
    const newDocument = await prisma.document.create({
      data: {
        name: documentData.name,
        type: documentData.type,
        date: parsedDate, // Ensure it's a valid Date
        size: documentData.size,
        status: documentData.status,
        contactId: documentData.contactId,
        url: documentData.url, // Ensure the URL is stored
      },
    })

    return { success: true, document: newDocument }
  } catch (error) {
    console.error('Erreur Prisma:', error)
    return { success: false, error: 'Erreur lors de la création du document.' }
  }
}
