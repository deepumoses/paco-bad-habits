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
    const { oldHabit, newHabit } = body;

    const stack = await prisma.habitStack.create({
      data: {
        userId,
        oldHabit,
        newHabit,
      },
    });

    return NextResponse.json(stack);
  } catch (error) {
    console.error('Error creating stack:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
