import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    // Extraire noteId depuis l'URL
    const noteId = req.nextUrl.pathname.split("/").at(-2)

    if (!noteId) {
      return new NextResponse("Invalid noteId", { status: 400 })
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        user: true,
        collaborators: true
      }
    })

    if (!note) {
      return new NextResponse("Note not found", { status: 404 })
    }

    return NextResponse.json({
      user: note.user,
      collaborators: note.collaborators
    })
  } catch (error) {
    console.error("[NOTE_COLLABORATORS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Extraire noteId depuis l'URL
    const noteId = req.nextUrl.pathname.split("/").at(-2)

    if (!noteId) {
      return new NextResponse("Invalid noteId", { status: 400 })
    }

    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { collaborators: true }
    })

    if (note?.collaborators.some((collab: { id: any }) => collab.id === user.id)) {
      return new NextResponse("User is already a collaborator", { status: 400 })
    }

    await prisma.note.update({
      where: { id: noteId },
      data: {
        collaborators: {
          connect: { id: user.id }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[NOTE_COLLABORATORS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
