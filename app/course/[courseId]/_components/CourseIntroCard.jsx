import React from "react";
import { BookOpen, Layers } from "lucide-react";
import { getCourseTitle, getCourseSummary, getChapters } from "../../../utils/courseHelpers";

function CourseIntroCard({ course }) {
  const layout = course.courseLayout;
  const title = getCourseTitle(layout, course.topic || "Untitled Course");
  const summary = getCourseSummary(layout);
  const chapters = getChapters(layout);

  return (
    <div className="glow-card p-6 md:p-8 relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-purple-600/15 to-blue-500/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex gap-6 items-start">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-7 h-7 text-purple-400" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {chapters.length} Chapters
            </span>
          </div>
          <h2 className="font-bold text-xl text-white mb-2">
            {title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CourseIntroCard;
