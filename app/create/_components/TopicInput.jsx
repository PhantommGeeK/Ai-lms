import React, { useState } from 'react'
import { FileText, BarChart3 } from 'lucide-react'

function TopicInput({ setTopic, setDifficultyLevel }) {
  const [currentLevel, setCurrentLevel] = useState("Easy");

  const handleChange = (event) => {
    setCurrentLevel(event.target.value);
    setDifficultyLevel(event.target.value);
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      <div>
        <label className='text-sm font-medium text-text-primary flex items-center gap-2 mb-2'>
          <FileText className="w-4 h-4 text-purple-400" />
          Enter topic or paste content
        </label>
        <textarea
          onChange={(event) => setTopic(event.target.value)}
          className="w-full min-h-[120px] p-4 rounded-xl bg-dark-tertiary border border-white/[0.06] text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all resize-none"
          placeholder="e.g., Introduction to Machine Learning, React Hooks, Calculus Fundamentals..."
        />
      </div>
      <div>
        <label className='text-sm font-medium text-text-primary flex items-center gap-2 mb-2'>
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Select difficulty level
        </label>
        <div className="flex gap-3">
          {["Easy", "Moderate", "Hard"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => { setCurrentLevel(level); setDifficultyLevel(level); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
                currentLevel === level
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent shadow-glow'
                  : 'bg-dark-tertiary text-text-secondary border-white/[0.06] hover:border-purple-500/20 hover:text-text-primary'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopicInput