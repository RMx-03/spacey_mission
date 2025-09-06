import React from 'react';
import { Clock, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSound from 'use-sound';
import ctaButtonSound from '../../../assets/sounds/Button03.wav';

const LessonCard = ({ lesson }) => {
  const { id, title, shortDescription, estimatedDuration, iconUrl } = lesson;
  const [playCta] = useSound(ctaButtonSound, { volume: 0.25, playbackRate: 1.1 });

  return (
    <Link
      to={`/dashboard/lessons/${id}`}
      onMouseEnter={playCta}
      onClick={playCta}
      className="bg-deep-black/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col h-full group transition-all duration-300 hover:border-cyan-green/70 hover:shadow-[0_0_25px_rgba(46,243,209,0.3)] hover:-translate-y-2 w-full max-w-sm"
    >
      <div className="aspect-video w-full overflow-hidden">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-purple-900 flex items-center justify-center">
            <Rocket size={48} className="text-white/70" />
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-cyan-green mb-2">{title}</h3>
        <p className="text-white/80 mb-4 flex-grow line-clamp-3 group-hover:line-clamp-none" title={shortDescription}>{shortDescription}</p>
        
        <div className="flex items-center text-logo-yellow mb-6">
          <Clock size={18} className="mr-2" />
          <span>{estimatedDuration}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-white/20">
          <div className="inline-flex items-center justify-center gap-2 w-full bg-cyan-green text-deep-black font-bold px-6 py-3 rounded-full text-lg transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-105">
            <Rocket size={20} />
            <span>Start</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard;
