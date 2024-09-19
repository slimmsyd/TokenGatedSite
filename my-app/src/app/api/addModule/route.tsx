import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';


export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const courseId = parseInt(params.courseId);
  const { title, concepts, objectives, activities, videoURL } = await request.json();

  console.log("This is the course id", courseId)

  try {
    const newModule = await db.module.create({
      data: {
        title,
        videoURL,
        concepts,
        objectives,
        activities,
        course: { connect: { id: courseId } },
      },
    });

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error('Failed to add module:', error);
    return NextResponse.json({ error: 'Failed to add module' }, { status: 500 });
  }
}