import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const organisationId = req.nextUrl.searchParams.get('organisationId');

  if (!organisationId) {
    return new NextResponse("Organisation ID required", { status: 400 });
  }

  try {
    const brands = await prisma.brand.findMany({
      where: { organisationId, isArchived: false },
      include: {
        organisation: true, // Include related Organisation data
        Category: true,     // Include related Categories
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('[BRANDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
