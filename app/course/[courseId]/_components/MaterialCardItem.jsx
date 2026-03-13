import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { Loader, BookOpen, Layers, HelpCircle, Zap, ArrowRight } from "lucide-react";
import { getChapters, getChapterTitle } from "../../../utils/courseHelpers";

const iconMap = {
  notes: BookOpen,
  flashcard: Layers,
  quiz: Zap,
  qa: HelpCircle,
};

const colorMap = {
  notes: { gradient: 'from-purple-600/20 to-purple-400/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  flashcard: { gradient: 'from-blue-600/20 to-blue-400/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  quiz: { gradient: 'from-green-600/20 to-green-400/10', border: 'border-green-500/20', text: 'text-green-400' },
  qa: { gradient: 'from-orange-600/20 to-orange-400/10', border: 'border-orange-500/20', text: 'text-orange-400' },
};

function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
  const [loading, setLoading] = useState(false);
  const [contentGenerated, setContentGenerated] = useState(false);

  const Icon = iconMap[item.type] || BookOpen;
  const colors = colorMap[item.type] || colorMap.notes;

  const getCurrentTypeContent = () => {
    try {
      if (item.type === "notes") {
        return studyTypeContent?.notes?.length ?? null;
      } else if (item.type === "flashcard") {
        return studyTypeContent?.flashcard?.[0]?.content?.length ?? null;
      } else if (item.type === "quiz") {
        return studyTypeContent?.quiz?.length ?? null;
      } else if (item.type === "qa") {
        return studyTypeContent?.qa?.length ?? null;
      }
    } catch (error) {
      console.error(`Error getting content for type ${item.type}:`, error);
      return null;
    }
  };

  const isContentGenerated =
    contentGenerated ||
    (getCurrentTypeContent() !== null && getCurrentTypeContent() > 0);

  const getChaptersString = () => {
    const chaps = getChapters(course?.courseLayout);
    if (chaps.length === 0) return "";
    return chaps.map((ch) => getChapterTitle(ch, "")).join(", ");
  };

  const pollForContent = async (pollInterval = 2000, maxRetries = 15) => {
    let retries = 0;
    while (retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      const updatedContent = getCurrentTypeContent();
      if (updatedContent !== null && updatedContent > 0) {
        setContentGenerated(true);
        refreshData(true);
        break;
      }
      retries++;
    }
    setLoading(false);
  };

  const GenerateContent = async (e) => {
    e.preventDefault();
    const chapters = getChaptersString();

    try {
      setLoading(true);
      await axios.post("/api/study-type-content", {
        courseId: course.courseId,
        type: item.name,
        chapter: chapters,
      });
      pollForContent();
    } catch (error) {
      console.error("Error generating content:", error);
      setLoading(false);
    }
  };

  return (
    <Link href={`/course/${course.courseId}${item.path}`}>
      <div
        className={`glow-card p-5 h-full flex flex-col items-center justify-between text-center group transition-all ${
          !isContentGenerated ? "opacity-60" : ""
        }`}
      >
        {/* Status Badge */}
        <span
          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full mb-3 ${
            isContentGenerated
              ? "bg-green-500/15 text-green-400 border border-green-500/20"
              : "bg-white/[0.04] text-text-muted border border-white/[0.06]"
          }`}
        >
          {isContentGenerated ? "Ready" : "Generate"}
        </span>

        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} border ${colors.border} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Title & Description */}
        <h2 className="text-sm font-semibold text-text-primary mb-1">{item.name}</h2>
        <h2 className="text-xs text-text-secondary leading-relaxed">{item.desc}</h2>

        {/* Action Button */}
        {!isContentGenerated ? (
          <button
            className="gradient-btn w-full mt-4 text-xs py-2 flex items-center justify-center gap-1.5"
            onClick={GenerateContent}
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              <>
                Generate
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        ) : (
          <button className="outline-btn w-full mt-4 text-xs py-2 flex items-center justify-center gap-1.5 hover:border-purple-500/40">
            View
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </Link>
  );
}

export default MaterialCardItem;
