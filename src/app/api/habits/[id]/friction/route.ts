import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id: habitId } = params;
    const body = await req.json();
    const { step } = body;

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit || habit.userId !== userId) {
      return new NextResponse('Not Found or Unauthorized', { status: 404 });
    }

    const frictionStep = await prisma.frictionStep.create({
      data: {
        habitId,
        step,
      },
    });

    return NextResponse.json(frictionStep);
  } catch (error) {
    console.error('Error adding friction step:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
