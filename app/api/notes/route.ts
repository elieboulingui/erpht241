import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

// GET: Récupérer les notes d'un contact
export async function GET(req: NextRequest) {
  // Récupérer le contactId depuis les paramètres de la requête
  const contactId = req.nextUrl.searchParams.get("contactId")

  // Vérifier si contactId est fourni, sinon renvoyer une erreur
  if (!contactId) {
    return new NextResponse("Contact ID required", { status: 400 })
  }

  try {
    // Récupérer les notes associées au contactId, non archivées
    const notes = await prisma.note.findMany({
      where: {
        contactId,
        isArchived: false,
      },
      select: {
        id: true,
        title: true,
        content: true,
        color: true,
        isPinned: true,
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("[NOTES_GET]", error)
    return new NextResponse(error instanceof Error ? error.message : "Internal error", { status: 500 })
  }
}

// POST: Générer du contenu de note avec l'IA
export async function POST(request: Request) {
  try {
    const { title } = await request.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Un titre valide est requis" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

    if (!apiKey) {
      console.error("[NOTES_GENERATE] API key is missing")
      return NextResponse.json({ error: "Configuration API manquante" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Nouveau prompt pour obtenir une description courte
    const prompt = `Crée une description courte et simple (1-2 phrases maximum) pour une note intitulée "${title}". 
    La description doit être concise et professionnelle, comme dans un système de gestion de contacts. 
    Exemple de format attendu:
    "Description : [texte descriptif court]"
    
    Ne génère rien d'autre que cette description.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Nettoyer la réponse si nécessaire
    const cleanText = text.trim()
      .replace(/^"|"$/g, '') // Enlever les guillemets si présents
      .replace(/^Description\s*:\s*/i, '') // Enlever le préfixe "Description :" si présent

    // Reformater avec le style souhaité
    const formattedContent = `Description :\n${cleanText}`

    return NextResponse.json({ content: formattedContent })
  } catch (error) {
    console.error("[NOTES_GENERATE]", error)
    return NextResponse.json({ error: "Erreur lors de la génération du contenu" }, { status: 500 })
  }
}