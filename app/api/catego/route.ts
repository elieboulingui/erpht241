import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { inngest } from '@/inngest/client';
import { auth } from '@/auth'; // ← récupère l'utilisateur connecté

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");
  const path = searchParams.get("path");

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Utilisateur non authentifié." }, { status: 401 });
  }

  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.category.updateMany({
      where: {
        organisationId,
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    // 🔁 Inngest: log asynchrone
    await inngest.send({
      name: 'category/archived-all',
      data: {
        userId,
        organisationId,
        updatedCount: updated.count,
        timestamp: new Date().toISOString(),
      },
    });

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    return NextResponse.json({
      message: `Toutes les catégories (${updated.count}) ont été archivées avec succès.`,
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'archivage des catégories." },
      { status: 500 }
    );
  }
}
