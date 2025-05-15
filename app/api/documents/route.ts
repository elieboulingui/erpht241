import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const contactId = searchParams.get('id')

  if (!contactId) {
    return NextResponse.json({ message: 'Contact ID manquant' }, { status: 400 })
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        contactId: contactId,
      },
      orderBy: {
        date: 'desc',
      },
    })
    console.log(documents)
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Erreur lors de la récupération des documents :', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
