"use client";

import React from 'react';
import { UserCircle, Mail, Calendar, Settings, Shield, Bell, BookOpen, Award, Clock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-text-muted">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Profile Header */}
      <div className="glow-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-600/15 to-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-glow">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.fullName || 'User'}</h1>
            <p className="text-text-secondary text-sm">{user.primaryEmailAddress?.emailAddress}</p>
            <span className="inline-block mt-2 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
              Student
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Account Info */}
        <div className="glass-card-static p-6">
          <h2 className="text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            Account Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-tertiary/50 border border-white/[0.04]">
              <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Email</p>
                <p className="text-sm text-text-primary">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-tertiary/50 border border-white/[0.04]">
              <Calendar className="w-4 h-4 text-text-muted flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Member Since</p>
                <p className="text-sm text-text-primary">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-tertiary/50 border border-white/[0.04]">
              <UserCircle className="w-4 h-4 text-text-muted flex-shrink-0" />
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">User ID</p>
                <p className="text-xs text-text-primary font-mono">{user.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card-static p-6">
          <h2 className="text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-400" />
            Account Settings
          </h2>
          
          <div className="space-y-3">
            {[
              { icon: Settings, label: 'Account Settings', desc: 'Manage your account preferences' },
              { icon: Bell, label: 'Notifications', desc: 'Configure email & push notifications' },
              { icon: Shield, label: 'Privacy & Security', desc: 'Password, 2FA, and security' },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full text-left p-3.5 rounded-xl border border-white/[0.06] hover:border-purple-500/20 hover:bg-purple-500/5 flex items-center gap-3 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-dark-tertiary flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                  <item.icon className="w-4 h-4 text-text-muted group-hover:text-purple-400 transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-medium text-text-primary block">{item.label}</span>
                  <span className="text-[11px] text-text-muted">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="glass-card-static p-6">
        <h2 className="text-base font-semibold text-text-primary mb-5 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          Learning Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: '0', label: 'Courses Created', icon: BookOpen, color: 'from-purple-600/15 to-purple-400/5', textColor: 'text-purple-400' },
            { value: '0', label: 'Study Materials', icon: Award, color: 'from-blue-600/15 to-blue-400/5', textColor: 'text-blue-400' },
            { value: '0h', label: 'Hours Studied', icon: Clock, color: 'from-green-600/15 to-green-400/5', textColor: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-5 rounded-xl bg-gradient-to-br border border-white/[0.04]" style={{ backgroundImage: `linear-gradient(135deg, ${stat.color.includes('purple') ? 'rgba(124, 58, 237, 0.08)' : stat.color.includes('blue') ? 'rgba(59, 130, 246, 0.08)' : 'rgba(34, 197, 94, 0.08)'}, transparent)` }}>
              <stat.icon className={`w-6 h-6 ${stat.textColor} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
