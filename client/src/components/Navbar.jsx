import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useMatch } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../features/authentication';
import { useLessonStore } from '../features/lesson-player/hooks/useLessonStore';
import useSound from 'use-sound';
import navButtonSound from '../assets/sounds/Button01.wav';
import ctaButtonSound from '../assets/sounds/Button03.wav';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const dropdownRef = useRef(null);
  const [playNav] = useSound(navButtonSound, { volume: 0.25, playbackRate: 1.2 });
  const [playCta] = useSound(ctaButtonSound, { volume: 0.25 });
  // To make the Navbar more robust, we check for two possible lesson URL structures.
  const matchRootLesson = useMatch('/lesson/:lessonId');
  const matchDashboardLesson = useMatch('/dashboard/lessons/:lessonId'); // Correctly matches /dashboard/lessons/some-id
  const matchAdminLessonDesigner = useMatch('/dashboard/lesson-designs/design/:lessonId');

  const match = matchRootLesson || matchDashboardLesson || matchAdminLessonDesigner;

  // Subscribe to the lesson store to get the title and loading state.
  const lessonTitle = useLessonStore((state) => state.lesson?.title);
  const isLoadingLesson = useLessonStore((state) => state.loading);

  const handleLoginClick = () => {
    playCta();
    navigate('/login');
  };
  const handleTryAppClick = () => {
    playCta();
    navigate('/signup');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const renderAuthSection = () => {
    // While the auth state is being determined, render a placeholder
    // to prevent the UI from flickering between logged-out and logged-in states.
    if (isLoading) {
      return <div className="h-10 w-48" />; // Placeholder with similar size to buttons
    }

    if (user) {
      // User is logged in
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              playNav();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center gap-2 hover:text-cyan-green transition text-sm focus:outline-none"
            title={user.displayName || user.email}
          >
            <User size={20} />
            <span className="hidden sm:inline truncate max-w-[150px]">{user.displayName || user.email}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-white/10 bg-gray-950/90 shadow-lg backdrop-blur-xl z-20">
              <div className="p-2">
                <div className="px-2 py-2">
                  <p className="text-sm text-white">Signed in as</p>
                  <p className="text-sm font-medium text-cyan-green truncate" title={user.email || ''}>
                    {user.email}
                  </p>
                </div>
                <div className="border-t border-white/10 my-1"></div>
                <Link
                  to="/dashboard"
                  onClick={() => {
                    playNav();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-electric-blue hover:text-deep-black transition rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    playNav();
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-electric-blue hover:text-deep-black transition rounded-md"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // User is logged out
    return (
      <div className="flex space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 font-semibold hover:text-cyan-green transition flex items-center gap-2"
        >
          <LogIn size={16} />
          Login
        </button>
        <button
          onClick={handleTryAppClick}
          className="bg-logo-yellow text-deep-black font-bold px-5 py-2 rounded-lg shadow-lg hover:shadow-yellow-400/50 transition animate-yellow-glow"
        >
          Try the App
        </button>
      </div>
    );
  };

  const renderNavCenter = () => {
    if (match?.params?.lessonId) {
      return (
        <div className="hidden md:flex justify-center items-center text-lg font-semibold text-cyan-green truncate px-4">
          {isLoadingLesson ? 'Loading Lesson...' : lessonTitle || 'Lesson'}
        </div>
      );
    }

    return (
      <div className="hidden md:flex space-x-8 text-sm">
        <a href="/#features" className="hover:text-cyan-green transition">Features</a>
        <a href="/#about" className="hover:text-electric-blue transition">About Us</a>
        <a href="#contact" className="hover:text-logo-yellow transition">Contact</a>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-deep-black/80 border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" onClick={playNav} className="flex items-center text-xl font-bold"><span className="text-cyan-green">Spacey</span><span className="text-electric-blue">Tutor</span></Link>
        {renderNavCenter()}
        {renderAuthSection()}
      </nav>
    </header>
  );
};

export default Navbar;
