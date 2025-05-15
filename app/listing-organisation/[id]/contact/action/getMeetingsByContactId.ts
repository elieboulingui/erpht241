"use server"
import { Meeting } from "@prisma/client"
import prisma from "@/lib/prisma"

const getMeetingsByContactId = async (contactId: string): Promise<Meeting[]> => {
  try {
    return await prisma.meeting.findMany({
      where: { contactId },
      orderBy: { date: "asc" },
    })
  } catch (error) {
    console.error("Error fetching meetings:", error)
    throw new Error("Failed to fetch meetings")
  }
}

export default getMeetingsByContactId
