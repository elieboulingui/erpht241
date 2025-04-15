import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import prisma from "@/lib/prisma"
import  ActivityLog  from "@prisma/client" // Assuming you have ActivityLog model in Prisma

export const maxDuration = 30

function errorHandler(error: unknown) {
  console.error("Detailed error:", error)

  if (error == null) return "Une erreur inconnue s'est produite"
  if (typeof error === "string") return error
  if (error instanceof Error) return `${error.name}: ${error.message}`

  return JSON.stringify(error)
}

// ✅ Utilitaire pour extraire l'ID de l'organisation depuis l'URL
function extractOrganisationIdFromUrl(url: string | null): string | null {
  if (!url) return null
  const match = url.match(/\/listing-organisation\/([a-z0-9]+)\/contact/)
  return match?.[1] ?? null
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

    if (!apiKey) {
      throw new Error("La clé API Gemini est manquante dans les variables d'environnement")
    }

    const referer = req.headers.get("referer")
    const organisationId = extractOrganisationIdFromUrl(referer)

    if (!organisationId) {
      throw new Error("Impossible de récupérer l'ID de l'organisation depuis l'URL")
    }

    const googleAI = createGoogleGenerativeAI({ apiKey })

    // ✅ Récupération des produits de cette organisation avec leur(s) catégorie(s)
    const products = await prisma.product.findMany({
      where: { organisationId },
      select: {
        name: true,
        price: true,
        description: true,
        categories: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!products.length) {
      throw new Error("Aucun produit trouvé pour cette organisation")
    }

    // ✅ Formatage simple pour Gemini
    const simplifiedProducts = products.map((p: { name: any; price: any; description: any; categories: any[] }) => ({
      nom: p.name,
      prix: p.price,
      description: p.description,
      categories: p.categories.map((c) => c.name).join(", "),
    }))

    const productsContext = JSON.stringify(simplifiedProducts, null, 2)

    const systemMessage = `Vous êtes un assistant commercial pour HIGH TECH 241, une entreprise de vente de produits électroniques à Libreville, Gabon.

Votre tâche est d'aider à trouver des produits adaptés aux besoins des clients et de préparer des devis.

Voici la base de données des produits disponibles:
${productsContext}

Règles de conversation:
1. Lorsqu'un client et ses besoins sont mentionnés:
   - Identifiez le nom du client et sa localisation
   - Identifiez le type de produit recherché et la gamme de prix si mentionnée
   - Recommandez 2-4 produits qui correspondent aux critères
   - Formatez votre réponse comme suit:

Besoin: [Description du besoin]
Budget: [Gamme de prix si mentionnée]

PRODUITS RECOMMANDÉS:
[Catégorie] | [Nom du produit] | [Prix] XAF | [Description courte]

2. Si l'utilisateur change de sujet ou mentionne un nouveau client:
   - Ne maintenez pas les anciennes recommandations
   - Traitez la nouvelle demande indépendamment
   - Ne mentionnez pas les produits précédents

3. Si l'utilisateur écrit "Genere le devis":
   - Confirmez la génération du devis uniquement si des produits ont été recommandés dans le dernier message
   - Sinon, demandez d'abord des informations sur le client et ses besoins

4. Pour les questions générales ou les changements de sujet:
   - Répondez naturellement sans faire référence aux anciennes recommandations
   - Ne proposez pas de produits sauf si explicitement demandé

5. Format des réponses:
   - Pour les recommandations: toujours utiliser le format précis avec "PRODUITS RECOMMANDÉS:"
   - Pour les autres réponses: répondre de manière naturelle et concise

Utilisez uniquement les informations de la base de données de produits pour vos recommandations.`

    const result = streamText({
      model: googleAI("gemini-1.5-flash"),
      messages,
      system: systemMessage,
      temperature: 0.2,
    })

    // ✅ Log the activity
    const activityLogData = {
      action: "Product recommendation request",
      entityType: "Organisation",
      entityId: organisationId,
      actionDetails: "Request for product recommendations based on user input.",
      organisationId,
      createdByUserId: null, // Optional, add logic if user data available
      ipAddress: req.headers.get("x-forwarded-for") || null,
      userAgent: req.headers.get("user-agent"),
    }

    await prisma.activityLog.create({
      data: activityLogData,
    })

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    })
  } catch (e: any) {
    console.error("Error in chat API:", e)

    // Log error in activity log
    await prisma.activityLog.create({
      data: {
        action: "Error during product recommendation request",
        entityType: "Organisation",
        entityId: "",
        actionDetails: e.message,
        organisationId: "",
        createdByUserId: null, // Optional, add logic if user data available
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent"),
      }
    })

    return Response.json(
      {
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    )
  }
}
