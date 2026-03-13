"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, ChevronRight, HelpCircle, Eye, EyeOff } from "lucide-react";

function ViewQA() {
  const [qaData, setQaData] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(true);
  const { courseId } = useParams();

  useEffect(() => {
    GetQA();
  }, [courseId]);

  const GetQA = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Question/Answer",
      });
      console.log("QA DATA", result.data);
      // Safely extract questions array
      const questions = result.data?.content?.questions || result.data?.questions || [];
      setQaData(questions);
    } catch (err) {
      console.error("Error fetching QA data:", err.message);
      setError("Failed to fetch QA data.");
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    setStepCount((prev) => (prev > 0 ? prev - 1 : prev));
    setShowAnswer(false);
  };

  const nextStep = () => {
    setStepCount((prev) => (prev < qaData.length - 1 ? prev + 1 : prev));
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-sm text-text-muted">Loading questions...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="glass-card-static p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );

  if (!qaData || qaData.length === 0)
    return (
      <div className="glass-card-static p-8 text-center">
        <HelpCircle className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No Q&A data available yet.</p>
      </div>
    );

  return (
    <div className="min-h-screen p-5 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-5 text-white flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-purple-400" />
        Q&A Pairs
      </h2>

      {/* Navigation */}
      <div className="flex gap-4 items-center mb-6">
        <button
          className="outline-btn flex items-center gap-1 text-sm px-4 py-2"
          onClick={prevStep}
          disabled={stepCount === 0 || qaData.length === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex w-full gap-1.5">
          {qaData.map((_, index) => (
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
          disabled={stepCount === qaData.length - 1 || qaData.length === 0}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step Counter */}
      <div className="text-xs text-text-muted mb-4">
        Question {stepCount + 1} of {qaData.length}
      </div>

      {/* Render QA Content */}
      {qaData[stepCount] && (
        <div className="glass-card-static p-6 md:p-8">
          <h1 className="text-xl font-bold mb-4 text-white">
            {qaData[stepCount].question}
          </h1>
          <button
            className="outline-btn flex items-center gap-2 text-sm mb-4"
            onClick={toggleAnswer}
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>

          {/* Answer with animation */}
          <div
            className="transition-all duration-500 ease-in-out overflow-hidden bg-dark-tertiary/50 border border-white/[0.04] rounded-xl"
            style={{
              maxHeight: showAnswer ? "1000px" : "0",
              opacity: showAnswer ? "1" : "0",
              padding: showAnswer ? "20px" : "0 20px",
            }}
          >
            <div className="prose prose-invert prose-sm max-w-none text-text-secondary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {qaData[stepCount].answer || ""}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewQA;
