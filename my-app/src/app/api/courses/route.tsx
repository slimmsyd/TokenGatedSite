import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    // Check if db is properly initialized
    if (!db) {
      console.error('Database connection not initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    const body = await request.json();
    const { title, author, date, videoURL } = body;

    console.log("This is the body", body, title, author, date, videoURL)

    // Validate required fields
    if (!title || !author || !date || !videoURL) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, date, and videoURL are required' },
        { status: 400 }
      );
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const newCourse = await db.course.create({
      data: {
        title,
        author,
        date: new Date(date),
            modules: { create: [] },
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
export async function GET(request: Request) {
    try {
      const courses = await db.course.findMany({
        include: { modules: true }
      });
      return NextResponse.json( { courses }, { status: 200 });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
  }

  export async function DELETE(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
      }
  
      await db.module.deleteMany({
        where: { courseId: parseInt(id) },
      });

         // Then, delete the course
    const deletedCourse = await db.course.delete({
      where: { id: parseInt(id) },
    });
  
      return NextResponse.json({ message: 'Course and related modules deleted successfully', course: deletedCourse }, { status: 200 });
    } catch (error) {
      console.error('Failed to delete course:', error);
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
  }