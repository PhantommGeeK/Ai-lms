"use client";

import React, { useState } from 'react';
import { Calculator, Brain, BookOpen, Zap, ArrowRight, Sparkles, Play, BarChart3 } from 'lucide-react';

function MathAi() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const mathTopics = [
    {
      id: 'algebra',
      title: 'Algebra',
      description: 'Linear equations, quadratic functions, polynomials',
      icon: Calculator,
      gradient: 'from-purple-600/20 to-purple-400/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'calculus',
      title: 'Calculus',
      description: 'Derivatives, integrals, limits, differential equations',
      icon: Brain,
      gradient: 'from-blue-600/20 to-blue-400/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      id: 'geometry',
      title: 'Geometry',
      description: 'Shapes, angles, theorems, coordinate geometry',
      icon: BookOpen,
      gradient: 'from-green-600/20 to-green-400/10',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/20',
    },
    {
      id: 'statistics',
      title: 'Statistics',
      description: 'Probability, distributions, hypothesis testing',
      icon: Zap,
      gradient: 'from-orange-600/20 to-orange-400/10',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/20',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="glow-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-600/15 to-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">MathAI Learning Hub</h1>
            <p className="text-sm text-text-secondary">Master mathematics with AI-powered explanations and practice problems</p>
          </div>
        </div>
      </div>

      {/* Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mathTopics.map((topic) => (
          <div
            key={topic.id}
            className={`glow-card p-5 cursor-pointer transition-all duration-200 ${
              selectedTopic === topic.id
                ? 'ring-2 ring-purple-500/50 bg-purple-500/5'
                : ''
            }`}
            onClick={() => setSelectedTopic(topic.id)}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${topic.gradient} border ${topic.borderColor} flex items-center justify-center mb-4`}>
              <topic.icon className={`w-5 h-5 ${topic.iconColor}`} />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">{topic.title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{topic.description}</p>
          </div>
        ))}
      </div>

      {/* Selected Topic View */}
      {selectedTopic && (
        <div className="glass-card-static p-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <span className="gradient-text">
              {mathTopics.find(t => t.id === selectedTopic)?.title}
            </span>
            <span className="text-text-primary">Practice</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty Levels */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Practice</h3>
              {[
                { level: 'Basic Problems', desc: 'Start with fundamental concepts', color: 'from-green-600/10 to-green-400/5 border-green-500/10' },
                { level: 'Intermediate Problems', desc: 'Challenge yourself with complex problems', color: 'from-yellow-600/10 to-yellow-400/5 border-yellow-500/10' },
                { level: 'Advanced Problems', desc: 'Master-level problem solving', color: 'from-red-600/10 to-red-400/5 border-red-500/10' },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full text-left p-4 rounded-xl border border-white/[0.06] hover:border-purple-500/20 hover:bg-purple-500/5 transition-all group"
                >
                  <h4 className="text-sm font-medium text-text-primary group-hover:text-purple-400 transition-colors">{item.level}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* AI Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary mb-3">AI-Powered Features</h3>
              {[
                { title: 'Step-by-Step Solutions', desc: 'Get detailed explanations for every problem', gradient: 'from-purple-600/10 to-purple-400/5', borderColor: 'border-purple-500/15', textColor: 'text-purple-400' },
                { title: 'Adaptive Learning', desc: 'Problems adjust to your skill level', gradient: 'from-blue-600/10 to-blue-400/5', borderColor: 'border-blue-500/15', textColor: 'text-blue-400' },
                { title: 'Concept Explanations', desc: 'Learn the theory behind each concept', gradient: 'from-green-600/10 to-green-400/5', borderColor: 'border-green-500/15', textColor: 'text-green-400' },
              ].map((feature, i) => (
                <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.borderColor}`}>
                  <h4 className={`text-sm font-medium ${feature.textColor}`}>{feature.title}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex gap-3">
            <button className="gradient-btn flex items-center gap-2 text-sm">
              <Play className="w-4 h-4" />
              Start Practice Session
            </button>
            <button className="outline-btn flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              View Progress
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedTopic && (
        <div className="glass-card-static p-10 text-center">
          <Calculator className="w-14 h-14 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Select a Math Topic</h3>
          <p className="text-sm text-text-secondary">Choose a mathematics topic above to start your AI-powered learning journey</p>
        </div>
      )}
    </div>
  );
}

export default MathAi;
