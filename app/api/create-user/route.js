import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { USER_TABLE } from "../../../configs/schema";
import { inngest } from "../../../inngest/client";

async function ensureUserExists(user) {
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    throw new Error("User email is required.");
  }

  const existingUser = await db
    .select()
    .from(USER_TABLE)
    .where(eq(USER_TABLE.email, email));

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const inserted = await db
    .insert(USER_TABLE)
    .values({
      name: user?.fullName || user?.firstName || "User",
      email,
    })
    .returning();

  return inserted[0];
}

export async function POST(req) {
  try {
    const { user } = await req.json();

    if (!user) {
      return NextResponse.json({ error: "User payload is required." }, { status: 400 });
    }

    const savedUser = await ensureUserExists(user);

    try {
      await inngest.send({
        name: "user.create",
        data: { user },
      });
      console.log("Inngest user creation task sent successfully");
    } catch (inngestError) {
      console.log(
        "Inngest not configured, user was still saved locally:",
        inngestError.message
      );
    }

    return NextResponse.json({ result: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create user." },
      { status: 500 }
    );
  }
}
