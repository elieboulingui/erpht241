import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    // Revalidate the provided path
    revalidatePath(path);
    return NextResponse.json({ message: "Revalidation successful" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la revalidation:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
