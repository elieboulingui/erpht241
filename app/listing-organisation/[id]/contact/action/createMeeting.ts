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
    type: string
  }
): Promise<Meeting> => {
  try {
    // 🗓️ Convertir la date
    const parsedDate =
      typeof data.date === "string"
        ? new Date(convertToISODate(data.date))
        : data.date

    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date value: ${data.date}`)
    }

    const isoDate = parsedDate.toISOString()

    // 🧠 Convertir type utilisateur -> enum Prisma
    const prismaType = labelToType[data.type]
    if (!prismaType) {
      throw new Error(`Invalid meeting type: ${data.type}`)
    }

    const { participants, ...rest } = data

    // 👇 On retire manuellement `id` si jamais il est présent par erreur
    const { id, ...safeData } = rest as any

    const createData: any = {
      ...safeData,
      type: prismaType,
      date: isoDate,
      createdAt: new Date(),
    }

    if (participants?.length) {
      createData.participants = {
        connect: participants.map((id) => ({ id })),
      }
    }

    // ✅ Prisma gère automatiquement l'id
    return await prisma.meeting.create({
      data: createData,
    })
  } catch (error: any) {
    console.error("Error creating meeting:", error)
    if (error.code === "P2002") {
      throw new Error("Une réunion avec cet ID existe déjà.")
    }
    throw new Error("Failed to create meeting")
  }
}

export default createMeeting
