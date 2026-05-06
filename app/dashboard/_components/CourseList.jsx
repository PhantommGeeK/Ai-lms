"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCardItem from "./CourseCardItem";
import { BookOpen, FolderOpen } from "lucide-react";
import Link from "next/link";
import { getCourseSummary, getCourseTitle } from "../../utils/courseHelpers";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const GetCourseList = async () => {
    try {
      const result = await axios.post("/api/courses/", {
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      setCourseList(result.data.result);
    } catch (err) {
      console.error("Error fetching course list:", err.message);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      setLoading(true);
      await axios.delete("/api/courses/", {
        data: {
          courseId: courseId,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        },
      });
      setCourseList(prevList =>
        prevList.filter(course => course.courseId !== courseId)
      );
    } catch (err) {
      console.error("Error deleting course:", err.message);
      setError("Failed to delete course. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      GetCourseList();
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncQueryFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery((params.get("q") || "").trim().toLowerCase());
    };

    syncQueryFromUrl();
    window.addEventListener("popstate", syncQueryFromUrl);
    window.addEventListener("dashboard-search-change", syncQueryFromUrl);

    return () => {
      window.removeEventListener("popstate", syncQueryFromUrl);
      window.removeEventListener("dashboard-search-change", syncQueryFromUrl);
    };
  }, []);

  const filteredCourseList = courseList.filter((course) => {
    if (!query) return true;

    const title = getCourseTitle(course.courseLayout, course.topic || "").toLowerCase();
    const summary = getCourseSummary(course.courseLayout).toLowerCase();
    const topic = (course.topic || "").toLowerCase();
    const courseType = (course.courseType || "").toLowerCase();

    return [title, summary, topic, courseType].some((value) => value.includes(query));
  });

  if (loading) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-xl text-text-primary">Your Study Material</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card-static p-5">
              <div className="skeleton h-11 w-11 rounded-xl mb-4" />
              <div className="skeleton h-4 w-3/4 mb-3" />
              <div className="skeleton h-20 w-full mb-4" />
              <div className="skeleton h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 glass-card-static p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-xl text-text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Your Study Material
        </h2>
        <span className="text-xs text-text-muted bg-dark-tertiary px-3 py-1 rounded-full">
          {filteredCourseList.length} {filteredCourseList.length === 1 ? 'course' : 'courses'}
        </span>
      </div>

      {filteredCourseList.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <FolderOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {query ? "No courses match your search" : "No courses yet"}
          </h3>
          <p className="text-sm text-text-secondary mb-5">
            {query
              ? "Try a different title, topic, or material keyword."
              : "Create your first AI-powered study material"}
          </p>
          {!query && (
            <Link href="/create">
              <button className="gradient-btn">Create Course</button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourseList.map((course, index) => (
            <CourseCardItem
              course={course}
              key={index}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
