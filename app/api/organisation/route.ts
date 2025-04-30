// /app/api/organisation/route.ts

import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing organisation ID' }, { status: 400 });
  }

  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true,
        invitations: true,
        Product: true,
        Stock: true,
        Contact: true,
        Category: true,
        Brand: true,
        notes: true,
        Devis: true,
        Task: true,
        Favorite: true,
        ActivityLogs: true,
      },
    });

    if (!organisation) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    return NextResponse.json(organisation);
  } catch (error) {
    console.error('Error fetching organisation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
