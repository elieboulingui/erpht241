import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assurez-vous d'avoir correctement configuré Prisma
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json(); // On récupère le corps de la requête POST

  // Vérification si le token et le mot de passe sont fournis
  if (!token || !password) {
    return NextResponse.json({ error: 'Token et mot de passe requis.' }, { status: 400 });
  }

  try {
    // Recherche du token dans la base de données
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Vérification si le token existe et s'il n'est pas expiré
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 400 });
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mise à jour du mot de passe dans la base de données
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Suppression du token après son utilisation
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Log de l'activité de réinitialisation de mot de passe
    await prisma.activityLog.create({
      data: {
        action: 'PASSWORD_RESET',
        entityType: 'User',
        entityId: resetToken.userId,
        newData: {
          message: 'Mot de passe mis à jour',
        },
        userId: resetToken.userId,
        organisationId: null,
        createdByUserId: null,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('host') || null,
        userAgent: req.headers.get('user-agent') || null,
        actionDetails: `L'utilisateur ${resetToken.user.email} a réinitialisé son mot de passe.`,
        entityName: resetToken.user.email,
      },
    });

    return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la réinitialisation du mot de passe.' }, { status: 500 });
  }
}
