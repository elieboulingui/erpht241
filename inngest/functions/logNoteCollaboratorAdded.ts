import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logNoteCollaboratorAdded = inngest.createFunction(
  { id: "log-note-collaborator-added" },
  { event: "note/collaborator.added.log-only" },
  async ({ event }) => {
    const { noteId, addedUser, ownerId, organisationId, ipAddress: eventIp } = event.data;

    // 🔁 Récupérer l'IP si elle n'est pas incluse dans l'événement
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown";
      }
    }

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
        ipAddress, // ✅ Ajout de l'adresse IP ici
      },
    });

    return { success: true };
  }
);
