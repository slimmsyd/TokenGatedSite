import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const courseId = parseInt(params.id);
  const { title, videoURL, concepts, objectives, activities } = await request.json();

  try {
    const newModule = await db.module.create({
      data: {
        title,
        videoURL,
        concepts,
        objectives,
        activities,
        courseId,
      },
    });

    console.log("New module created:", newModule);

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}