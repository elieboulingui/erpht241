"use server"

import { Meeting, MeetingType } from "@prisma/client"
import prisma from "@/lib/prisma"

// 🔧 Convertit une date "DD/MM/YYYY" → "YYYY-MM-DD"
const convertToISODate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("/")
  return `${year}-${month}-${day}`
}

// 🔁 Mappe les labels utilisateurs vers les enums Prisma
const labelToType: Record<string, MeetingType> = {
  "Présentiel": "meeting",
  "Téléphonique": "call",
  "Visioconférence": "video",
}

const createMeeting = async (
  data: Omit<Meeting, "id" | "createdAt" | "date" | "type"> & {
    contactId: string
    participants?: string[]
    date: string | Date
    type: string // le type en format lisible (UI)
  }
): Promise<Meeting> => {
  try {
    let parsedDate: Date

    // 🗓️ Convertir la date
    if (typeof data.date === "string") {
      const isoDateStr = convertToISODate(data.date)
      parsedDate = new Date(isoDateStr)
    } else {
      parsedDate = data.date
    }

    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date value: ${data.date}`)
    }

    const isoDate = parsedDate.toISOString()

    // 🧠 Convertir le type de string lisible vers enum Prisma
    const prismaType = labelToType[data.type]
    if (!prismaType) {
      throw new Error(`Invalid meeting type: ${data.type}`)
    }

    // Créer l'objet de création
    const { participants, ...rest } = data

    const createData: any = {
      ...rest,
      type: prismaType, // ✔️ Enum correct
      date: isoDate,
      createdAt: new Date().toISOString(),
    }

    // 🔗 Ajout des participants si présent
    if (participants && participants.length > 0) {
      createData.participants = {
        connect: participants.map((id) => ({ id })),
      }
    }

    // 📦 Envoi à Prisma
    return await prisma.meeting.create({
      data: createData,
    })
  } catch (error) {
    console.error("Error creating meeting:", error)
    throw new Error("Failed to create meeting")
  }
}

export default createMeeting
