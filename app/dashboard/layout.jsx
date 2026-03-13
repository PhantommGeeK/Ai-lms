"use client";

import React from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'

function DashboardLayout({ children }) {
  return (
    <div className='min-h-screen bg-dark-primary flex'>
      {/* Sidebar */}
      <div className='hidden md:block fixed h-screen z-40'>
        <SideBar />
      </div>
      
      {/* Main Content */}
      <div className='flex-1 md:ml-64 transition-all duration-300'>
        <DashboardHeader />
        <div className='p-6 lg:p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout