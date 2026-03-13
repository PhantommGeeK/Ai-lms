"use client"
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import TopicInput from './_components/TopicInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { Loader, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Create() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const router = useRouter();
    const { user } = useUser();

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const GenerateCourseOutline = async () => {
      if (!user || !user.primaryEmailAddress?.emailAddress) {
        alert("Please sign in to create a course.");
        return;
      }

      if (!formData.topic || !formData.studyType) {
        alert("Please fill in all required fields.");
        return;
      }

      try {
        const courseId = uuidv4();
        setLoading(true);
        setLoadingMessage("Generating course outline...");

        const payload = {
          courseId,
          courseType: formData.studyType,
          topic: formData.topic,
          difficultyLevel: formData.difficultyLevel || "Medium",
          createdBy: user.primaryEmailAddress.emailAddress,
        };

        const result = await axios.post(
          "/api/generate-course-outline",
          payload,
          { timeout: 120000 }
        );

        setLoadingMessage("Course created successfully! Redirecting...");
        setLoading(false);
        router.replace('/dashboard')
      } catch (error) {
        const errorMsg = error?.response?.data?.error
          || error?.message
          || "Unknown error occurred";
        console.error("Error generating course outline:", errorMsg);
        setLoading(false);
        setLoadingMessage("");
        alert(`Failed to generate course outline: ${errorMsg}`);
      }
    };

  return (
    <div className='min-h-screen bg-dark-primary flex flex-col items-center p-6 md:px-24 lg:px-36 relative'>
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mt-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass-card-static px-4 py-1.5 mb-5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-text-secondary">Step {step + 1} of 2</span>
          </div>
          <h2 className='font-bold text-3xl md:text-4xl text-white mb-3'>
            Build Your <span className="gradient-text">Study Material</span>
          </h2>
          <p className='text-text-secondary text-sm max-w-md mx-auto'>
            Fill all the details in order to generate AI-powered study material for your next learning goal
          </p>
        </div>

        {/* Step Content */}
        <div className='glass-card-static p-6 md:p-8 animate-fade-in-up animate-delay-1'>
          {step === 0 ? (
            <SelectOption selectedStudyType={(value) => handleUserInput("studyType", value)} />
          ) : (
            <TopicInput
              setTopic={(value) => handleUserInput("topic", value)}
              setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
            />
          )}
        </div>

        {/* Loading Message */}
        {loading && (
          <div className="mt-6 glass-card-static p-4 text-center animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-sm text-purple-400 font-medium">{loadingMessage}</p>
            <p className="text-xs text-text-muted mt-1">This may take 1-2 minutes...</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between w-full mt-8 animate-fade-in-up animate-delay-2">
          {step !== 0 ? (
            <button
              className="outline-btn flex items-center gap-2"
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}
          {step === 0 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="gradient-btn flex items-center gap-2"
              disabled={loading}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className="gradient-btn flex items-center gap-2"
              onClick={GenerateCourseOutline}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className='animate-spin w-4 h-4' />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Create