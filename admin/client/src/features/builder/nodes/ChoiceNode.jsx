import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ChoiceNode = ({ data }) => {
  const { label, prompt, options = [], inputs = [] } = data;

  // Creates a stable handle ID from the option's unique ID.
  const createHandleId = (optionId) => {
    return `choice-out-${optionId}`;
  };

  return (
    <div className="p-4 border-2 border-green-500 rounded-md bg-white shadow-lg w-72">
      {/* Dynamic input handles */}
      {inputs.map((inp, i) => (
        <Handle
          key={inp.id}
          type="target"
          id={`in-${inp.id}`}
          position={Position.Top}
          style={{ left: `${((i + 1) * 100) / (inputs.length + 1)}%` }}
          className="w-2 h-2 !bg-green-500"
        />
      ))}
      <div className="font-bold text-green-800 mb-2">{label || 'Choice'}</div>
      <p className="text-sm text-gray-700 mb-4">{prompt || 'No prompt set.'}</p>
      
      <div className="space-y-2 text-sm">
        {options.length > 0 ? (
          options.map((option, index) => {
            const isObject = typeof option === 'object' && option !== null && option.id;
            const optionId = isObject ? option.id : `fallback-${index}`;
            const optionText = isObject ? option.text : option;

            return (<div key={optionId} className="relative bg-gray-50 p-2 rounded-md text-left">
              {optionText || `Option ${index + 1}`}
              <Handle
                type="source"
                position={Position.Right}
                id={createHandleId(optionId)}
                className="!bg-green-500"
                style={{ top: `${(index + 1) * (100 / (options.length + 1))}%` }}
              />
            </div>);
          })
        ) : (
          <div className="text-xs text-gray-400">No options configured.</div>
        )}
      </div>
    </div>
  );
};

export default ChoiceNode;