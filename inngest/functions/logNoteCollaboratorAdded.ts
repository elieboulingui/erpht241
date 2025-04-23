// /inngest/functions/logNoteCollaboratorAdded.ts
import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"

export const logNoteCollaboratorAdded = inngest.createFunction(
  { id: "log-note-collaborator-added" },
  { event: "note/collaborator.added.log-only" },
  async ({ event }) => {
    const { noteId, addedUser, ownerId, organisationId } = event.data

    await prisma.activityLog.create({
      data: {
        action: "ADD_NOTE_COLLABORATOR",
        entityType: "Note",
        entityId: noteId,
        organisationId,
        userId: ownerId,
        createdByUserId: ownerId,
        newData: JSON.stringify(addedUser),
        actionDetails: `Ajout de ${addedUser.name || addedUser.email} comme collaborateur de la note.`,
        entityName: "Note",
      },
    })

    return { success: true }
  }
)
