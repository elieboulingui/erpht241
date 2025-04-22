"use server"

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien initialisé
import { auth } from "@/auth" // Assurez-vous que l'authentification est bien configurée

// Fonction pour valider les ID alphanumériques
const validateId = (id: string) => /^[a-zA-Z0-9]+$/.test(id)

export async function devisupdate(request: Request, { params }: { params: { devisId: string } }) {
  const userSession = await auth()
  
  try {
    const devisId = params.devisId
    const { orgId, contactId } = request.url.split("?").slice(1).reduce((acc: any, item: string) => {
      const [key, value] = item.split("=")
      acc[key] = value
      return acc
    }, {})

    if (!validateId(devisId)) {
      return NextResponse.json({ error: "L'ID du devis est invalide" }, { status: 400 })
    }

    if (!userSession || !userSession.user.id) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 })
    }
    const userId = userSession.user.id

    const devisData = await request.json()

    const { notes, pdfUrl, creationDate, dueDate, items } = devisData

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Les items du devis doivent être un tableau valide et non vide." }, { status: 400 })
    }

    // Calcul du montant total, du montant de la taxe, etc.
    const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
    const totalWithTax = items.reduce((sum, item) => sum + (item.totalWithTax || 0), 0)
    // Récupérer l'adresse IP et le User-Agent depuis les entêtes de la requête
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'Inconnu'
    const userAgent = request.headers.get('user-agent') || 'Inconnu'

    // Mise à jour du devis
    const updatedDevis = await prisma.devis.update({
      where: {
        id: devisId,
      },
      data: {
        notes: notes || "Non disponible",
        pdfUrl: pdfUrl || "Non disponible",
        creationDate: creationDate || new Date().toISOString(),
    
        totalAmount,
        taxAmount,
        totalWithTax,
        items: {
          deleteMany: {}, // Supprimer les anciens items avant de les réinsérer
          create: items.map((item: any) => ({
            description: item.description || "Non disponible",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            taxAmount: item.taxAmount,
            totalPrice: item.totalPrice,
            totalWithTax: item.totalWithTax,
            productId: item.productId || null,
          })),
        },
      },
    })

    // Enregistrement dans le journal d'activité
    // await prisma.activityLog.create({
    //   data: {
    //     action: 'UPDATE',
    //     entityType: 'Devis',
    //     entityId: devisId,
    //     entityName: updatedDevis.devisNumber,
    //     oldData: JSON.stringify(updatedDevis), // Ancienne version avant mise à jour
    //     newData: JSON.stringify(updatedDevis), // Nouvelle version après mise à jour
    //     organisationId: orgId,
    //     userId,
    //     createdByUserId: userId,
    //     noteId: null, // Pas de note associée pour un devis
    //     ipAddress,
    //     userAgent,
    //     actionDetails: `Mise à jour du devis ${updatedDevis.devisNumber}.`,
    //   },
    // })

    return NextResponse.json(updatedDevis, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: `Une erreur est survenue: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ error: "Une erreur inconnue est survenue." }, { status: 500 })
  }
}
