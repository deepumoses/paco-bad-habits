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
    const { date, status, trigger } = body;

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit || habit.userId !== userId) {
      return new NextResponse('Not Found or Unauthorized', { status: 404 });
    }

    // Check if log exists for this date
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        date,
      },
    });

    if (existingLog) {
      // Update existing log
      const updatedLog = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: {
          status,
          trigger,
          timestamp: new Date(),
        },
      });
      return NextResponse.json(updatedLog);
    } else {
      // Create new log
      const newLog = await prisma.habitLog.create({
        data: {
          habitId,
          date,
          status,
          trigger,
        },
      });
      return NextResponse.json(newLog);
    }
  } catch (error) {
    console.error('Error logging habit:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
