import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Fonction utilitaire pour formater une date au format DD/MM/YYYY
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR').format(date)
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const devisId = url.searchParams.get('devisId')

    if (!devisId) {
      return NextResponse.json(
        { message: 'Le paramètre "devisId" est requis.' },
        { status: 400 }
      )
    }

    const devis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: {
        items: true,
      },
    })

    if (!devis) {
      return NextResponse.json(
        { message: 'Devis introuvable.' },
        { status: 404 }
      )
    }

    // Formater les dates
    const formattedDevis = {
      ...devis,
      creationDate: formatDate(devis.creationDate),
      dueDate: devis.dueDate ? formatDate(devis.dueDate) : null,
    }

    return NextResponse.json(formattedDevis)
  } catch (error) {
    console.error('Erreur lors de la récupération du devis :', error)
    return NextResponse.json(
      { message: 'Erreur serveur lors de la récupération du devis.' },
      { status: 500 }
    )
  }
}
