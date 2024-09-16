import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ 
      status: 'Database connection failed', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}