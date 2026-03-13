import React from "react";
import Loader from "./Loader";
import Link from "next/link";
import { BookOpen, Trash2, ArrowRight } from "lucide-react";
import { getCourseTitle, getCourseSummary } from "../../utils/courseHelpers";

function CourseCardItem({ course, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      onDelete(course.courseId);
    }
  };

  const title = getCourseTitle(course.courseLayout, course.topic || "Untitled Course");
  const summary = getCourseSummary(course.courseLayout);

  return (
    <div className="glow-card p-5 w-full group animate-fade-in-up">
      <div className="flex flex-col justify-between h-full gap-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 pt-1">
            {title}
          </h2>
        </div>

        {/* Summary */}
        <div className="text-xs text-text-secondary bg-dark-tertiary/50 py-3 px-3 rounded-xl border border-white/[0.04] leading-relaxed">
          <p className="line-clamp-3">{summary}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-1">
          {course.status === "Generating" ? (
            <div className="flex items-center gap-2">
              <Loader />
              <span className="text-xs text-text-muted">Generating...</span>
            </div>
          ) : (
            <>
              <Link href={`course/${course.courseId}`}>
                <button className="gradient-btn text-xs px-4 py-2 flex items-center gap-1.5 group-hover:shadow-glow transition-shadow">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;
