import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { inngest } from "@/inngest/client";
// ============================
// GET: Récupérer les notes d'un contact
// ============================
export async function GET(req: NextRequest) {
  const contactId = req.nextUrl.searchParams.get("contactId")

  if (!contactId) {
    return new NextResponse("Contact ID required", { status: 400 })
  }

  try {
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
    return new NextResponse(error instanceof Error ? error.message : "Internal error", {
      status: 500,
    })
  }
}

// ============================
// POST: Générer du contenu de note avec l'IA
// ============================
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

    const prompt = `Crée une description courte et simple (1-2 phrases maximum) pour une note intitulée "${title}". 
La description doit être concise et professionnelle, comme dans un système de gestion de contacts. 
Exemple de format attendu:
"Description : [texte descriptif court]"

Ne génère rien d'autre que cette description.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const cleanText = text.trim()
      .replace(/^"|"$/g, "")
      .replace(/^Description\s*:\s*/i, "")

    const formattedContent = `Description :\n${cleanText}`

    // 🆕 Envoi de l'événement à Inngest
    await inngest.send({
      name: "activity/note.created",
      data: {
        action: "note.generated",
        entityType: "Note",
        entityId: "note-ai-draft", // ID temporaire ou null selon ton flux
        newData: {
          title,
          content: formattedContent,
        },
        userId: null, // Passe l'ID de l'utilisateur si tu l’as dans le contexte
      },
    })

    return NextResponse.json({ content: formattedContent })
  } catch (error) {
    console.error("[NOTES_GENERATE]", error)
    return NextResponse.json({ error: "Erreur lors de la génération du contenu" }, { status: 500 })
  }
}
