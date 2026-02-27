import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description } = body;

    const identity = await prisma.identity.upsert({
      where: { userId },
      update: {
        title,
        description,
      },
      create: {
        userId,
        title,
        description,
      },
    });

    return NextResponse.json(identity);
  } catch (error) {
    console.error('Error updating identity:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
