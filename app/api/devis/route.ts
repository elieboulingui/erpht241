import { NextResponse } from "next/server"
import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien initialisé
import { auth } from "@/auth" // Assurez-vous que l'authentification est bien configurée

// Fonction de validation pour les ID alphanumériques
const validateId = (id: string) => /^[a-zA-Z0-9]+$/.test(id)

// Fonction pour extraire les paramètres de l'URL
const extractParamsFromUrl = (url: string): { orgId?: string; contactId?: string } => {
  const searchParams = new URL(url).searchParams
  return {
    orgId: searchParams.get("organisationId") || undefined,
    contactId: searchParams.get("contactId") || undefined,
  }
}

// Fonction pour générer un numéro de devis unique
const generateDevisNumber = () => {
  // Format: HT + date + nombre aléatoire
  const date = new Date()
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear().toString().slice(2)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `HT${day}${month}${year}${random}`
}

export async function POST(request: Request) {
  try {
    const url = request.url
    console.log("Request URL:", url)

    const { orgId, contactId } = extractParamsFromUrl(url)
    console.log("Organisation ID extrait:", orgId)
    console.log("Contact ID extrait:", contactId)

    if (!orgId || !validateId(orgId)) {
      console.error("Erreur: L'ID de l'organisation est invalide")
      return NextResponse.json({ error: "L'ID de l'organisation est invalide" }, { status: 400 })
    }

    if (!contactId || !validateId(contactId)) {
      console.error("Erreur: L'ID du contact est invalide")
      return NextResponse.json({ error: "L'ID du contact est invalide" }, { status: 400 })
    }

    const userSession = await auth()
    if (!userSession || !userSession.user.id) {
      console.error("Erreur: Utilisateur non authentifié")
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 })
    }

    const userId = userSession.user.id
    console.log("Utilisateur authentifié ID:", userId)

    const devisData = await request.json()
    console.log("Données reçues:", devisData)

    const { notes, pdfUrl, creationDate, dueDate, items } = devisData

    if (!Array.isArray(items) || items.length === 0) {
      console.error("Erreur: Les items ne sont pas valides", items)
      return NextResponse.json(
        { error: "Les items du devis doivent être un tableau valide et non vide." },
        { status: 400 },
      )
    }

    for (const item of items) {
      if (!item.description || typeof item.quantity !== "number" || typeof item.unitPrice !== "number") {
        console.error("Erreur: Un item est invalide", item)
        return NextResponse.json({ error: "Certains champs des items sont invalides." }, { status: 400 })
      }
    }

    const currentDate = new Date().toISOString()
    const finalCreationDate = creationDate || currentDate
    const finalDueDate = dueDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()

    const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
    const totalWithTax = items.reduce((sum, item) => sum + (item.totalWithTax || 0), 0)

    const devis = await prisma.devis.create({
      data: {
        devisNumber: generateDevisNumber(), // Utiliser notre fonction de génération de numéro
        taxType: "HORS_TAXE",
        totalAmount,
        taxAmount,
        totalWithTax,
        contactId,
        organisationId: orgId,
        createdById: userId,
        notes: notes || "Non disponible",
        pdfUrl: pdfUrl || "Non disponible",
        items: {
          create: items.map((item: any) => ({
            description: item.description || "Non disponible",
            quantity: typeof item.quantity === "number" ? item.quantity : 0,
            unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : 0,
            taxRate: typeof item.taxRate === "number" ? item.taxRate : 0,
            taxAmount: typeof item.taxAmount === "number" ? item.taxAmount : 0,
            totalPrice: typeof item.totalPrice === "number" ? item.totalPrice : 0,
            totalWithTax: typeof item.totalWithTax === "number" ? item.totalWithTax : 0,
            productId: item.productId || null,
          })),
        },
      },
    })

    console.log("Devis créé avec succès:", devis)
    return NextResponse.json(devis, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur interne:", error.message)
      return NextResponse.json(
        { error: "Une erreur interne est survenue lors de la création du devis." },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: "Une erreur inconnue est survenue." }, { status: 500 })
  }
}

