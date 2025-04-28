import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { inngest } from "@/inngest/client"
import fetch from "node-fetch" // Assurez-vous que fetch est disponible en Node.js ou dans l'environnement de votre serveur

export async function POST(req: Request) {
  const { email } = await req.json()

  // Récupérer l'utilisateur dans la base de données
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      organisations: {
        select: {
          id: true,
        },
      },
    },
  })

  if (user) {
    // Récupérer les invitations non acceptées
    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email,
        acceptedAt: null,
      },
    })

    // Accepter toutes les invitations non acceptées
    if (invitations.length > 0) {
      await prisma.invitation.updateMany({
        where: {
          email: user.email,
          acceptedAt: null,
        },
        data: {
          acceptedAt: new Date(),
        },
      })
    }

    // Vérifier si l'utilisateur appartient à une organisation
    const hasOrganization = user.organisations.length > 0
    const organisationId = hasOrganization ? user.organisations[0].id : null

    // Récupérer l'adresse IP du client via ipify
    let ipAddress = ""
    try {
      const response = await fetch("https://api.ipify.org/?format=json")
      if (response.ok) {
        const data = await response.json()
        ipAddress = data.ip // Récupérer l'adresse IP
      } else {
        throw new Error("Impossible de récupérer l'adresse IP")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'adresse IP", error)
    }

    // 🔔 Envoi de l'activité à Inngest
    await inngest.send({
      name: "activity/user.login",
      data: {
        action: "LOGIN",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        organisationId,
        actionDetails: `L'utilisateur ${user.email} s'est connecté depuis l'IP ${ipAddress}.`,
        entityName: user.email,
        userRole: user.role,  // Ajouter le rôle de l'utilisateur ici
        ipAddress,            // Ajouter l'adresse IP ici
      },
    })

    return NextResponse.json({
      exists: true,
      invitationsAccepted: invitations.length > 0,
      role: user.role,
      hasOrganization,
      ipAddress,  // Retourner l'adresse IP dans la réponse si nécessaire
    })
  }

  return NextResponse.json({ exists: false })
}
