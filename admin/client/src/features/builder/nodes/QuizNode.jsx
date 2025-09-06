import React from 'react';
import { Handle, Position } from '@xyflow/react';

const QuizNode = ({ data }) => {
  const { label, question, inputs = [] } = data;

  return (
    <div className="p-4 border-2 border-purple-500 rounded-md bg-white shadow-lg w-72">
      {/* Dynamic input handles */}
      {inputs.map((inp, i) => (
        <Handle
          key={inp.id}
          type="target"
          id={`in-${inp.id}`}
          position={Position.Top}
          style={{ left: `${((i + 1) * 100) / (inputs.length + 1)}%` }}
          className="w-2 h-2 !bg-purple-500"
        />
      ))}
      <div className="font-bold text-purple-800 mb-2">{label || 'Quiz'}</div>
      <div className="text-sm text-gray-700 mb-4">{question || 'No question set.'}</div>

      <div className="space-y-2 text-sm">
        <div className="relative bg-gray-50 p-2 rounded-md text-left">
          Correct
          <Handle type="source" position={Position.Right} id="correct" className="!bg-purple-500" style={{ top: '25%', right: -16 }} />
        </div>
        <div className="relative bg-gray-50 p-2 rounded-md text-left">
          Incorrect
          <Handle type="source" position={Position.Right} id="incorrect" className="!bg-purple-500" style={{ top: '75%', right: -16 }} />
        </div>
      </div>
    </div>
  );
};

export default QuizNode;
