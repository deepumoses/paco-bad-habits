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
    const { requirement, reward } = body;

    const bundle = await prisma.temptationBundle.create({
      data: {
        userId,
        requirement,
        reward,
      },
    });

    return NextResponse.json(bundle);
  } catch (error) {
    console.error('Error creating bundle:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
