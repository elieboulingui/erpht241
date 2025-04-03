import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organisationId = searchParams.get("organisationId");

    if (!organisationId) {
      return NextResponse.json(
        { error: "Organisation ID is required" },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
        where: { organisationId },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          organisation: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
