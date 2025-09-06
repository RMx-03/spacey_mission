import React from 'react';
import { Video, X } from 'lucide-react';

const WebcamView = ({ onToggle, isCollapsible = false }) => {
  return (
    <div className="bg-gray-900/70 p-4 rounded-lg flex items-center justify-center aspect-video relative">
      {isCollapsible && (
        <button
          onClick={onToggle}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10 lg:hidden"
          aria-label="Close Webcam View"
        >
          <X size={20} />
        </button>
      )}
      <div className="text-center text-gray-500">
        <Video size={48} className="mx-auto mb-2" />
        <p>Webcam View</p>
      </div>
    </div>
  );
};

export default WebcamView;
