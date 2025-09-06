import React from 'react';
import { X } from 'lucide-react';

const LessonOutline = ({ nodes = [], onToggle, isCollapsible = false }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-cyan-green">Lesson Outline</h2>
        {isCollapsible && (
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white transition-colors lg:hidden"
            aria-label="Close Lesson Outline"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <ul className="space-y-2 flex-grow overflow-y-auto">
        {nodes.map((node) => (
          <li key={node.id} className="text-white/80 p-2 rounded hover:bg-gray-700/50 transition-colors cursor-pointer">
            {node.data?.label || `Node: ${node.type}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonOutline;
