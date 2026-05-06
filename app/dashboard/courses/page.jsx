"use client";

import React from "react";
import CourseList from "../_components/CourseList";

function CoursesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="glass-card-static p-6 md:p-8">
        <h1 className="text-2xl font-bold text-white">Your Courses</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Browse, search, and manage all of your generated study material in one place.
        </p>
      </div>

      <CourseList />
    </div>
  );
}

export default CoursesPage;
