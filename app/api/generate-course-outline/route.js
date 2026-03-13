import { inngest } from "../../../inngest/client";
import { courseOutlineAIModel, generateNotesAiModel, GenerateStudyTypeContentAiModel, GenerateQuizAiModel, GenerateQaAiModel } from "../../../configs/AiModelWrapper";
import { db } from "../../../configs/db";
import { STUDY_MATERIAL_TABLE, CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Helper to safely parse AI JSON responses (handles markdown code fences and truncated JSON)
function safeParseJSON(text) {
  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt to repair truncated JSON by closing open structures
    let repaired = cleaned;
    // Count open/close braces and brackets
    const openBraces = (repaired.match(/{/g) || []).length;
    const closeBraces = (repaired.match(/}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;
    
    // If we're inside an unterminated string, close it
    // Find the last unescaped quote
    const lastQuoteIndex = repaired.lastIndexOf('"');
    if (lastQuoteIndex > 0) {
      const afterLastQuote = repaired.substring(lastQuoteIndex + 1);
      // If after the last quote there's no proper JSON structure closing, the string was truncated
      if (!/[}\],]/.test(afterLastQuote.trim())) {
        repaired = repaired.substring(0, lastQuoteIndex) + '"';
      }
    }
    
    // Close any open brackets/braces
    for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
    for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';
    
    try {
      return JSON.parse(repaired);
    } catch (e2) {
      throw new Error(`Failed to parse AI response: ${e.message}`);
    }
  }
}

// Function to generate study materials immediately
async function generateStudyMaterials(course) {
  const courseId = course.courseId;
  const courseLayout = course.courseLayout;
  
  // Safely extract chapters array (AI may use different key names)
  const chapters = courseLayout?.chapters || courseLayout?.chapter || courseLayout?.chapterList || courseLayout?.chapter_list || [];
  
  if (!courseLayout || !Array.isArray(chapters) || chapters.length === 0) {
    console.log("No chapters found in course layout");
    return;
  }

  // Generate notes for each chapter (sequentially to avoid rate limits)
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    // Safely extract chapter title and topics
    const chapterTitle = chapter.chapterTitle || chapter.chapter_title || chapter.title || chapter.name || `Chapter ${i + 1}`;
    const topicsArray = chapter.topics || chapter.topic || chapter.topics_covered || chapter.topicList || [];
    const topicsStr = Array.isArray(topicsArray) ? topicsArray.join(', ') : String(topicsArray);
    
    try {
      const notesPrompt = `Generate detailed study notes for the chapter: "${chapterTitle}" with the following topics: ${topicsStr}. Provide comprehensive notes in markdown format.`;
      
      const notesResponse = await generateNotesAiModel.sendMessage(notesPrompt);
      const rawText = notesResponse.response.text();
      const notesData = safeParseJSON(rawText);
      
      // Save notes to database
      await db.insert(CHAPTER_NOTES_TABLE).values({
        courseId: courseId,
        chapterId: i + 1,
        notes: JSON.stringify(notesData)
      });
      
      console.log(`Generated notes for chapter ${i + 1}: ${chapterTitle}`);
    } catch (error) {
      console.log(`Error generating notes for chapter ${i + 1}: ${error.message}`);
      // Continue with next chapter instead of failing entire generation
    }
  }

  // Generate flashcards
  try {
    const flashcardPrompt = `Generate flashcards for the topic: "${course.topic}" with course type: "${course.courseType}". Create 10-15 flashcards with front and back content in JSON format.`;
    const flashcardResponse = await GenerateStudyTypeContentAiModel.sendMessage(flashcardPrompt);
    const flashcardData = safeParseJSON(flashcardResponse.response.text());
    
    await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
      courseId: courseId,
      content: flashcardData,
      type: "Flashcard",
      status: "Ready"
    });
    
    console.log("Generated flashcards");
  } catch (error) {
    console.log("Error generating flashcards:", error.message);
  }

  // Generate quiz
  try {
    const quizPrompt = `Generate a Quiz on the topic: "${course.topic}" with course type: "${course.courseType}". Create 10 questions with multiple choice options and correct answers in JSON format.`;
    const quizResponse = await GenerateQuizAiModel.sendMessage(quizPrompt);
    const quizData = safeParseJSON(quizResponse.response.text());
    
    await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
      courseId: courseId,
      content: quizData,
      type: "Quiz",
      status: "Ready"
    });
    
    console.log("Generated quiz");
  } catch (error) {
    console.log("Error generating quiz:", error.message);
  }

  // Generate Q&A
  try {
    const qaPrompt = `Generate Q&A pairs for the topic: "${course.topic}" with course type: "${course.courseType}". Create 10-15 question and answer pairs with detailed explanations in JSON format.`;
    const qaResponse = await GenerateQaAiModel.sendMessage(qaPrompt);
    const qaData = safeParseJSON(qaResponse.response.text());
    
    await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
      courseId: courseId,
      content: qaData,
      type: "Question/Answer",
      status: "Ready"
    });
    
    console.log("Generated Q&A");
  } catch (error) {
    console.log("Error generating Q&A:", error.message);
  }
}

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } =
      await req.json();

    // Validate required fields
    if (!createdBy) {
      return NextResponse.json({ error: "User authentication required" }, { status: 400 });
    }

    if (!topic || !courseType) {
      return NextResponse.json({ error: "Topic and course type are required" }, { status: 400 });
    }

    console.log("Received data:", {
      courseId,
      topic,
      courseType,
      difficultyLevel,
      createdBy,
    });

    const PROMPT = `Generate a study material with course title for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summary of course, List of Chapters along with summary and Emoji icon for each chapter, Topic list in each chapter in JSON format`;

    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    const aiText = aiResp.response.text();
    console.log("AI response text length:", aiText.length);

    const aiResult = safeParseJSON(aiText);
    console.log("Parsed AI result - courseTitle:", aiResult?.courseTitle);

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy,
        topic,
        courseLayout: aiResult,
      })
      .returning();

    console.log("Database insertion result - courseId:", dbResult[0]?.courseId);

    // Return response immediately — generate study materials in background
    // (fire-and-forget so the client doesn't timeout waiting for 10+ AI calls)
    generateStudyMaterials(dbResult[0])
      .then(async () => {
        console.log("Study materials generated successfully for:", courseId);
        await db.update(STUDY_MATERIAL_TABLE)
          .set({ status: "Ready" })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
        console.log("Course status updated to Ready:", courseId);
      })
      .catch((studyError) => {
        console.log("Error generating study materials:", studyError.message);
        // Course stays in 'Generating' status — user can see partial content
      });

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error processing the request:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
