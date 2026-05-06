import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";

function parseJsonResponse(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export async function POST(req) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing. Add GEMINI_API_KEY to .env.local." },
        { status: 500 }
      );
    }

    const { topic, difficulty, question } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Please enter a math question." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.35,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are MathAI inside a learning dashboard.
Topic: ${topic || "General math"}
Difficulty: ${difficulty || "Intermediate"}
Student question: ${question}

Return only valid JSON with this exact shape:
{
  "summary": "short direct answer",
  "steps": ["step 1", "step 2", "step 3"],
  "finalAnswer": "final answer",
  "practice": [
    { "question": "similar practice problem", "hint": "short hint" },
    { "question": "similar practice problem", "hint": "short hint" }
  ]
}
Use clear math notation in plain text. Do not include markdown fences.
`;

    const result = await model.generateContent(prompt);
    const answer = parseJsonResponse(result.response.text());

    return NextResponse.json(answer);
  } catch (error) {
    console.error("Error in POST /api/math-ai:", error);
    return NextResponse.json(
      { error: error?.message || "MathAI failed to generate an answer." },
      { status: 500 }
    );
  }
}
