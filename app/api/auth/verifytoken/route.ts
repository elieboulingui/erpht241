import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  // Vérifiez si l'identifier et le token existent
  if (!token || !token.identifier || !token.token) {
    return NextResponse.json({ error: "Les données du token sont manquantes." }, { status: 400 })
  }

  try {
    // Trouver le token dans la base de données sans validation
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: token.identifier, // L'email
          token: token.token,           // Le token envoyé
        },
      },
    })

    // Si le token n'existe pas, retourner une erreur, sinon continuer
    if (!verificationToken) {
      return NextResponse.json({ error: "Token non trouvé." }, { status: 400 })
    }

    // Mettre à jour l'utilisateur comme vérifié
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Supprimer le token après vérification
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    })

    return NextResponse.json({ message: "Token validé avec succès." })
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error)
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 })
  }
}
