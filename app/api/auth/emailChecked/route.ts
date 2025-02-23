import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  
  // Vérification si l'utilisateur existe
  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      email: true,
      role: true, // Sélectionner le rôle de l'utilisateur
    }
  });

  // Si l'utilisateur existe
  if (user) {
    // Vérification des invitations non acceptées
    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email,
        acceptedAt: null, // Seules les invitations non acceptées
      },
    });

    // Si l'utilisateur a des invitations non acceptées
    if (invitations.length > 0) {
      // Mise à jour de la date d'acceptation pour chaque invitation
      await prisma.invitation.updateMany({
        where: {
          email: user.email,
          acceptedAt: null, // Assurer que l'invitation n'a pas encore été acceptée
        },
        data: {
          acceptedAt: new Date(), // Enregistrer la date actuelle comme date d'acceptation
        },
      });
    }

    // Retourner la réponse avec l'existence de l'utilisateur et son rôle
    return NextResponse.json({ 
      exists: true, 
      invitationsAccepted: true, 
      role: user.role // Inclure le rôle de l'utilisateur
    });
  }

  // Si l'utilisateur n'existe pas
  return NextResponse.json({ exists: false });
}
