import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    const frictionStep = await prisma.frictionStep.findUnique({
      where: { id },
      include: { habit: true },
    });

    if (!frictionStep || frictionStep.habit.userId !== userId) {
      return new NextResponse('Not Found or Unauthorized', { status: 404 });
    }

    await prisma.frictionStep.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting friction step:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
