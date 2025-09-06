import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet, useMatch } from 'react-router-dom';

const DashboardPage = () => {
  // Check if the current route is a lesson page to apply a full-width layout.
  const isLessonPage = useMatch('/dashboard/lessons/:lessonId');
  const isMyLessonsPage = useMatch('/dashboard/my-lessons');

  const mainClasses =
    isLessonPage
      ? 'relative z-10 pt-24' // Full-width for the lesson player.
      : isMyLessonsPage
      ? 'relative z-10 pt-20 px-4 sm:px-6 lg:px-8 pb-12' // Wider, full-bleed layout for lesson grid.
      : 'relative z-10 pt-20 max-w-screen-xl mx-auto px-4 pb-12'; // Centered for other dashboard pages.

  return (
    <div
      className="bg-deep-black text-white min-h-screen font-sans relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% -30%, var(--color-electric-blue), var(--color-deep-black) 70%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      <Navbar />
      <main className={mainClasses}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;