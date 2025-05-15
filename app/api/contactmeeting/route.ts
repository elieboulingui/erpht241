// app/api/meetingcontact/route.ts
import { NextRequest } from "next/server"
import  prisma  from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing contact ID" }), { status: 400 })
  }

  try {
    const meetings = await prisma.meeting.findMany({
      where: { contactId: id },
      include: {
        contact: true,
        participants: true,
      },
    })

    return new Response(JSON.stringify(meetings), { status: 200 })
  } catch (error) {
    console.error("Error fetching meetings:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}