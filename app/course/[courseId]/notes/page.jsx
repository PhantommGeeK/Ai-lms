"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import {
  parseNotesTopics,
  getNotesChapterTitle,
  getNotesChapterSummary,
  getChapterEmoji,
} from "../../../utils/courseHelpers";

/**
 * Attempt to deeply parse the notes data.
 * The `notes` field from the DB may be:
 *   - A JSON string of a single chapter object: { chapterTitle, topics: [...] }
 *   - A JSON string of an array: [ { chapter, content, ... } ]
 *   - A JSON string of raw markdown content
 *   - Already parsed JSON
 */
function parseNotesData(rawNotes) {
  if (!rawNotes) return null;

  // If already an object, return it
  if (typeof rawNotes === "object") return rawNotes;

  // Try parsing as JSON
  try {
    const parsed = JSON.parse(rawNotes);
    // If parsing gives us an array, try handling it
    if (Array.isArray(parsed)) {
      // If it's an array of chapter-like objects, wrap them into a notes structure
      // This handles the case in the screenshot where the entire notes field is an array
      return {
        chapterTitle: parsed[0]?.chapter || parsed[0]?.chapterTitle || parsed[0]?.title || "Chapter Notes",
        chapterSummary: parsed[0]?.summary || parsed[0]?.chapterSummary || "",
        emoji: parsed[0]?.emoji || "📖",
        topics: parsed.map((item, index) => ({
          topicTitle: item.chapter || item.title || item.topicTitle || item.topic || `Section ${index + 1}`,
          content: item.content || item.text || item.notes || item.description || "",
        })),
      };
    }
    return parsed;
  } catch (e) {
    // If it's not valid JSON, it might be raw markdown
    return {
      chapterTitle: "Chapter Notes",
      chapterSummary: "",
      emoji: "📖",
      topics: [{ topicTitle: "Notes", content: rawNotes }],
    };
  }
}

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepCount, setStepCount] = useState(0);

  const prevStep = () => stepCount > 0 && setStepCount(stepCount - 1);
  const nextStep = () =>
    stepCount < notes.length - 1 && setStepCount(stepCount + 1);

  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  const fetchNotes = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes",
      });
      console.log("NOTES RAW", result.data);
      setNotes(result.data);
    } catch (err) {
      console.error("Error fetching notes:", err.message);
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-sm text-text-muted">Loading notes...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="glass-card-static p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );

  if (!notes || notes.length === 0)
    return (
      <div className="glass-card-static p-8 text-center">
        <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No notes available yet.</p>
      </div>
    );

  // Parse the current step's notes data
  const currentNote = notes[stepCount];
  const jsonObject = parseNotesData(currentNote?.notes);

  if (!jsonObject) {
    return (
      <div className="glass-card-static p-8 text-center">
        <p className="text-red-400">Error: Failed to parse notes data.</p>
      </div>
    );
  }

  const chapterTitle = getNotesChapterTitle(jsonObject);
  const chapterSummary = getNotesChapterSummary(jsonObject);
  const emoji = getChapterEmoji(jsonObject, "📖");
  const topics = parseNotesTopics(jsonObject);

  return (
    <div className="min-h-screen p-5 animate-fade-in-up">
      {/* Navigation */}
      <div className="flex gap-4 items-center mb-6">
        <button
          className="outline-btn flex items-center gap-1 text-sm px-4 py-2"
          onClick={prevStep}
          disabled={stepCount === 0 || notes.length === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex w-full gap-1.5">
          {notes.map((_, index) => (
            <div
              key={index}
              className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                index <= stepCount
                  ? "bg-gradient-to-r from-purple-600 to-blue-500"
                  : "bg-dark-tertiary"
              }`}
            ></div>
          ))}
        </div>

        <button
          className="outline-btn flex items-center gap-1 text-sm px-4 py-2"
          onClick={nextStep}
          disabled={stepCount === notes.length - 1 || notes.length === 0}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step Counter */}
      <div className="text-xs text-text-muted mb-4">
        Chapter {stepCount + 1} of {notes.length}
      </div>

      {/* Render Content */}
      <div className="glass-card-static p-6 md:p-8">
        {/* Chapter Title */}
        <div className="flex items-center gap-3 text-2xl font-bold mb-2 text-white">
          <span className="text-3xl">{emoji}</span>
          {chapterTitle}
        </div>
        {chapterSummary && (
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            {chapterSummary}
          </p>
        )}

        {/* Topics / Content */}
        {topics.length > 0 ? (
          topics.map((topic, index) => (
            <div
              key={index}
              className="p-5 bg-dark-tertiary/50 border border-white/[0.04] rounded-xl mb-4"
            >
              <h1 className="text-base font-semibold mb-3 text-purple-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {topic.title}
              </h1>
              <div className="prose prose-invert prose-sm max-w-none text-text-secondary
                prose-headings:text-text-primary prose-strong:text-text-primary
                prose-code:text-purple-400 prose-code:bg-dark-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-a:text-blue-400 prose-li:marker:text-text-muted">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {topic.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          /* Fallback: if no topics were extracted, try to render the whole value as markdown */
          <div className="p-5 bg-dark-tertiary/50 border border-white/[0.04] rounded-xl">
            <div className="prose prose-invert prose-sm max-w-none text-text-secondary
              prose-headings:text-text-primary prose-strong:text-text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typeof jsonObject === "string" ? jsonObject : JSON.stringify(jsonObject, null, 2)}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewNotes;
