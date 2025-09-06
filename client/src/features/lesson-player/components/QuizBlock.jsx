import React, { useState, useMemo } from 'react';
import { useLessonStore } from '../hooks/useLessonStore';
import { CheckCircle, XCircle } from 'lucide-react';
import useSound from 'use-sound';
import correctSound from '../../../assets/sounds/Button02.wav';

/**
 * Renders a quiz block in the chat panel.
 * It displays a question, multiple-choice options, and provides feedback on the user's answer.
 * @param {{ node: Object, isActive: boolean }} props
 */
const QuizBlock = ({ node, isActive }) => {
  const [playCorrect] = useSound(correctSound, { volume: 0.25 });
  const recordAnswer = useLessonStore((state) => state.recordAnswer);
  const advanceLesson = useLessonStore((state) => state.advanceLesson);
  const userAnswer = useLessonStore((state) => state.userAnswers.get(node.id));

  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);
  const isAnswered = useMemo(() => !!userAnswer || !!selectedAnswer, [userAnswer, selectedAnswer]);

  if (!node || !node.data) {
    return null;
  }

  const { question, answers: options } = node.data;
  const correctAnswer = useMemo(() => options?.find(o => o.correct)?.text, [options]);

  const handleSelectAnswer = (option) => { // option is an object {id, text, correct}
    if (isAnswered) return;

    if (option.correct) {
      playCorrect();
    }
    setSelectedAnswer(option.text);
    recordAnswer(node.id, option.text);
  };

  const getButtonClass = (option) => {
    if (!isAnswered) {
      return 'bg-gray-700 hover:bg-gray-600';
    }

    const isCorrect = option.correct;
    const isSelected = option.text === (selectedAnswer || userAnswer);

    if (isCorrect) {
      return 'bg-green-600/80 text-white cursor-default';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-600/80 text-white cursor-default';
    }

    return 'bg-gray-800/50 text-gray-400 cursor-not-allowed';
  };

  return (
    <div className="bg-pink-800/30 border border-pink-600/40 p-4 rounded-lg text-white animate-fade-in">
      <p className="font-bold mb-4 whitespace-pre-wrap">{question}</p>
      <div className="space-y-2 mb-4">
        {options?.map((option, index) => (
          <button
            key={option.id || index}
            onClick={() => handleSelectAnswer(option)}
            disabled={isAnswered}
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${getButtonClass(
              option,
            )}`}
          >
            <span>{option.text}</span>
            {isAnswered && option.correct && <CheckCircle size={20} className="text-green-300" />}
            {isAnswered && option.text === (selectedAnswer || userAnswer) && !option.correct && <XCircle size={20} className="text-red-300" />}
          </button>
        ))}
      </div>
      {isAnswered && (selectedAnswer || userAnswer) !== correctAnswer && (
         <div className="text-sm text-green-400/90 p-2 bg-green-900/30 rounded-md mb-4">
            Correct Answer: {correctAnswer}
        </div>
      )}
      {isActive && isAnswered && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              const isCorrect = (selectedAnswer || userAnswer) === correctAnswer;
              if (isCorrect) {
                playCorrect();
              }
              const sourceHandle = isCorrect ? 'correct' : 'incorrect';
              advanceLesson(sourceHandle);
            }}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizBlock;