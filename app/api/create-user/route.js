import { inngest } from "../../../inngest/client";
import { NextResponse } from "next/server";

export async function POST(req){
    const {user} = await req.json();
    
    // Try to send to Inngest, but don't fail if it's not configured
    try {
        const result = await inngest.send({
            name: 'user.create',
            data: {
                user: user
            }
        });
        console.log("Inngest user creation task sent successfully");
        return NextResponse.json({result: result});
    } catch (inngestError) {
        console.log("Inngest not configured, continuing without background tasks:", inngestError.message);
        return NextResponse.json({result: "User creation completed without background tasks"});
    }
}
