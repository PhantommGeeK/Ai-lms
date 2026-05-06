"use client"
import React, { useState } from 'react'
import { LayoutDashboard, BookOpen, UserCircle, Brain, Plus, GraduationCap, ChevronLeft, ChevronRight, Award, MessageSquare, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const path = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const MenuList = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Courses',
      icon: BookOpen,
      path: '/dashboard/courses',
    },
    {
      name: 'MathAI',
      icon: Brain,
      path: '/dashboard/mathai',
    },
    {
      name: 'Discussions',
      icon: MessageSquare,
      path: '/dashboard/discussions',
    },
    {
      name: 'Certificates',
      icon: Award,
      path: '/dashboard',
      section: true,
    },
    {
      name: 'Profile',
      icon: UserCircle,
      path: '/dashboard/profile',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/dashboard/profile',
      section: true,
    },
  ];

  return (
    <div className={`sidebar h-screen flex flex-col transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="font-bold text-base text-white leading-tight">TutorAI</h2>
            <p className="text-[10px] text-text-secondary tracking-widest uppercase">Student Portal</p>
          </div>
        )}
      </div>

      {/* Create New Button */}
      <div className="px-4 pt-5 pb-2">
        <Link href='/create' className='w-full'>
          <button className={`gradient-btn w-full flex items-center justify-center gap-2 ${collapsed ? 'px-2' : ''}`}>
            <Plus className="w-4 h-4" />
            {!collapsed && <span>Create New</span>}
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {MenuList.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <div
              className={`sidebar-item ${collapsed ? 'justify-center px-3' : ''} ${
                path === menu.path ? 'active' : ''
              }`}
              title={collapsed ? menu.name : undefined}
            >
              <menu.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{menu.name}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info / Log Out */}
      <div className="p-4 border-t border-white/[0.06]">
        <button
          onClick={() => signOut()}
          className={`sidebar-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10 ${collapsed ? 'justify-center px-3' : ''}`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}

export default SideBar
