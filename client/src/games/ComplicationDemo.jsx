import React, { useState, useEffect } from 'react';
import { Siren, Timer, Check } from 'lucide-react';
import { useGameOutcomeHandler } from '../features/lesson-player/hooks/useGameOutcomeHandler';

const ComplicationDemo = ({ node }) => {
  const handleGameComplete = useGameOutcomeHandler(node);
  const outcomes = node.data.options || [];
  
  const [timer, setTimer] = useState(10);
  const [activeAlert, setActiveAlert] = useState(2); // Start with an initial alert
  const [status, setStatus] = useState('active'); // 'active', 'success', 'fail'

  // Game timer and alert switching logic
  useEffect(() => {
    if (status !== 'active') return;

    if (timer <= 0) {
      setStatus('fail');
      setTimeout(() => handleGameComplete(outcomes[1] || outcomes[0]), 1500);
      return;
    }

    const interval = setInterval(() => {
      setTimer(t => t - 1);
      // Randomly move the alert every 2-3 seconds
      if (Math.random() > 0.6) {
        setActiveAlert(Math.floor(Math.random() * 4));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, status, handleGameComplete, outcomes]);

  const handleAlertClick = (index) => {
    if (index === activeAlert && status === 'active') {
      setStatus('success');
      setTimeout(() => handleGameComplete(outcomes[0]), 1500);
    }
  };

  return (
    <div className="w-full max-w-md h-full bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-white font-sans">
      <h3 className="text-2xl font-bold text-red-400 flex items-center gap-2"><Siren /> System Complication</h3>
      <p className="text-sm text-gray-400">Resolve the active alert before system failure.</p>

      <div className="font-mono text-xl text-yellow-400 flex items-center gap-2">
        <Timer /> Time Remaining: {timer}s
      </div>

      <div className="w-full h-64 grid grid-cols-2 grid-rows-2 gap-2 my-4">
        {[0, 1, 2, 3].map(index => (
          <div 
            key={index} 
            className="bg-gray-800 rounded-lg flex items-center justify-center"
          >
            {activeAlert === index && status === 'active' && (
              <button 
                onClick={() => handleAlertClick(index)}
                className="w-24 h-24 bg-red-600 rounded-full animate-pulse flex items-center justify-center text-white"
              >
                <Siren size={48} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="h-8 text-xl">
        {status === 'success' && <p className="text-green-400">Alert Resolved! System stable.</p>}
        {status === 'fail' && <p className="text-red-500">System Failure! Cascade event triggered.</p>}
      </div>
    </div>
  );
};

export default ComplicationDemo;