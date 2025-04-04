import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const devisId = url.searchParams.get('devisId')

    if (!devisId) {
      return NextResponse.json(
        { message: 'Devis ID is required' },
        { status: 400 }
      )
    }

    const devis = await prisma.devis.findUnique({
      where: {
        id: devisId, 
      },
      include: {
        items: true,
      },
    })

    if (!devis) {
      return NextResponse.json(
        { message: 'Devis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(devis)
  } catch (error) {
    console.error('Error fetching devis:', error)
    return NextResponse.json(
      { message: 'Error fetching devis data' },
      { status: 500 }
    )
  }
}
