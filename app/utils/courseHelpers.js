/**
 * Utility helpers to safely extract data from AI-generated course JSON.
 * The AI can return different key names depending on the prompt/run,
 * so these helpers try multiple possible keys.
 */

/**
 * Get the course title from a courseLayout object.
 * Tries: courseTitle, course_title, title, name, courseName
 */
export function getCourseTitle(layout, fallback = "Untitled Course") {
  if (!layout) return fallback;
  return (
    layout.courseTitle ||
    layout.course_title ||
    layout.title ||
    layout.name ||
    layout.courseName ||
    layout.course_name ||
    fallback
  );
}

/**
 * Get the course summary from a courseLayout object.
 * Tries: courseSummary, course_summary, summary, description, courseDescription
 */
export function getCourseSummary(layout, fallback = "No summary available.") {
  if (!layout) return fallback;
  return (
    layout.courseSummary ||
    layout.course_summary ||
    layout.summary ||
    layout.description ||
    layout.courseDescription ||
    layout.course_description ||
    fallback
  );
}

/**
 * Get the chapters array from a courseLayout object.
 * Tries: chapters, chapter, chapterList, chapter_list
 */
export function getChapters(layout) {
  if (!layout) return [];
  const chapters = layout.chapters || layout.chapter || layout.chapterList || layout.chapter_list || [];
  return Array.isArray(chapters) ? chapters : [];
}

/**
 * Get a chapter title from a chapter object.
 * Tries: chapterTitle, chapter_title, title, name, chapterName
 */
export function getChapterTitle(chapter, fallback = "Untitled Chapter") {
  if (!chapter) return fallback;
  return (
    chapter.chapterTitle ||
    chapter.chapter_title ||
    chapter.title ||
    chapter.name ||
    chapter.chapterName ||
    chapter.chapter_name ||
    fallback
  );
}

/**
 * Get a chapter summary from a chapter object.
 * Tries: chapterSummary, chapter_summary, summary, description
 */
export function getChapterSummary(chapter, fallback = "") {
  if (!chapter) return fallback;
  return (
    chapter.chapterSummary ||
    chapter.chapter_summary ||
    chapter.summary ||
    chapter.description ||
    fallback
  );
}

/**
 * Get a chapter's emoji.
 * Tries: emoji, icon, chapterEmoji
 */
export function getChapterEmoji(chapter, fallback = "📖") {
  if (!chapter) return fallback;
  return chapter.emoji || chapter.icon || chapter.chapterEmoji || fallback;
}

/**
 * Get topics from a chapter.
 * Tries: topics, topic, topics_covered, topicList, topic_list
 */
export function getChapterTopics(chapter) {
  if (!chapter) return [];
  const topics = chapter.topics || chapter.topic || chapter.topics_covered || chapter.topicList || chapter.topic_list || [];
  return Array.isArray(topics) ? topics : [];
}

/**
 * Parse notes JSON and extract topics array.
 * The AI can return topics as: topics, content, sections
 * Each topic may have: topicTitle/title, content/text/description
 */
export function parseNotesTopics(jsonObject) {
  if (!jsonObject) return [];

  // Try various possible arrays
  const topicsArray =
    jsonObject.topics ||
    jsonObject.content ||
    jsonObject.sections ||
    jsonObject.topicList ||
    jsonObject.topic_list ||
    [];

  if (!Array.isArray(topicsArray)) return [];

  return topicsArray.map((topic, index) => {
    // If the topic is a string (could happen), wrap it
    if (typeof topic === "string") {
      return { title: `Topic ${index + 1}`, content: topic };
    }
    return {
      title:
        topic.topicTitle ||
        topic.topic_title ||
        topic.title ||
        topic.name ||
        `Topic ${index + 1}`,
      content:
        topic.content ||
        topic.text ||
        topic.description ||
        topic.body ||
        "",
    };
  });
}

/**
 * Get chapter title from a notes JSON object (top level).
 */
export function getNotesChapterTitle(jsonObject, fallback = "Chapter Notes") {
  if (!jsonObject) return fallback;
  return (
    jsonObject.chapterTitle ||
    jsonObject.chapter_title ||
    jsonObject.title ||
    jsonObject.chapter ||
    fallback
  );
}

/**
 * Get chapter summary from a notes JSON object (top level).
 */
export function getNotesChapterSummary(jsonObject, fallback = "") {
  if (!jsonObject) return fallback;
  return (
    jsonObject.chapterSummary ||
    jsonObject.chapter_summary ||
    jsonObject.summary ||
    jsonObject.description ||
    fallback
  );
}
