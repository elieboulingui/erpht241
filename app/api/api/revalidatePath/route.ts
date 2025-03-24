// pages/api/revalidatePath.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // Assure-toi de bien importer revalidatePath

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    // Revalidation du cache pour le chemin
    revalidatePath(path);
    return NextResponse.json({ message: "Revalidation successful" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la revalidation:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
