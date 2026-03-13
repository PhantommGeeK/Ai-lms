"use client";

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import { BookOpen, ClipboardList, TrendingUp, Clock, Bell, Award } from 'lucide-react';

// Circular Progress Component
function CircularProgress({ percentage, size = 80, strokeWidth = 6, label, sublabel, color = "url(#gradient)" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="circular-progress" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle
            className="progress-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
          />
          <circle
            className="progress-bar"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="progress-text">{percentage}%</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text-primary">{label}</h4>
        <p className="text-xs text-text-secondary mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useUser();
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const result = await axios.post("/api/courses/", {
            createdBy: user.primaryEmailAddress.emailAddress,
          });
          setCourseCount(result.data.result?.length || 0);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchCount();
  }, [user]);

  const statCards = [
    {
      label: 'Courses Enrolled',
      value: courseCount,
      icon: BookOpen,
      iconBg: 'from-purple-600/20 to-purple-400/10',
      iconColor: 'text-purple-400',
      trend: '+2 this week',
    },
    {
      label: 'Assignments Due',
      value: Math.max(0, Math.floor(courseCount * 0.4)),
      icon: ClipboardList,
      iconBg: 'from-blue-600/20 to-blue-400/10',
      iconColor: 'text-blue-400',
      trend: '3 upcoming',
    },
    {
      label: 'Learning Progress',
      value: courseCount > 0 ? '85%' : '0%',
      icon: TrendingUp,
      iconBg: 'from-green-600/20 to-green-400/10',
      iconColor: 'text-green-400',
      trend: '+12% this month',
    },
  ];

  const recentActivities = [
    {
      title: 'New study material generated',
      course: 'AI-Generated Content',
      badge: 'NEW',
      badgeClass: 'badge-new',
      time: '2 hours ago',
    },
    {
      title: 'Quiz available for review',
      course: 'Active Course Material',
      badge: 'DUE',
      badgeClass: 'badge-due',
      time: 'Tomorrow',
    },
    {
      title: 'Flashcards practice complete',
      course: 'Study Session',
      badge: 'DONE',
      badgeClass: 'badge-graded',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <WelcomeBanner />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, i) => (
          <div key={i} className="glow-card stat-card animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <div className={`stat-icon bg-gradient-to-br ${stat.iconBg}`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="stat-value gradient-text">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Progress + Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Course Progress */}
        <div className="lg:col-span-3 glass-card-static p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-base text-text-primary">Course Progress</h3>
            <span className="text-xs text-accent-violet cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-6">
            <CircularProgress
              percentage={64}
              label="AI Study Materials"
              sublabel="14/22 Lessons completed"
            />
            <div className="border-t border-white/[0.06]" />
            <CircularProgress
              percentage={94}
              label="Practice & Quizzes"
              sublabel="45/48 Lessons completed"
            />
            <div className="border-t border-white/[0.06]" />
            <CircularProgress
              percentage={30}
              label="Flashcard Mastery"
              sublabel="6/20 Sets reviewed"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card-static p-6">
          <h3 className="font-semibold text-base text-text-primary mb-5">Recent Activity</h3>
          <div>
            {recentActivities.map((activity, i) => (
              <div key={i} className="activity-item">
                <div className="flex-1">
                  <span className={`activity-badge ${activity.badgeClass} mb-1.5 inline-block`}>
                    {activity.badge}
                  </span>
                  <h5 className="text-sm font-medium text-text-primary leading-snug">{activity.title}</h5>
                  <p className="text-xs text-text-secondary mt-0.5">{activity.course}</p>
                </div>
                <span className="text-[10px] text-text-muted whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course List */}
      <CourseList />
    </div>
  )
}

export default Dashboard