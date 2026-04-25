/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Shield, Zap, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-deep-black flex flex-col p-8 relative select-none selection:hidden font-sans">
      <div className="crt-flicker" />
      
      {/* Header */}
      <header className="flex justify-between items-end mb-8 relative z-50">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase neon-text-pink leading-none glitch-text" data-text="SynthSnake">SynthSnake</h1>
          <p className="text-xs tracking-[0.4em] neon-text-cyan opacity-70 mt-2 font-mono uppercase">Neural-Sync Audio Interface v4.02</p>
        </div>
        <div className="flex gap-12 font-mono">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Current Score</p>
            <motion.p 
              key={score}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold neon-text-cyan leading-none"
            >
              {score.toLocaleString().padStart(6, '0')}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Session ID</p>
            <p className="text-3xl font-bold text-gray-400 opacity-50 leading-none">AX-992-KIP</p>
          </div>
        </div>
      </header>

      {/* Main Content Area: 12-column grid */}
      <main className="flex-1 grid grid-cols-12 gap-8 min-h-0 relative z-10">
        
        {/* Left Side: Audio Queue (Aside) */}
        <aside className="col-span-3 flex flex-col gap-4">
          <div className="glass-panel p-6 flex-1 rounded-2xl flex flex-col">
            <h2 className="text-xs font-bold neon-text-cyan mb-6 uppercase tracking-[0.3em] font-mono">System Telemetry</h2>
            <div className="space-y-4 font-mono">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border-l-4 border-neon-cyan">
                <div className="w-10 h-10 bg-cyan-900/30 rounded flex items-center justify-center neon-text-cyan text-xs">01</div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">CORE_PROCESS.exe</p>
                  <p className="text-[10px] text-gray-500 uppercase">Status: Optimal</p>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 transition-all hover:text-white cursor-crosshair">
                   <span>LATENCY</span>
                   <span className="neon-text-cyan">4ms</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                   <span>BUFFER</span>
                   <span className="text-green-500">STABLE</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-500">
                   <span>ENCRYPT</span>
                   <span className="text-neon-magenta animate-pulse">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-gray-400">OSCILLOSCOPE</span>
              <span className="text-[10px] font-mono text-neon-cyan">ACTIVE</span>
            </div>
            <div className="h-12 flex items-end gap-1 px-1">
              {[0.2, 0.6, 0.4, 0.9, 0.7, 0.2, 0.5, 0.8, 0.3, 0.6].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [`${h * 100}%`, `${(h + 0.2) * 80}%`, `${h * 100}%`] }}
                  transition={{ repeat: Infinity, duration: 1.5 + i * 0.1 }}
                  className="flex-1 bg-neon-cyan opacity-60"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Center: The Game */}
        <div className="col-span-6 flex items-center justify-center relative">
          <div className="w-full aspect-square neon-border-cyan rounded-xl bg-black relative overflow-hidden grid-bg flex items-center justify-center p-8">
            <SnakeGame onScoreChange={setScore} />
            <div className="z-10 text-[10px] font-mono text-neon-cyan/20 absolute bottom-4 uppercase tracking-[0.5em]">SYSTEM_ACTIVE // GAME_MODE_SYNCED</div>
          </div>
        </div>

        {/* Right Side: Music Player (Aside) */}
        <aside className="col-span-3 flex flex-col">
          <MusicPlayer />
        </aside>

      </main>

      {/* Footer */}
      <footer className="mt-8 flex justify-between items-center text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] relative z-50">
        <div>OS: {navigator.platform} // ENV: PRODUCTION</div>
        <div className="flex gap-8">
          <span>Neural Engine Alpha v4.0.2</span>
          <span>© 2026 AI SYNTHETICS</span>
        </div>
      </footer>
    </div>
  );
}
