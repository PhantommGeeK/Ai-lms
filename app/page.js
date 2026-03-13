"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { GraduationCap, BookOpen, Brain, Zap, ArrowRight, Sparkles, Star } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-dark-primary relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="header-bar px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-xl text-white">TutorAI</h1>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <button className="outline-btn text-sm">Dashboard</button>
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="gradient-btn text-sm">Sign In</button>
            </SignInButton>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="glass-card-static px-4 py-1.5 flex items-center gap-2 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium text-text-secondary">AI-Powered Learning Experience</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in-up animate-delay-1">
          Learn Smarter with{" "}
          <span className="gradient-text">AI-Generated</span>{" "}
          Study Materials
        </h1>

        <p className="text-base md:text-lg text-text-secondary max-w-2xl mb-10 animate-fade-in-up animate-delay-2">
          Create personalized notes, flashcards, quizzes, and Q&A pairs powered by artificial intelligence. Your intelligent companion for mastering any topic.
        </p>

        {isSignedIn ? (
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animate-delay-3">
            <Link href="/dashboard">
              <button className="gradient-btn flex items-center gap-2 text-base px-8 py-3">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/create">
              <button className="outline-btn text-base px-8 py-3">
                Create New Course
              </button>
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in-up animate-delay-3">
            <SignInButton mode="modal">
              <button className="gradient-btn flex items-center gap-2 text-base px-8 py-3">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "AI-Generated Notes",
              desc: "Get detailed, structured notes for any topic with AI-powered content generation.",
              color: "from-purple-600/20 to-purple-400/10",
              iconColor: "text-purple-400",
            },
            {
              icon: Brain,
              title: "Interactive Quizzes",
              desc: "Test your knowledge with AI-generated quizzes and track your progress.",
              color: "from-blue-600/20 to-blue-400/10",
              iconColor: "text-blue-400",
            },
            {
              icon: Zap,
              title: "Smart Flashcards",
              desc: "Memorize key concepts with intelligent flashcards designed for effective learning.",
              color: "from-green-600/20 to-green-400/10",
              iconColor: "text-green-400",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glow-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${(i + 4) * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6 text-center">
        <p className="text-xs text-text-muted">© 2026 TutorAI. Built with ❤️ for learners everywhere.</p>
      </footer>
    </div>
  );
}
