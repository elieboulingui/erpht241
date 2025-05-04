"use server"

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"

// Fonction de validation d'ID
const validateId = (id: string) => /^[a-zA-Z0-9]+$/.test(id)

export async function devisupdate(request: Request, { params }: { params: { devisId: string } }) {
  const userSession = await auth()

  try {
    const devisId = params.devisId

    // 🔎 Extraction des paramètres depuis l'URL
    const url = new URL(request.url)
    const orgId = url.searchParams.get("orgId") || undefined
    const contactId = url.searchParams.get("contactId") || undefined

    if (!validateId(devisId)) {
      return NextResponse.json({ error: "L'ID du devis est invalide" }, { status: 400 })
    }

    if (!orgId || !validateId(orgId)) {
      return NextResponse.json({ error: "L'ID de l'organisation est invalide" }, { status: 400 })
    }

    if (!userSession || !userSession.user?.id) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 })
    }

    const userId = userSession.user.id
    const devisData = await request.json()
    const { notes, pdfUrl, creationDate, dueDate, items } = devisData

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Les items du devis doivent être un tableau valide et non vide." }, { status: 400 })
    }

    // ✅ Vérification des champs obligatoires dans les items
    for (const item of items) {
      if (!item.description || typeof item.quantity !== "number" || typeof item.unitPrice !== "number") {
        return NextResponse.json({ error: "Certains champs des items sont invalides." }, { status: 400 })
      }
    }

    // 🔁 Récupération de l'ancien devis avant mise à jour
    const oldDevis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: { items: true },
    })

    if (!oldDevis) {
      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })
    }

    // 💰 Calculs des montants
    const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
    const totalWithTax = items.reduce((sum, item) => sum + (item.totalWithTax || 0), 0)

    // 🌐 Récupération de l’IP publique via ipify
    const ipRes = await fetch("https://api.ipify.org?format=json")
    const { ip: ipAddress } = await ipRes.json()
    const userAgent = request.headers.get("user-agent") || "Inconnu"

    // 🛠️ Mise à jour du devis avec réécriture des items
    const updatedDevis = await prisma.devis.update({
      where: { id: devisId },
      data: {
        notes: notes || "Non disponible",
        pdfUrl: pdfUrl || "Non disponible",
        creationDate: creationDate ? new Date(creationDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        totalAmount,
        taxAmount,
        totalWithTax,
        items: {
          deleteMany: {},
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

    // 📩 Envoi de l’événement Inngest pour log
    await inngest.send({
      name: "activity/devis.updated",
      data: {
        oldDevis,
        devis: updatedDevis,
        userId,
        organisationId: orgId,
        contactId,
        ipAddress,
        userAgent,
        actionDetails: `Mise à jour du devis ${updatedDevis.devisNumber}.`,
      },
    })

    return NextResponse.json(updatedDevis, { status: 200 })

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur dans la mise à jour du devis:", error)
      return NextResponse.json({ error: `Une erreur est survenue: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ error: "Une erreur inconnue est survenue." }, { status: 500 })
  }
}
