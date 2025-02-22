import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  
  // Vérification si l'utilisateur existe
  const user = await prisma.user.findUnique({ where: { email } });

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

    return NextResponse.json({ exists: true, invitationsAccepted: true });
  }

  // Si l'utilisateur n'existe pas
  return NextResponse.json({ exists: false });
}
