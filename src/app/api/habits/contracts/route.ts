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
    const { partnerName, penalty, partnerEmail } = body;

    // Remove existing contracts? The store implies only one.
    // Let's delete existing ones for simplicity or update if exists.
    await prisma.accountabilityContract.deleteMany({ where: { userId } });

    const contract = await prisma.accountabilityContract.create({
      data: {
        userId,
        partnerName,
        partnerEmail,
        penalty,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
