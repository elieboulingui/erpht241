import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { identifier, token } = await req.json()

  if (!identifier || !token) {
    console.error("Données manquantes dans la requête:", { identifier, token })
    return NextResponse.json({ error: "Les données du token sont manquantes." }, { status: 400 })
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    })

    if (!verificationToken) {
      console.error("Token non trouvé pour identifier:", identifier)
      return NextResponse.json({ error: "Token non trouvé." }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    await prisma.verificationToken.update({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    })

    // 🔍 Création du log d’activité
    await prisma.activityLog.create({
      data: {
        action: 'VERIFY_EMAIL',
        entityType: 'User',
        entityId: updatedUser.id,
        newData: {
          emailVerified: updatedUser.emailVerified,
        },
        userId: updatedUser.id,
        relatedUserId: updatedUser.id,
        createdAt: new Date(),
        actionDetails: 'L’utilisateur a vérifié son email avec succès.',
        entityName: updatedUser.email,
      },
    })

    return NextResponse.json({ message: "Token validé et archivé avec succès." })
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error)
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 })
  }
}
