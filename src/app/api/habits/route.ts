import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [
      habits,
      logs,
      intentions,
      frictionSteps,
      contracts,
      stacks,
      bundles,
      identity,
    ] = await Promise.all([
      prisma.habit.findMany({ where: { userId } }),
      prisma.habitLog.findMany({ where: { habit: { userId } } }),
      prisma.implementationIntention.findMany({ where: { userId } }),
      prisma.frictionStep.findMany({ where: { habit: { userId } } }),
      prisma.accountabilityContract.findMany({ where: { userId } }),
      prisma.habitStack.findMany({ where: { userId } }),
      prisma.temptationBundle.findMany({ where: { userId } }),
      prisma.identity.findUnique({ where: { userId } }),
    ]);

    return NextResponse.json({
      habits,
      logs,
      intentions,
      frictionSteps,
      contracts,
      stacks,
      bundles,
      identity: identity || { title: 'I am someone who...', description: '' },
    });
  } catch (error) {
    console.error('Error fetching habits data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, type, description } = body;

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        type,
        description,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
