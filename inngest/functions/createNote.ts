import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"

export const logNoteCreated = inngest.createFunction(
  {
    id: "log-note-created",
    name: "Log activité - Création de note",
  },
  { event: "activity/note.created" },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      newData,
      organisationId,
      userId,
      createdByUserId,
      contactId,
    } = event.data

    // Adresse IP publique (optionnel)
    let ip = "N/A"
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      ip = data.ip
    } catch (e) {
      console.warn("Impossible de récupérer l'adresse IP")
    }

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        newData: JSON.stringify(newData),
        organisationId,
        userId,
        createdByUserId,
        contactId,
        ipAddress: ip,
      },
    })

    console.log(`📝 Log de création de note pour contact ${contactId}, IP : ${ip}`)
  }
)
