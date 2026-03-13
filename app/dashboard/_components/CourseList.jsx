"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import CourseCardItem from "./CourseCardItem";
import { BookOpen, FolderOpen } from "lucide-react";
import Link from "next/link";

function CourseList() {
  const { user } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          {courseList.length} {courseList.length === 1 ? 'course' : 'courses'}
        </span>
      </div>

      {courseList.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <FolderOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-primary mb-1">No courses yet</h3>
          <p className="text-sm text-text-secondary mb-5">Create your first AI-powered study material</p>
          <Link href="/create">
            <button className="gradient-btn">Create Course</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courseList.map((course, index) => (
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
