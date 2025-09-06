import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Puzzle } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

const CORRECT_SEQUENCE = [2, 0, 3, 1];

const CircuitRepairDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = useMemo(() => node.data.options || [], [node.data.options]);
  const successOutcome = useMemo(() => outcomes.find(o => o.text?.toLowerCase() === 'success'), [outcomes]);
  // Failure outcome is removed as it's not configured in the node data.

  const [userSequence, setUserSequence] = useState([]);
  const [status, setStatus] = useState('pending'); // 'pending', 'correct', 'incorrect'

  const handleRetry = () => {
    setUserSequence([]);
    setStatus('pending');
  };

  const handlePanelClick = (index) => {
    if (status !== 'pending') return;

    const newSequence = [...userSequence, index];
    setUserSequence(newSequence);

    // Check if the sequence so far is correct
    if (CORRECT_SEQUENCE[newSequence.length - 1] !== index) {
      setStatus('incorrect');
      return;
    }

    // Check for full sequence completion
    if (newSequence.length === CORRECT_SEQUENCE.length) {
      setStatus('correct');
      setTimeout(() => handleGameComplete(successOutcome), 1500);
    }
  };

  const getPanelClass = (index) => {
    if (status === 'correct') return 'bg-green-500';
    if (status === 'incorrect' && userSequence.includes(index)) return 'bg-red-500';
    if (userSequence.includes(index)) return 'bg-cyan-500';
    return 'bg-gray-700 hover:bg-gray-600';
  };

  return (
    <div className="w-full max-w-md h-full bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-white font-sans">
      <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-2"><Puzzle /> Circuit Repair</h3>
      <p className="text-sm text-gray-400">Activate panels in the correct sequence to restore power.</p>
      
      <div className="grid grid-cols-2 gap-4 my-4">
        {[0, 1, 2, 3].map(index => (
          <button
            key={index}
            onClick={() => handlePanelClick(index)}
            disabled={status !== 'pending'}
            className={`w-24 h-24 rounded-lg text-4xl font-bold transition-colors ${getPanelClass(index)}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="h-8 text-xl flex items-center justify-center">
        {status === 'correct' && <p className="text-green-400 flex items-center gap-2"><CheckCircle /> Circuit Repaired!</p>}
        {status === 'incorrect' && <p className="text-red-400 flex items-center gap-2"><XCircle /> Power Surge! Try Again.</p>}
      </div>

      <div className="h-12">
        {status === 'incorrect' && (
          <div className="flex justify-center mt-2">
            <button onClick={handleRetry} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">Retry</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircuitRepairDemo;