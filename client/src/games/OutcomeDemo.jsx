import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

// Helper to get styling and an icon based on the outcome status
const getStatusVisuals = (status = 'neutral') => {
  switch (status.toLowerCase()) {
    case 'success':
      return {
        Icon: CheckCircle,
        colorClass: 'text-green-400',
        bgColorClass: 'bg-green-900/50',
        borderColorClass: 'border-green-700',
      };
    case 'failure':
      return {
        Icon: XCircle,
        colorClass: 'text-red-400',
        bgColorClass: 'bg-red-900/50',
        borderColorClass: 'border-red-700',
      };
    default: // neutral
      return {
        Icon: Info,
        colorClass: 'text-blue-400',
        bgColorClass: 'bg-blue-900/50',
        borderColorClass: 'border-blue-700',
      };
  }
};

const OutcomeDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);

  // Destructure data from the node with default values
  const {
    title = 'Path Complete',
    summary = 'You have reached the end of this lesson path.',
    status = 'neutral',
    options = ['Continue'], // This will be the outcome text to continue
  } = node.data || {};

  const { Icon, colorClass, bgColorClass, borderColorClass } = getStatusVisuals(status);

  // This function will now advance the lesson to the next node.
  const handleContinue = () => {
    // The hook expects the text of the outcome. We'll use the first one.
    if (options.length > 0) {
      handleGameComplete(options[0]);
    } else {
      console.error('OutcomeDemo: No options available to continue lesson.');
    }
  };

  return (
    <div
      className={`w-full max-w-md h-full bg-gray-900 rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-white font-sans text-center animate-fade-in border ${borderColorClass} ${bgColorClass}`}
    >
      <Icon size={64} className={`${colorClass} mb-2`} />

      <h3 className={`text-3xl font-bold ${colorClass}`}>{title}</h3>

      <p className="text-base text-gray-300 my-4">{summary}</p>

      <button
        onClick={handleContinue}
        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        Continue
      </button>
    </div>
  );
};

export default OutcomeDemo;