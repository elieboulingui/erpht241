import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  try {
    // Vérifier si le token existe dans la base de données avec identifier_token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: token.identifier, // Vous devez fournir identifier et token
          token: token.token, 
        },
      },
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token invalide ou expiré." }, { status: 400 })
    }

    // Mettez à jour l'utilisateur comme vérifié
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Supprimez le token après vérification
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
    console.error(error)
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 })
  }
}
