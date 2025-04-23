import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { inngest } from "@/inngest/client";
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
    const urlParts = req.nextUrl.pathname.split("/");

    // 🔍 Extraire organisationId après "listing-organisation"
    const organisationIdIndex = urlParts.findIndex(part => part === "listing-organisation");
    const organisationId = organisationIdIndex !== -1 ? urlParts[organisationIdIndex + 1] : null;

    // 🔍 Extraire noteId depuis la fin de l’URL
    const noteId = urlParts.at(-2); // ex: "/contact/[noteId]"

    if (!noteId || !organisationId) {
      return new NextResponse("Invalid noteId or organisationId", { status: 400 });
    }

    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { collaborators: true, user: true },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const alreadyCollaborator = note.collaborators.some(collab => collab.id === user.id);
    if (alreadyCollaborator) {
      return new NextResponse("User is already a collaborator", { status: 400 });
    }

    // ✅ Ajout du collaborateur
    await prisma.note.update({
      where: { id: noteId },
      data: {
        collaborators: {
          connect: { id: user.id },
        },
      },
    });

    // 📬 Envoi de l'événement vers Inngest
    await inngest.send({
      name: "note/collaborator.added.log-only",
      data: {
        noteId,
        addedUser: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        ownerId: note.userId,
        organisationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTE_COLLABORATORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
