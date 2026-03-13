"use client"

import { useUser } from '@clerk/nextjs';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function WelcomeBanner() {
  const { user } = useUser();
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className='glow-card p-6 md:p-8 relative overflow-hidden'>
      {/* Background Gradient Orb */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-500/5 blur-2xl pointer-events-none" />
      
      <div className='relative z-10 flex items-center justify-between flex-wrap gap-4'>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-glow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium mb-1">{greeting()}</p>
            <h2 className='font-bold text-2xl md:text-3xl text-white'>
              Welcome back, <span className="gradient-text">{user?.firstName || 'Learner'}</span>
            </h2>
            <p className='text-text-secondary text-sm mt-1'>Ready to continue your learning journey? Let&apos;s make progress today.</p>
          </div>
        </div>

        <Link href="/create">
          <button className="gradient-btn flex items-center gap-2 text-sm">
            <span>Create Course</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default WelcomeBanner