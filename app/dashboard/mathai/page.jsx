"use client";

import axios from "axios";
import React, { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";

function MathAi() {
  const [selectedTopic, setSelectedTopic] = useState("algebra");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mathTopics = [
    {
      id: "algebra",
      title: "Algebra",
      description: "Linear equations, quadratic functions, polynomials",
      icon: Calculator,
      gradient: "from-purple-600/20 to-fuchsia-400/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
    {
      id: "calculus",
      title: "Calculus",
      description: "Derivatives, integrals, limits, differential equations",
      icon: Brain,
      gradient: "from-blue-600/20 to-cyan-400/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      id: "geometry",
      title: "Geometry",
      description: "Shapes, angles, theorems, coordinate geometry",
      icon: BookOpen,
      gradient: "from-green-600/20 to-green-400/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
    },
    {
      id: "statistics",
      title: "Statistics",
      description: "Probability, distributions, hypothesis testing",
      icon: Zap,
      gradient: "from-orange-600/20 to-orange-400/10",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20",
    },
  ];

  const activeTopic = mathTopics.find((topic) => topic.id === selectedTopic) || mathTopics[0];

  const solveQuestion = async (event) => {
    event.preventDefault();
    setError("");
    setAnswer(null);

    if (!question.trim()) {
      setError("Enter a math problem first.");
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("/api/math-ai", {
        topic: activeTopic.title,
        difficulty,
        question,
      });
      setAnswer(result.data);
    } catch (err) {
      setError(err?.response?.data?.error || "MathAI could not solve that right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="glow-card p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">MathAI Learning Hub</h1>
            <p className="text-sm text-text-secondary">
              Solve math problems with step-by-step AI explanations and practice prompts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mathTopics.map((topic) => {
          const TopicIcon = topic.icon;
          return (
            <button
              type="button"
              key={topic.id}
              className={`glow-card p-5 text-left cursor-pointer transition-all duration-200 ${
                selectedTopic === topic.id ? "ring-2 ring-purple-500/50 bg-purple-500/5" : ""
              }`}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${topic.gradient} border ${topic.borderColor} flex items-center justify-center mb-4`}>
                <TopicIcon className={`w-5 h-5 ${topic.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1">{topic.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{topic.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] gap-6">
        <form onSubmit={solveQuestion} className="glass-card-static p-6 space-y-5">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="gradient-text">{activeTopic.title}</span>
            <span>Solver</span>
          </h2>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primary">Difficulty</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Basic", "Intermediate", "Advanced"].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    difficulty === level
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                      : "border-white/[0.06] text-text-secondary hover:border-purple-500/20 hover:text-text-primary"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="math-question" className="text-sm font-semibold text-text-primary">
              Your problem
            </label>
            <textarea
              id="math-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={7}
              className="w-full rounded-xl border border-white/[0.06] bg-dark-tertiary/70 px-4 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10"
              placeholder="Example: Solve 2x + 7 = 19 and explain each step."
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="gradient-btn flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? "Solving..." : "Solve With MathAI"}
          </button>
        </form>

        <div className="glass-card-static p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Learning Focus
          </h3>
          {[
            { title: "Step-by-step solutions", desc: "Breaks the problem into readable reasoning." },
            { title: "Practice prompts", desc: "Gives similar questions after each answer." },
            { title: "Concept support", desc: `Keeps the explanation focused on ${activeTopic.title}.` },
          ].map((feature) => (
            <div key={feature.title} className="p-4 rounded-xl border border-white/[0.06] bg-dark-tertiary/35">
              <h4 className="text-sm font-medium text-text-primary">{feature.title}</h4>
              <p className="text-xs text-text-secondary mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {answer && (
        <div className="glass-card-static p-6 md:p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Answer</p>
            <h2 className="text-xl font-bold text-white">{answer.summary}</h2>
          </div>

          <div className="space-y-3">
            {(answer.steps || []).map((step, index) => (
              <div key={`${step}-${index}`} className="flex gap-3 rounded-xl border border-white/[0.06] bg-dark-tertiary/40 p-4">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-bold text-purple-300">
                  {index + 1}
                </div>
                <p className="text-sm text-text-secondary">{step}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
            <h3 className="text-sm font-semibold text-green-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Final Answer
            </h3>
            <p className="mt-2 text-sm text-text-primary">{answer.finalAnswer}</p>
          </div>

          {!!answer.practice?.length && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-300" />
                Try Next
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {answer.practice.map((item, index) => (
                  <div key={`${item.question}-${index}`} className="rounded-xl border border-white/[0.06] bg-dark-tertiary/35 p-4">
                    <p className="text-sm font-medium text-text-primary">{item.question}</p>
                    <p className="mt-2 text-xs text-text-secondary">{item.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MathAi;
