import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Sun, Zap } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

const SolarFlareDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = node.data.options || [];

  const [shieldLevel, setShieldLevel] = useState(0);
  const [timer, setTimer] = useState(7);
  const [isComplete, setIsComplete] = useState(false);

  // Memoize the outcome handler to prevent re-renders in useEffect
  const onComplete = useCallback(() => {
    if (isComplete) return;
    setIsComplete(true);
    const outcome = shieldLevel >= 100 ? outcomes[0] : outcomes[1] || outcomes[0];
    handleGameComplete(outcome);
  }, [isComplete, shieldLevel, outcomes, handleGameComplete]);

  // Game timer logic
  useEffect(() => {
    if (timer <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, onComplete]);

  const chargeShields = () => {
    if (timer > 0) {
      setShieldLevel(level => Math.min(level + 15, 100));
    }
  };
  
  // Check for win condition on shield level change
  useEffect(() => {
      if (shieldLevel >= 100 && !isComplete) {
        onComplete();
      }
  }, [shieldLevel, isComplete, onComplete]);

  const shieldColor = shieldLevel < 40 ? 'bg-red-500' : shieldLevel < 75 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="w-full max-w-md h-full bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-white font-sans">
      <h3 className="text-2xl font-bold text-orange-400 flex items-center gap-2"><Sun /> Solar Flare Incoming!</h3>
      <p className="text-sm text-gray-400">Time until impact: <span className="font-bold text-xl text-red-400">{timer}s</span></p>

      <div className="w-full bg-gray-700 rounded-full h-8 my-4 border-2 border-cyan-300/50">
        <div 
          className={`h-full rounded-full transition-all duration-150 ease-linear ${shieldColor}`} 
          style={{ width: `${shieldLevel}%` }}
        ></div>
      </div>
      <p className="font-mono text-cyan-300">Shield Power: {shieldLevel}%</p>
      
      <button
        onClick={chargeShields}
        disabled={timer <= 0 || shieldLevel >= 100}
        className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Zap /> {shieldLevel >= 100 ? "Shields at Max!" : "Charge Shields!"}
      </button>
    </div>
  );
};

export default SolarFlareDemo;