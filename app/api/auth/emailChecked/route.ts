import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { inngest } from "@/inngest/client"

export async function POST(req: Request) {
  const { email } = await req.json()

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
    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email,
        acceptedAt: null,
      },
    })

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

    const hasOrganization = user.organisations.length > 0
    const organisationId = hasOrganization ? user.organisations[0].id : null

    // 🔔 Envoi de l'activité à Inngest
    await inngest.send({
      name: "activity/user.login",
      data: {
        action: "LOGIN",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        organisationId,
        actionDetails: `L'utilisateur ${user.email} s'est connecté.`,
        entityName: user.email,
      },
    })

    return NextResponse.json({
      exists: true,
      invitationsAccepted: invitations.length > 0,
      role: user.role,
      hasOrganization,
    })
  }

  return NextResponse.json({ exists: false })
}
