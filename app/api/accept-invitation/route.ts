import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";  // Assure-toi d'importer l'instance d'Inngest

// Fonction GET pour accepter l'invitation en utilisant le token dans l'URL
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token"); // Récupérer le token depuis l'URL

  try {
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    // Chercher l'invitation dans la base de données
    const invitation = await prisma.invitation.findFirst({
      where: {
        token: token, // Vérifier si le token correspond à un enregistrement
      },
    });

    // Vérifier si l'invitation existe
    if (!invitation) {
      return NextResponse.json({ error: "Invitation non trouvée" }, { status: 404 });
    }

    // Mettre à jour l'invitation pour marquer qu'elle a été acceptée
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        acceptedAt: new Date(), // Marquer la date d'acceptation
        archivedBy: "System",  // Vous pouvez remplacer par l'ID de l'utilisateur qui accepte
        isArchived: true,      // Marquer comme archivée
      },
    });

    // 🔄 Envoi de l'événement via Inngest (asynchrone)
    await inngest.send({
      name: "activity/invitation.accepted",
      data: {
        action: "INVITATION_ACCEPTED",
        entityType: "Invitation",
        entityId: invitation.id,
        oldData: invitation,
        newData: {
          ...invitation,
          acceptedAt: new Date(),
          isArchived: true,
        },
        userId: invitation.invitedById, // Utilisateur qui a créé l'invitation
        actionDetails: `Invitation acceptée et archivée par le système pour le token ${token}`,
        entityName: "Invitation",
      },
    });

    // Réponse après l'acceptation et archivage
    return NextResponse.json({ message: "Invitation acceptée et archivée avec succès" });
  } catch (error) {
    // Gérer l'erreur du serveur
    console.error("Erreur lors de l'acceptation de l'invitation:", error);
    return NextResponse.json({ error: "Erreur du serveur" }, { status: 500 });
  }
}
