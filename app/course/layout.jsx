import React from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader';

function CourseViewLayout({children}) {
  return (
    <div className="bg-dark-primary min-h-screen">
      <DashboardHeader />
      <div className="mx-6 md:mx-24 lg:px-44 mt-8 pb-16">{children}</div>
    </div>
  );
}

export default CourseViewLayout