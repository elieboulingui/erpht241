
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { inngest } from '@/inngest/client'; // 👈 Import Inngest

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: 'Token et mot de passe requis.' }, { status: 400 });
  }

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    const userAgent = req.headers.get('user-agent') || null;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('host') || null;

    // 👇 Envoie un événement à Inngest au lieu de loguer direct
    await inngest.send({
      name: 'user/password-reset',
      data: {
        userId: resetToken.userId,
        email: resetToken.user.email,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la réinitialisation du mot de passe.' }, { status: 500 });
  }
}
