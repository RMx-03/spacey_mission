import React, { useState, useEffect } from 'react';
import { getPublishedLessons, LessonCard } from '../features/lessons';
import { Loader } from 'lucide-react';

const MyLessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const publishedLessons = await getPublishedLessons();
        setLessons(publishedLessons);
        setError(null);
      } catch (err) {
        setError('Failed to fetch lessons. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-8">
      <h1 className="text-4xl font-bold text-cyan-green mb-4">My Lessons</h1>
      <p className="text-lg text-white/80 mb-8">
        Here you'll find all your available lessons. Choose one to begin your next adventure!
      </p>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-cyan-green" size={48} />
          <p className="text-xl ml-4">Loading Lessons...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.length > 0 ? (
            lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)
          ) : (
            <p className="text-white/70 col-span-full text-center">No lessons available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLessonsPage;