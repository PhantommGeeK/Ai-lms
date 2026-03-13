"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Zap, RotateCcw, Trophy, Clock, CheckCircle, XCircle } from "lucide-react";

function GamifiedQuiz() {
  const { courseId } = useParams();
  const [stepCount, setStepCount] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    GetQuiz();
  }, []);

  useEffect(() => {
    if (timer > 0 && selectedOption === null && !quizCompleted) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && !quizCompleted) {
      handleTimeout();
    }
  }, [timer, selectedOption, quizCompleted]);

  const GetQuiz = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Quiz",
      });
      setQuizData(result.data);
      const questions = result.data?.content?.questions || [];
      setSelectedOptions(Array(questions.length).fill(null));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const correctAnswer = quizData.content.questions[stepCount].answer;
    const isAnswerCorrect = option === correctAnswer;
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore((prev) => prev + 10);
    }
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[stepCount] = option;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleTimeout = () => {
    setSelectedOption(null);
    setIsCorrect(false);
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[stepCount] = null;
    setSelectedOptions(updatedSelectedOptions);
  };

  const resetSelection = () => {
    setTimer(15);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const previousStep = () => {
    if (stepCount > 0) {
      setStepCount((prev) => prev - 1);
      resetSelection();
      const prevOption = selectedOptions[stepCount - 1];
      setSelectedOption(prevOption);
      setIsCorrect(
        prevOption === quizData.content.questions[stepCount - 1].answer
      );
    }
  };

  const nextStep = () => {
    if (quizData && quizData.content.questions.length > stepCount + 1) {
      setStepCount((prev) => prev + 1);
      resetSelection();
      const nextOption = selectedOptions[stepCount + 1];
      setSelectedOption(nextOption);
      setIsCorrect(
        nextOption === quizData.content.questions[stepCount + 1].answer
      );
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setStepCount(0);
    setScore(0);
    setSelectedOptions(Array(quizData.content.questions.length).fill(null));
    setQuizCompleted(false);
    resetSelection();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-sm text-text-muted">Loading Quiz...</span>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.content || !quizData.content.questions?.length) {
    return (
      <div className="glass-card-static p-8 text-center">
        <Zap className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <p className="text-text-secondary">No Quiz Data Available</p>
      </div>
    );
  }

  const { questions, quizTitle } = quizData.content;

  if (quizCompleted) {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in-up">
        <div className="glow-card p-10 text-center max-w-md w-full">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3 text-white">
            Quiz Completed! 🎉
          </h1>
          <p className="text-lg text-text-secondary mb-2">
            You scored <span className="gradient-text font-bold text-2xl">{score}</span>{" "}
            out of {questions.length * 10}
          </p>
          <div className="w-20 h-20 mx-auto my-5 rounded-full border-4 border-purple-500 flex items-center justify-center">
            <span className="text-2xl font-bold gradient-text">{percentage}%</span>
          </div>
          <button className="gradient-btn flex items-center gap-2 mx-auto" onClick={restartQuiz}>
            <RotateCcw className="w-4 h-4" />
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 animate-fade-in-up">
      <h1 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-2">
        <Zap className="w-6 h-6 text-purple-400" />
        {quizTitle || "Quiz"}
      </h1>

      <div className="glass-card-static p-6 md:p-8 mb-6">
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium text-text-secondary">
            Question {stepCount + 1} of {questions.length}
          </p>
          <div className="flex items-center gap-4">
            <p className={`text-sm font-semibold flex items-center gap-1 ${timer <= 5 ? 'text-red-400' : 'text-text-secondary'}`}>
              <Clock className="w-4 h-4" />
              {timer}s
            </p>
            <p className="text-sm font-semibold text-green-400 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {score}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex w-full gap-1.5 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                index <= stepCount
                  ? "bg-gradient-to-r from-purple-600 to-blue-500"
                  : "bg-dark-tertiary"
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <p className="text-white text-xl text-center mb-8 font-medium">
          {questions[stepCount].question}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
          {questions[stepCount].options.map((option, index) => {
            let optionStyle = "border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 text-text-primary";

            if (selectedOption !== null) {
              if (option === questions[stepCount].answer) {
                optionStyle = "border-green-500/50 bg-green-500/10 text-green-400";
              } else if (selectedOption === option && !isCorrect) {
                optionStyle = "border-red-500/50 bg-red-500/10 text-red-400";
              } else {
                optionStyle = "border-white/[0.04] text-text-muted opacity-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm font-medium ${optionStyle}`}
                disabled={selectedOption !== null || timer === 0}
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-dark-tertiary flex items-center justify-center text-xs font-bold text-text-muted flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result Feedback */}
        {selectedOption && (
          <div className={`mt-5 p-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 ${
            isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {isCorrect ? (
              <><CheckCircle className="w-4 h-4" /> Correct! 🎉</>
            ) : (
              <><XCircle className="w-4 h-4" /> Incorrect. Answer: {questions[stepCount].answer}</>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 items-center justify-between">
        <button
          className="outline-btn flex items-center gap-1 text-sm px-4 py-2"
          onClick={previousStep}
          disabled={stepCount === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          className="gradient-btn flex items-center gap-1 text-sm px-6 py-2"
          onClick={nextStep}
          disabled={quizCompleted}
        >
          {stepCount === questions.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default GamifiedQuiz;
