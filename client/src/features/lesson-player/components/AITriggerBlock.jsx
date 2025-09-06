import React, { useEffect, useState } from 'react';
import { useLessonStore } from '../hooks/useLessonStore';
import { analyzeBehavior } from '../services/aiTriggerAPI';
import { Bot } from 'lucide-react';

const AITriggerBlock = ({ node }) => {
  const { advanceLesson } = useLessonStore();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const triggerAnalysis = async () => {
      try {
        setIsLoading(true);
        const result = await analyzeBehavior(node.data);
        setAnalysisResult(result);
      } catch (error) {
        console.error('AI analysis failed:', error);
        setAnalysisResult("Sorry, I couldn't complete the analysis.");
      } finally {
        setIsLoading(false);
      }
    };

    triggerAnalysis();
  }, [node.data]);

  useEffect(() => {
    // Once the analysis is done and result is shown, advance the lesson.
    if (!isLoading && analysisResult) {
      const timer = setTimeout(() => {
        advanceLesson();
      }, 2000); // 2-second delay before moving to the next node

      return () => clearTimeout(timer);
    }
  }, [isLoading, analysisResult, advanceLesson]);

  return (
    <div className="p-4 rounded-lg bg-teal-900/30 border border-teal-700/40 self-start w-full flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
        <Bot size={20} className="text-white" />
      </div>
      <div className="flex-grow">
        <p className="font-bold text-teal-300">{node.data.label || 'AI Action'}</p>
        {isLoading && <p className="text-white/80 italic">Analyzing...</p>}
        {analysisResult && <p className="text-white">{analysisResult}</p>}
      </div>
    </div>
  );
};

export default AITriggerBlock;