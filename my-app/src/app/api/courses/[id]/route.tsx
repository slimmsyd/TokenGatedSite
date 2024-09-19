import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const course = await db.course.findUnique({
      where: { id },
      include: { modules: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const updatedCourse = await request.json();

  try {
    const course = await db.course.update({
      where: { id },
      data: {
        title: updatedCourse.title,
        modules: {
          upsert: updatedCourse.modules.map((module: any) => ({
            where: { id: module.id },
            update: {
              title: module.title,
              videoURL: module.videoURL,
              concepts: module.concepts,
              objectives: module.objectives,
              activities: module.activities,
            },
            create: {
              title: module.title,
              videoURL: module.videoURL,
              concepts: module.concepts,
              objectives: module.objectives,
              activities: module.activities,
            },
          })),
        },
      },
      include: { modules: true },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}