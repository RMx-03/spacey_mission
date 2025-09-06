import React from 'react';
import { Handle, Position } from '@xyflow/react';

const NarrationNode = ({ data }) => {
  const { label, text, inputs = [], outputs = [] } = data;

  return (
    <div className="p-4 border-2 border-gray-400 rounded-md bg-white shadow-lg w-72">
      {/* Dynamic input handles */}
      {inputs.map((inp, i) => (
        <Handle
          key={inp.id}
          type="target"
          id={`in-${inp.id}`}
          position={Position.Top}
          style={{ left: `${((i + 1) * 100) / (inputs.length + 1)}%` }}
          className="w-2 h-2 !bg-gray-500"
        />
      ))}

      <div className="font-bold text-gray-800 mb-2">{label || 'Narration'}</div>
      <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{text || 'No text set.'}</p>

      {/* Dynamic output handles */}
      {outputs.map((out, i) => (
        <Handle key={out.id} type="source" id={`out-${out.id}`} position={Position.Right} style={{ top: `${((i + 1) * 100) / (outputs.length + 1)}%` }} className="w-2 h-2 !bg-gray-500" />
      ))}
    </div>
  );
};

export default NarrationNode;
