import React from 'react';
import { Gamepad2 } from 'lucide-react';

/**
 * Renders a game interaction block in the chat panel.
 * It displays a prompt indicating a game has started.
 * @param {{ node: Object }} props
 */
const GameInteractionBlock = ({ node }) => {
  if (!node || !node.data) {
    return null;
  }

  const { prompt } = node.data;

  return (
    <div className="bg-purple-800/30 border border-purple-600/40 p-4 rounded-lg text-white animate-fade-in">
      <div className="flex items-center gap-3">
        <Gamepad2 className="h-8 w-8 text-purple-400 flex-shrink-0" />
        <p className="whitespace-pre-wrap">{prompt || 'Game started! Look at the interaction panel to play.'}</p>
      </div>
    </div>
  );
};

export default GameInteractionBlock;