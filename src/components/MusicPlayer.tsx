/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  { id: '1', title: 'SYNTH_OVERLOAD', artist: 'NEO_GLITCH', duration: '3:45', color: '#00ffff' },
  { id: '2', title: 'CYBER_HEARTBEAT', artist: 'NULL_POINTER', duration: '4:20', color: '#ff00ff' },
  { id: '3', title: 'VORTEX_PROTOCOL', artist: 'RESONANCE_LAYER', duration: '2:58', color: '#f0f000' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="glass-panel flex-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-neon-magenta/10 rounded-full blur-3xl"></div>
        
        <div className="w-36 h-36 rounded-full border-2 border-dashed border-neon-magenta/50 flex items-center justify-center mb-8 relative">
           <motion.div 
             animate={{ rotate: isPlaying ? 360 : 0 }}
             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
             className="w-28 h-28 rounded-full bg-gradient-to-tr from-neon-magenta to-neon-cyan flex items-center justify-center overflow-hidden p-[2px]"
           >
              <div className="w-full h-full bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Music2 size={40} className="text-white opacity-80" />
              </div>
           </motion.div>
           
           {/* Pulsing rings when playing */}
           {isPlaying && [1, 2].map((i) => (
             <motion.div
               key={i}
               initial={{ scale: 1, opacity: 0.5 }}
               animate={{ scale: 1.5, opacity: 0 }}
               transition={{ repeat: Infinity, duration: 2, delay: i }}
               className="absolute inset-0 border border-neon-magenta rounded-full pointer-events-none"
             />
           ))}
        </div>

        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-white truncate w-full px-4">{currentTrack.title}</h3>
        <p className="text-xs text-neon-magenta font-mono tracking-[0.3em] uppercase mb-6">Now Playing</p>
        
        <div className="w-full space-y-2 px-4">
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="bg-neon-magenta h-full shadow-[0_0_10px_#ff00ff]"
                animate={{ width: `${progress}%` }}
              />
          </div>
          <div className="flex justify-between w-full text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <span>{Math.floor(progress * 2 / 60)}:{(Math.floor(progress * 2) % 60).toString().padStart(2, '0')}</span>
              <span>{currentTrack.duration}</span>
          </div>
        </div>
      </div>
      
      {/* Controls Container */}
      <div className="flex gap-4">
        <button 
          onClick={handlePrev}
          className="flex-1 py-4 glass-panel rounded-xl hover:bg-white/10 flex justify-center transition-all group active:scale-95"
        >
          <SkipBack size={24} className="text-white opacity-60 group-hover:opacity-100" />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-1 py-4 bg-white rounded-xl flex justify-center shadow-lg shadow-white/20 transition-all active:scale-95 cursor-pointer"
        >
          {isPlaying ? (
            <Pause size={24} className="fill-black text-black" />
          ) : (
            <Play size={24} className="fill-black text-black ml-1" />
          )}
        </button>
        
        <button 
          onClick={handleNext}
          className="flex-1 py-4 glass-panel rounded-xl hover:bg-white/10 flex justify-center transition-all group active:scale-95"
        >
          <SkipForward size={24} className="text-white opacity-60 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
