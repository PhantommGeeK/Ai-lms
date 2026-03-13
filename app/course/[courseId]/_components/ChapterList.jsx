import React from 'react'
import { getChapters, getChapterTitle, getChapterSummary, getChapterEmoji } from '../../../utils/courseHelpers';

function ChapterList({ course }) {
  const CHAPTERS = getChapters(course.courseLayout);

  return (
    <div className='mt-8'>
      <h2 className='font-semibold text-lg text-text-primary mb-4'>Chapters</h2>
      {CHAPTERS.length === 0 ? (
        <div className="glass-card-static p-6 text-center">
          <p className="text-text-muted text-sm">No chapters found.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {CHAPTERS.map((chapter, index) => (
            <div
              key={index}
              className='glass-card p-4 flex gap-4 items-start cursor-pointer group'
            >
              <div className="w-10 h-10 rounded-xl bg-dark-tertiary flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform">
                {getChapterEmoji(chapter)}
              </div>
              <div className="flex-1">
                <h2 className='text-sm font-medium text-text-primary group-hover:text-purple-400 transition-colors'>
                  {getChapterTitle(chapter)}
                </h2>
                <p className='text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2'>
                  {getChapterSummary(chapter)}
                </p>
              </div>
              <span className="text-[10px] text-text-muted bg-dark-tertiary px-2 py-1 rounded-full flex-shrink-0">
                Ch. {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChapterList