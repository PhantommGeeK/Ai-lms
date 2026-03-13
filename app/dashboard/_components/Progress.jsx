import React from "react";

const Progress = ({ value, max }) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-text-secondary">{value}/{max} completed</span>
        <span className="text-accent-violet font-semibold">{percentage}%</span>
      </div>
      <div className="w-full bg-dark-tertiary rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Progress;
