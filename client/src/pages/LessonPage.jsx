import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLessonStore } from '../features/lesson-player/hooks/useLessonStore';
import {
  LessonOutline,
  WebcamView,
  InteractionPanel,
  ChatPanel,
} from '../features/lesson-player/components';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { BookOpen, Video } from 'lucide-react';

const LessonPage = () => {
  const { lessonId } = useParams();
  const { lesson, loading, error, fetchLesson, clearLesson } = useLessonStore();
  const [isOutlineVisible, setIsOutlineVisible] = useState(true);
  const [isWebcamVisible, setIsWebcamVisible] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId);
    }

    // When the component unmounts (i.e., user navigates away), clear the lesson.
    return () => {
      clearLesson();
    };
  }, [lessonId, fetchLesson, clearLesson]);

  // Reset visibility on desktop view
  useEffect(() => {
    if (isDesktop) {
      setIsOutlineVisible(true);
      setIsWebcamVisible(true);
    }
  }, [isDesktop]);

  if (loading) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
        <p className="text-lg text-white/80">Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!lesson) {
    return null; // Should be handled by the error state
  }

  return (
    <div
      className="
        h-[calc(100vh-96px)]
        grid grid-cols-2 lg:grid-cols-10
        gap-0 p-0 md:gap-4 md:p-4
      "
    >
      {/* 
        Interaction Panel
        - Mobile/Tablet: Spans 2 columns, making it a full-width top row.
        - Desktop: Spans 5 of 10 columns and is ordered to be in the middle.
      */}
      <div className="h-full col-span-2 lg:col-span-5 lg:order-2">
        <InteractionPanel />
      </div>

      {/* 
        Left Column: Outline + Webcam
        - Mobile/Tablet: First column in the second row.
        - Desktop: First column (2/10 width), ordered to the left, with a max width.
      */}
      <div className="flex flex-col gap-0 md:gap-4 min-h-0 lg:order-1 lg:col-span-2 lg:max-w-sm">
        {isOutlineVisible ? (
          <div className="flex-grow min-h-0">
            <LessonOutline
              nodes={lesson.nodes}
              onToggle={() => setIsOutlineVisible(false)}
              isCollapsible={!isDesktop}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsOutlineVisible(true)}
            className="lg:hidden flex items-center justify-center gap-2 p-2 bg-gray-800/50 rounded-lg text-sm text-cyan-green hover:bg-gray-700/50"
          >
            <BookOpen size={16} /> Show Outline
          </button>
        )}
        {isWebcamVisible ? (
          <div className="flex-shrink-0">
            <WebcamView onToggle={() => setIsWebcamVisible(false)} isCollapsible={!isDesktop} />
          </div>
        ) : (
          <button
            onClick={() => setIsWebcamVisible(true)}
            className="lg:hidden flex items-center justify-center gap-2 p-2 bg-gray-800/50 rounded-lg text-sm text-cyan-green hover:bg-gray-700/50"
          >
            <Video size={16} /> Show Webcam
          </button>
        )}
      </div>

      {/* 
        Right Column: Chat Panel
        - Mobile/Tablet: Second column in the second row.
        - Desktop: Last column (3/10 width), ordered to the right.
      */}
      <div className="min-h-0 lg:order-3 lg:col-span-3">
        <ChatPanel />
      </div>
    </div>
  );
};

export default LessonPage;
