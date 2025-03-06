// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const organisationId = req.nextUrl.searchParams.get('organisationId');

  if (!organisationId) {
    return new NextResponse("Organisation ID required", { status: 400 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: { 
        organisationId,
        isArchived: false 
      },
      select: {
        id: true,
        name: true
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}