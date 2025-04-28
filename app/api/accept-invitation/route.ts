import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Assurer de bien importer ta configuration NextAuth ici
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client"; // Assurer que l'instance Inngest est bien importée
import fetch from "node-fetch"; // Assurer que fetch est bien disponible (en Node.js)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token"); // Récupérer le token depuis l'URL

  try {
    // Vérifier si le token est fourni
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    // Chercher l'invitation dans la base de données
    const invitation = await prisma.invitation.findFirst({
      where: { token },
    });

    // Vérifier si l'invitation existe
    if (!invitation) {
      return NextResponse.json({ error: "Invitation non trouvée" }, { status: 404 });
    }

    // Récupérer la session via NextAuth (avec l'auth) 
    const session = await auth();
    // Vérifier si l'utilisateur est authentifié
    if (!session?.user || !session?.user.id) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    // Récupérer le rôle de l'utilisateur
    const userRole = session?.user.role;

    // Récupérer l'adresse IP du client en faisant une requête à l'API ipify
    const response = await fetch("https://api.ipify.org/?format=json");
    if (!response.ok) {
      throw new Error("Impossible de récupérer l'adresse IP");
    }
    const data = await response.json();
    const ipAddress = data.ip; // L'adresse IP récupérée depuis ipify

    // Mettre à jour l'invitation pour marquer qu'elle a été acceptée
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        acceptedAt: new Date(),
        archivedBy: "System",
        isArchived: true,
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
        actionDetails: `Invitation acceptée et archivée pour le token ${token}`,
        entityName: "Invitation",
        role: userRole,  // Ajouter le rôle de l'utilisateur ici
        ipAddress,       // Ajouter l'adresse IP ici
      },
    });

    // Réponse après l'acceptation et archivage
    return NextResponse.json({ message: "Invitation acceptée et archivée avec succès" });

  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'invitation:", error);
    return NextResponse.json({ error: "Erreur du serveur" }, { status: 500 });
  }
}
