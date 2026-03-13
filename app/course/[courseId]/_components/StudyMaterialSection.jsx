// StudyMaterialSection Component
import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem";
import axios from "axios";
import { BookOpen } from "lucide-react";

function StudyMaterialSection({ courseId, course }) {
  const [studyTypeContent, setStudyTypeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read notes to prepare it",
      icon: "/notes.png",
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcard to help remember concepts",
      icon: "/flashcard.png",
      path: "/flashcards",
      type: "flashcard",
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/quiz.png",
      path: "/quiz",
      type: "quiz",
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning",
      icon: "/qa.png",
      path: "/qa",
      type: "qa",
    },
  ];

  const GetStudyMaterial = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "ALL",
      });
      setStudyTypeContent(result.data);
    } catch (err) {
      console.error("Error fetching study material:", err);
      setError("Failed to load study material.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      GetStudyMaterial();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="font-semibold text-lg text-text-primary mb-4">Study Material</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card-static p-5 flex flex-col items-center">
              <div className="skeleton w-14 h-14 rounded-xl mb-3" />
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-3 w-full mb-3" />
              <div className="skeleton h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 glass-card-static p-6 text-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-lg text-text-primary mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-purple-400" />
        Study Material
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MaterialList.map((item, index) => (
          <MaterialCardItem
            key={index}
            item={item}
            studyTypeContent={studyTypeContent}
            course={course}
            refreshData={GetStudyMaterial}
          />
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
