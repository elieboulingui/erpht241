import { NextResponse } from 'next/server'
import  prisma from '@/lib/prisma' // Assure-toi que le client Prisma est bien exporté depuis ce chemin

export async function GET() {
  try {
    const orders = await prisma.order.findMany()
   console.log(orders)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
