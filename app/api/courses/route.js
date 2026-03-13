import { db } from "../../../configs/db";
import { STUDY_MATERIAL_TABLE } from "../../../configs/schema";
import { desc, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { createdBy } = await req.json();

    if (!createdBy) {
      return NextResponse.json(
        { error: "The 'createdBy' field is required." },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id))

    return NextResponse.json({ result: result });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "The 'courseId' query parameter is required." },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ result: result[0] });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course. Please try again later." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { courseId, createdBy } = await req.json();

    if (!courseId || !createdBy) {
      return NextResponse.json(
        { error: "Both 'courseId' and 'createdBy' fields are required." },
        { status: 400 }
      );
    }

    // First verify the course belongs to the user
    const existingCourse = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(
        and(
          eq(STUDY_MATERIAL_TABLE.courseId, courseId),
          eq(STUDY_MATERIAL_TABLE.createdBy, createdBy)
        )
      );

    if (existingCourse.length === 0) {
      return NextResponse.json(
        { error: "Course not found or you don't have permission to delete it." },
        { status: 404 }
      );
    }

    // Delete the course
    await db
      .delete(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    return NextResponse.json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course. Please try again later." },
      { status: 500 }
    );
  }
}