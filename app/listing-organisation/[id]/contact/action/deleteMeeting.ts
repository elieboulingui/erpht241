"use server"
import prisma from "@/lib/prisma"

const deleteMeeting = async (id: string): Promise<void> => {
  try {
    await prisma.meeting.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Error deleting meeting:", error)
    throw new Error("Failed to delete meeting")
  }
}

export default deleteMeeting
