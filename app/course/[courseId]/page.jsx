"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterialSection from "./_components/StudyMaterialSection";
import ChapterList from "./_components/ChapterList";
import VideoRecommendations from "./_components/VideoRecommendations";
import { getCourseTitle } from "../../utils/courseHelpers";

function Course() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);

  const GetCourse = async () => {
    try {
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      setCourseData(result.data.result);
    } catch (err) {
      console.error("Error fetching course:", err.message);
      setError("Failed to load course data.");
    }
  };

  useEffect(() => {
    if (courseId) {
      GetCourse();
    }
  }, [courseId]);

  if (error) {
    return (
      <div className="glass-card-static p-8 text-center mt-10">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-sm text-text-muted">Loading course details...</span>
        </div>
      </div>
    );
  }

  // Safely get the topic for video search
  const videoTopic = getCourseTitle(courseData?.courseLayout, courseData?.topic || "");

  return (
    <div className="pb-24 animate-fade-in-up">
      <CourseIntroCard course={courseData} />
      <StudyMaterialSection courseId={courseId} course={courseData} />
      <ChapterList course={courseData} />
      <VideoRecommendations topic={videoTopic} />
    </div>
  );
}

export default Course;
