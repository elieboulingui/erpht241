// app/api/notes/[noteId]/collaborators/route.ts
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { noteId: string } }) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.noteId },
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

export async function POST(req: NextRequest, { params }: { params: { noteId: string } }) {
  try {
    const { email } = await req.json()
    
    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Vérifier si l'utilisateur est déjà collaborateur
    const note = await prisma.note.findUnique({
      where: { id: params.noteId },
      include: { collaborators: true }
    })

    if (note?.collaborators.some(collab => collab.id === user.id)) {
      return new NextResponse("User is already a collaborator", { status: 400 })
    }

    // Ajouter l'utilisateur comme collaborateur
    await prisma.note.update({
      where: { id: params.noteId },
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