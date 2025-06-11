import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // adapte selon ton projet

export async function GET() {
  try {
    const popularProducts = await prisma.orderItemproducts.groupBy({
      by: ["productId"],
      _sum: {
        quantite: true,
      },
      orderBy: {
        _sum: {
          quantite: "desc",
        },
      },
      take: 5,
    })

    const productIds = popularProducts.map((p) => p.productId)

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
      },
    })

    const result = popularProducts.map((pop) => {
      const prod = products.find((p) => p.id === pop.productId)
      return {
        id: pop.productId,
        name: prod?.name ?? "Produit inconnu",
        quantiteVendue: pop._sum.quantite ?? 0,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur API produits populaires :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
