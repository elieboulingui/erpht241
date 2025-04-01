// // app/api/notes/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   // Récupérer le contactId depuis les paramètres de la requête
//   const contactId = req.nextUrl.searchParams.get("contactId");

//   // Vérifier si contactId est fourni, sinon renvoyer une erreur
//   if (!contactId) {
//     return new NextResponse("Contact ID required", { status: 400 });
//   }

//   try {
//     // Récupérer les notes associées au contactId, non archivées
//     const notes = await prisma.note.findMany({
//       where: {
//         contactId,
//         isArchived: false, // Assurez-vous que la note n'est pas archivée
//       },
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         color: true,
//         isPinned: true,
//       },
//     });

//     // Afficher les notes dans la console (facultatif pour le débogage)
//     console.log(notes);

//     // Retourner les notes au format JSON
//     return NextResponse.json(notes);
//   } catch (error) {
//     // Gestion des erreurs (erreur interne serveur)
//     console.error("[NOTES_GET]", error);
//     return new NextResponse(
//       error instanceof Error ? error.message : "Internal error",
//       { status: 500 }
//     );
//   }
// }




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
        isArchived: false, // Assurez-vous que la note n'est pas archivée
      },
      select: {
        id: true,
        title: true,
        content: true,
        color: true,
        isPinned: true,
      },
    })

    // Afficher les notes dans la console (facultatif pour le débogage)
    console.log(notes)

    // Retourner les notes au format JSON
    return NextResponse.json(notes)
  } catch (error) {
    // Gestion des erreurs (erreur interne serveur)
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

    // Utiliser directement GoogleGenerativeAI comme dans votre exemple initial
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

    if (!apiKey) {
      console.error("[NOTES_GENERATE] API key is missing")
      return NextResponse.json({ error: "Configuration API manquante" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Écris une note détaillée basée sur ce titre: "${title}". La note doit être professionnelle, informative et pertinente pour un système de gestion de contacts.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("[NOTES_GENERATE]", error)
    return NextResponse.json({ error: "Erreur lors de la génération du contenu" }, { status: 500 })
  }
}

