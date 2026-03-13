import React, { useState } from 'react'
import { GraduationCap, Briefcase, Code2, BookOpen, Lightbulb } from 'lucide-react'

function SelectOption({ selectedStudyType }) {
  const Options = [
    { name: 'Exam', icon: GraduationCap, color: 'text-purple-400', bg: 'from-purple-600/15 to-purple-400/5', border: 'border-purple-500/20' },
    { name: 'Job Interview', icon: Briefcase, color: 'text-blue-400', bg: 'from-blue-600/15 to-blue-400/5', border: 'border-blue-500/20' },
    { name: 'Practice', icon: BookOpen, color: 'text-green-400', bg: 'from-green-600/15 to-green-400/5', border: 'border-green-500/20' },
    { name: 'Code Prep', icon: Code2, color: 'text-orange-400', bg: 'from-orange-600/15 to-orange-400/5', border: 'border-orange-500/20' },
    { name: 'Other', icon: Lightbulb, color: 'text-pink-400', bg: 'from-pink-600/15 to-pink-400/5', border: 'border-pink-500/20' },
  ];

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div>
      <h2 className="text-center mb-6 text-base text-text-secondary">
        What type of study material would you like to create?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Options.map((option, index) => (
          <div
            key={index}
            onClick={() => { setSelectedOption(option.name); selectedStudyType(option.name) }}
            className={`p-5 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 border ${
              option.name === selectedOption
                ? 'border-purple-500/50 bg-purple-500/10 ring-2 ring-purple-500/30 shadow-glow'
                : 'border-white/[0.06] hover:border-purple-500/20 hover:bg-white/[0.02]'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.bg} border ${option.border} flex items-center justify-center mb-3`}>
              <option.icon className={`w-6 h-6 ${option.color}`} />
            </div>
            <h2 className="text-xs font-medium text-text-primary text-center">{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectOption