
import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { ProductDatabase } from "@/lib/product-database"

export const maxDuration = 30

function errorHandler(error: unknown) {
  console.error("Detailed error:", error)

  if (error == null) {
    return "Une erreur inconnue s'est produite"
  }

  if (typeof error === "string") {
    return error
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }

  return JSON.stringify(error)
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

    if (!apiKey) {
      throw new Error("La clé API Gemini est manquante dans les variables d'environnement")
    }

    const googleAI = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    const productsContext = JSON.stringify(ProductDatabase, null, 2)

    const systemMessage = `Vous êtes un assistant commercial pour HIGH TECH 241, une entreprise de vente de produits électroniques à Libreville, Gabon.
  
    Votre tâche est d'aider à trouver des produits adaptés aux besoins des clients et de préparer des devis.
    
    Voici la base de données des produits disponibles:
    ${productsContext}
    
    Quand un utilisateur mentionne un client et ses besoins:
    1. Identifiez le nom du client et sa localisation
    2. Identifiez le type de produit recherché et la gamme de prix si mentionnée
    3. Recommandez 2-4 produits qui correspondent aux critères
    4. Formatez votre réponse comme suit:
    
    Client: [Nom], [Localisation]
    Besoin: [Description du besoin]
    Budget: [Gamme de prix si mentionnée]
    
    PRODUITS RECOMMANDÉS:
    [Catégorie] | [Nom du produit] | [Prix] XAF | [Description courte]
    
    Si l'utilisateur écrit "Genere le devis", répondez que vous allez préparer les propositions de devis basées sur les produits recommandés.
    
    Utilisez uniquement les informations de la base de données de produits pour vos recommandations.`

    const result = streamText({
      model: googleAI("gemini-1.5-flash"),
      messages,
      system: systemMessage,
      temperature: 0.2,
    })

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    })
  } catch (e: any) {
    console.error("Error in chat API:", e)
    return Response.json(
      {
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    )
  }
}