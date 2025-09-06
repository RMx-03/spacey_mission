import React from 'react';
import { Handle, Position } from '@xyflow/react';

const AITriggerNode = ({ data }) => {
  const { label, ai_action, inputs = [], outputs = [] } = data;

  return (
    <div className="p-4 border-2 border-cyan-500 rounded-md bg-white shadow-lg w-72">
      {/* Dynamic input handles */}
      {inputs.map((inp, i) => (
        <Handle
          key={inp.id}
          type="target"
          id={`in-${inp.id}`}
          position={Position.Top}
          style={{ left: `${((i + 1) * 100) / (inputs.length + 1)}%` }}
          className="w-2 h-2 !bg-cyan-500"
        />
      ))}
      <div className="font-bold text-cyan-800 mb-2">{label || 'AI Trigger'}</div>
      <p className="text-sm text-gray-700">
        Action: <span className="font-mono bg-gray-100 p-1 rounded text-xs">{ai_action || 'Not set'}</span>
      </p>

      {/* Dynamic output handles */}
      {outputs.map((out, i) => (
        <Handle key={out.id} type="source" id={`out-${out.id}`} position={Position.Right} style={{ top: `${((i + 1) * 100) / (outputs.length + 1)}%` }} className="w-2 h-2 !bg-cyan-500" />
      ))}
    </div>
  );
};

export default AITriggerNode;