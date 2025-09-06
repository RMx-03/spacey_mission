import React from 'react';
import { nodeCreator } from '../nodeRegistry';

const NodePalette = ({ onAddNode }) => {
  // Define the order and display names for the palette
  const paletteItems = [
    { type: 'narration', label: 'Add Narration' },
    { type: 'choice', label: 'Add Choice (Branch)' },
    { type: 'quiz', label: 'Add Multiple Choice' },
    { type: 'gameInteraction', label: 'Add Game Interaction' },
    { type: 'aiTrigger', label: 'Add AI Trigger' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Blocks</h3>
      <div className="space-y-2">
        {paletteItems.map(item => (
          nodeCreator[item.type] && <button key={item.type} onClick={() => onAddNode(item.type)} className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">{item.label}</button>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;
