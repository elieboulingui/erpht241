import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { identifier, token } = await req.json()

  // Vérification si identifier et token existent
  if (!identifier || !token) {
    console.error("Données manquantes dans la requête:", { identifier, token })  // Log des données manquantes
    return NextResponse.json({ error: "Les données du token sont manquantes." }, { status: 400 })
  }

  try {
    // Chercher le token dans la base de données
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,  // email
          token,       // token
        },
      },
    })

    if (!verificationToken) {
      console.error("Token non trouvé pour identifier:", identifier)  // Log si le token n'est pas trouvé
      return NextResponse.json({ error: "Token non trouvé." }, { status: 400 })
    }

    // Si le token est valide, on marque l'utilisateur comme vérifié
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Supprimer le token après validation
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
