import React from 'react';
import { inspectorTypes } from '../nodeRegistry';

const InspectorPanel = ({ node, onNodeUpdate, onNodeDelete }) => {
  if (!node) return null;
  const InspectorComponent = inspectorTypes[node.type];

  switch (node.type) {
    case 'input':
    case 'output':
      return (
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{node.data.label}</h3>
          <p className="text-sm text-gray-500">This is a system node and cannot be edited or deleted.</p>
        </div>
      );
    case 'narration':
    case 'quiz':
    case 'choice':
    case 'aiTrigger':
    case 'gameInteraction':
      return (
        <div className="flex flex-col h-full">
          <div className="flex-grow p-4">
            {InspectorComponent && <InspectorComponent node={node} onNodeUpdate={onNodeUpdate} />}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button onClick={() => onNodeDelete(node.id)} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">Delete Node</button>
          </div>
        </div>
      );
    default:
      return <p>No inspector for this node type.</p>;
  }
};

export default InspectorPanel;
