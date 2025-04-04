import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { DevisStatus } from "@prisma/client"
import { auth } from "@/auth"

// PUT: Update an existing devis
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Await the params promise to get the id
    const { id: devisId } = await context.params

    if (!devisId) {
      return NextResponse.json({ error: "ID du devis requis" }, { status: 400 })
    }

    // Check if devis exists
    const existingDevis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: { items: true },
    })

    if (!existingDevis) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 })
    }

    const data = await request.json()

    // Start a transaction to update devis and its items
    const updatedDevis = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing items
      await tx.devisItem.deleteMany({
        where: { devisId },
      })

      // 2. Update the devis
      const devis = await tx.devis.update({
        where: { id: devisId },
        data: {
          status: data.status ? (data.status as DevisStatus) : undefined,
          totalAmount: data.totalAmount,
          taxAmount: data.taxAmount,
          totalWithTax: data.totalWithTax,
          notes: data.notes,
          // Don't update creationDate, devisNumber, organisationId, contactId, or createdById
          lastModified: new Date(), // Update the lastModified timestamp
          items: {
            create: data.items.map((item: any) => {
              // Check if productId is a valid ID or null
              let productId = null

              // Only try to use productId if it's a valid string and not a numeric ID
              if (
                (item.productId &&
                  typeof item.productId === "string" &&
                  // Check if it's not just a numeric ID converted to string
                  isNaN(Number(item.productId))) ||
                // Or if it's a valid UUID/CUID format
                /^[a-z0-9]+$/.test(item.productId)
              ) {
                productId = item.productId
              }

              return {
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                totalPrice: item.totalPrice,
                totalWithTax: item.totalWithTax,
                productId: productId, // Use null if not a valid ID
              }
            }),
          },
        },
        include: {
          items: true,
        },
      })

      return devis
    })

    return NextResponse.json(updatedDevis)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du devis" }, { status: 500 })
  }
}