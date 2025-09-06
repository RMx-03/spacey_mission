import React from 'react';
import { Handle, Position } from '@xyflow/react';

const GameInteractionNode = ({ data }) => {
  const { label, game_id, prompt, options = [], inputs = [] } = data;

  // Creates a stable handle ID from the option's unique ID.
  const createOutputHandleId = (optionId) => {
    return `game-outcome-${optionId}`;
  };

  const createInputHandleId = (inputId) => {
    return `game-outcome-in-${inputId}`;
  };

  return (
    <div className="p-4 border-2 border-orange-500 rounded-md bg-white shadow-lg w-72">
      {/* Dynamic input handles */}
      {inputs.map((inp, i) => (
        <Handle
          key={inp.id}
          type="target"
          id={createInputHandleId(inp.id)}
          position={Position.Top}
          style={{ left: `${((i + 1) * 100) / (inputs.length + 1)}%` }}
          className="w-2 h-2 !bg-orange-500"
        />
      ))}

      <div className="font-bold text-orange-800 mb-2">{label || 'Game Interaction'}</div>
      <div className="text-xs font-mono bg-gray-100 p-1 rounded mb-2">ID: {game_id || 'Not set'}</div>
      <p className="text-sm text-gray-700 mb-4">{prompt || 'No prompt set.'}</p>

      <div className="space-y-2 text-sm">
        <div className="text-xs text-gray-500 font-semibold">Outcomes (Options):</div>
        {options.length > 0 ? (
          options.map((option, index) => {
            // Handle both old (string) and new ({id, text}) option formats for graceful migration.
            const isObject = typeof option === 'object' && option !== null && option.id;
            const optionId = isObject ? option.id : `fallback-${index}`;
            const optionText = isObject ? option.text : option;

            return (
              <div key={optionId} className="relative bg-gray-50 p-2 rounded-md text-left">
                {optionText || `Outcome ${index + 1}`}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={createOutputHandleId(optionId)}
                  className="!bg-orange-500"
                  style={{ top: `${(index + 1) * (100 / (options.length + 1))}%` }}
                />
              </div>
            );
          })
        ) : (
          <div className="text-xs text-gray-400">No outcomes configured.</div>
        )}
      </div>
    </div>
  );
};

export default GameInteractionNode;