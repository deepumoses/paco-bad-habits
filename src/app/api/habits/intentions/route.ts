import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { situation, action } = body;

    const intention = await prisma.implementationIntention.create({
      data: {
        userId,
        situation,
        action,
      },
    });

    return NextResponse.json(intention);
  } catch (error) {
    console.error('Error creating intention:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
