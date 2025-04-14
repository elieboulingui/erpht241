import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(request: Request) {
  try {
    // Récupérer la session de l'utilisateur
    const session = await auth()

    if (!session?.user) {
      console.log("Utilisateur non authentifié")
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 })
    }

    const ownerId = session.user.id
    console.log("ID du propriétaire:", ownerId)

    // Récupérer et parser le corps de la requête
    let body
    try {
      body = await request.json()
      console.log("Corps de la requête:", body)
    } catch (error) {
      console.error("Erreur lors du parsing du corps de la requête:", error)
      return NextResponse.json({ error: "Format de requête invalide" }, { status: 400 })
    }

    const { name, slug, logo, domain } = body

    // Validation des données
    if (!name) {
      console.log("Nom manquant")
      return NextResponse.json({ error: "Le nom de l'organisation est requis" }, { status: 400 })
    }

    if (!slug) {
      console.log("Slug manquant")
      return NextResponse.json({ error: "Le slug de l'organisation est requis" }, { status: 400 })
    }

    if (!domain) {
      console.log("Domaine manquant")
      return NextResponse.json({ error: "Le domaine de l'organisation est requis" }, { status: 400 })
    }

    // Liste des valeurs de domaine valides
    const validDomains = [
      "AGRICULTURE", "ENERGIE", "LOGISTIQUE", "NUMERIQUE", "SECURITE", 
      "TRANSPORT", "INFORMATIQUE", "SANTE", "EDUCATION", "FINANCE", 
      "COMMERCE", "CONSTRUCTION", "ENVIRONNEMENT", "TOURISME", "INDUSTRIE", 
      "TELECOMMUNICATIONS", "IMMOBILIER", "ADMINISTRATION", "ART_CULTURE", "ALIMENTATION"
    ]

    // Convertir le domaine en majuscules pour correspondre aux valeurs de l'énumération
    const domainValue = domain.toUpperCase()

    // Vérification si le domaine est valide
    if (!validDomains.includes(domainValue)) {
      console.log("Domaine invalide:", domainValue)
      return NextResponse.json({ error: "Le domaine spécifié n'est pas valide" }, { status: 400 })
    }

    // Vérifier que l'utilisateur existe
    try {
      const ownerExists = await prisma.user.findUnique({
        where: { id: ownerId },
      })

      if (!ownerExists) {
        console.log("Utilisateur non trouvé:", ownerId)
        return NextResponse.json({ error: "L'utilisateur propriétaire spécifié n'existe pas" }, { status: 404 })
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error)
      return NextResponse.json({ error: "Erreur lors de la vérification de l'utilisateur" }, { status: 500 })
    }

    // Vérifier que le slug n'existe pas déjà
    try {
      const existingSlug = await prisma.organisation.findUnique({
        where: { slug },
      })

      if (existingSlug) {
        console.log("Slug déjà existant:", slug)
        return NextResponse.json({ error: "Le slug spécifié existe déjà" }, { status: 400 })
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du slug:", error)
      return NextResponse.json({ error: "Erreur lors de la vérification du slug" }, { status: 500 })
    }

    // Créer l'organisation avec tous les champs
    const organisation = await prisma.organisation.create({
      data: {
        name,
        slug,
        logo,
        ownerId,
        domain: domainValue, // Utilisation du domaine validé
        createdByUserId: ownerId, // Ajouter l'utilisateur qui a créé l'organisation
      },
    })

    console.log("Organisation créée avec succès:", organisation)

    // Log de l'activité
    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        entityType: "Organisation",
        entityId: organisation.id,
        oldData: undefined, 
        newData: JSON.stringify(organisation),
        userId: ownerId,
        organisationId: organisation.id,
        createdByUserId: ownerId, // Le propriétaire est celui qui a créé l'activité log
        actionDetails: `Création de l'organisation ${name}`,
        entityName: name,
      },
    })

    return NextResponse.json({ message: "Organisation créée avec succès", organisation }, { status: 201 })
  } catch (error) {
    console.error("Erreur générale:", error)
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la création de l'organisation" },
      { status: 500 },
    )
  }
}
