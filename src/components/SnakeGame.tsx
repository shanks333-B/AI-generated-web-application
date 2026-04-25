/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const GAME_SPEED = 150;

type Point = { x: number; y: number };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 h-full w-full">
      <div 
        className="grid bg-black/40 relative z-10"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(90%, 400px)',
          aspectRatio: '1/1'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`w-full h-full flex items-center justify-center`}
            >
              {isSnake && (
                <motion.div 
                  layoutId={`snake-${x}-${y}`}
                  className={`w-[90%] h-[90%] rounded-sm ${isHead ? 'bg-white shadow-[0_0_15px_#fff]' : 'bg-neon-cyan shadow-[0_0_8px_#00ffff]'}`}
                />
              )}
              {isFood && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-[70%] h-[70%] bg-neon-magenta rounded-full shadow-[0_0_15px_#ff00ff]"
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {(isGameOver || isPaused) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-20"
          >
            {isGameOver ? (
              <>
                <h2 className="text-5xl font-black italic tracking-tighter neon-text-pink mb-4 glitch-text" data-text="GAME OVER">GAME OVER</h2>
                <p className="text-neon-cyan mb-8 font-mono tracking-widest text-sm">FINAL_CORE_SYNC: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-10 py-4 neon-border-pink text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all font-bold italic tracking-tighter uppercase rounded-xl"
                >
                  Reboot System
                </button>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black italic tracking-tighter text-neon-cyan mb-8" data-text="PAUSED">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-4 neon-border-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-bold italic tracking-tighter uppercase rounded-xl"
                >
                  Resume Stream
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-8 flex gap-8 text-[10px] opacity-40 text-neon-cyan font-mono tracking-widest">
        <span>[WASD/ARROWS] NAV</span>
        <span>[SPACE] TOGGLE</span>
      </div>
    </div>
  );
}
