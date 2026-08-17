import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameMode, Point, Particle, FoodItem } from '../types';
import { sound } from '../utils/audio';

interface BackgroundSnakeGameProps {
  opacity: number;
  gameMode: GameMode;
  onScoreUpdate: (score: number, highScore: number) => void;
  onModeChange: (mode: GameMode) => void;
  speedMultiplier: number;
  manualDirectionRequest?: Point | null;
  onClearDirectionRequest?: () => void;
}

export const BackgroundSnakeGame: React.FC<BackgroundSnakeGameProps> = ({
  opacity,
  gameMode,
  onScoreUpdate,
  onModeChange,
  speedMultiplier,
  manualDirectionRequest,
  onClearDirectionRequest,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game State Refs
  const snakeRef = useRef<Point[]>([
    { x: 12, y: 10 },
    { x: 11, y: 10 },
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const foodsRef = useRef<FoodItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef<number>(0);
  const highScoreRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const gridSizeRef = useRef<number>(26);
  const colsRef = useRef<number>(40);
  const rowsRef = useRef<number>(30);
  const isGodModeRef = useRef<boolean>(false);
  const idleTimerRef = useRef<number>(0);

  // Initialize high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aswin_snake_high_score');
    if (saved) {
      highScoreRef.current = parseInt(saved, 10) || 0;
      onScoreUpdate(scoreRef.current, highScoreRef.current);
    }
  }, [onScoreUpdate]);

  // Spawn random food item
  const spawnFood = useCallback(() => {
    const cols = colsRef.current;
    const rows = rowsRef.current;
    if (cols <= 0 || rows <= 0) return;

    let attempts = 0;
    let newX = Math.floor(Math.random() * cols);
    let newY = Math.floor(Math.random() * rows);

    while (
      attempts < 60 &&
      snakeRef.current.some(segment => segment.x === newX && segment.y === newY)
    ) {
      newX = Math.floor(Math.random() * cols);
      newY = Math.floor(Math.random() * rows);
      attempts++;
    }

    const rand = Math.random();
    let type: FoodItem['type'] = 'apple';
    let points = 10;
    let color = '#A04747'; // Brick red

    if (rand > 0.85) {
      type = 'star';
      points = 50;
      color = '#FFD700'; // Gold Star
    } else if (rand > 0.65) {
      type = 'gem';
      points = 25;
      color = '#708238'; // Emerald Gem
    } else if (rand > 0.4) {
      type = 'gold_coin';
      points = 15;
      color = '#E0A96D'; // Caramel Gold
    }

    foodsRef.current.push({
      x: newX,
      y: newY,
      type,
      points,
      color,
      spawnTime: Date.now(),
    });
  }, []);

  // Ensure 4-6 foods are always roaming the map
  const maintainFoodSupply = useCallback(() => {
    while (foodsRef.current.length < 5) {
      spawnFood();
    }
  }, [spawnFood]);

  // Spawn floating score particles and bursts
  const addParticles = (x: number, y: number, text: string, color: string) => {
    const grid = gridSizeRef.current;
    const px = x * grid + grid / 2;
    const py = y * grid + grid / 2;

    // Floating score text
    particlesRef.current.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -1.6,
      life: 0,
      maxLife: 45,
      color: color,
      size: 14,
      text: text,
    });

    // Burst sparkle pixels
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const speed = 1.5 + Math.random() * 2.0;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30,
        color: color,
        size: Math.random() > 0.5 ? 5 : 3,
      });
    }
  };

  // Autonomous AI Pathfinding
  const computeNextAiDirection = (): Point => {
    const head = snakeRef.current[0];
    const cols = colsRef.current;
    const rows = rowsRef.current;
    const currentDir = dirRef.current;

    if (foodsRef.current.length === 0) return currentDir;

    // Find nearest food
    let nearestFood = foodsRef.current[0];
    let minDist = Infinity;
    for (const food of foodsRef.current) {
      const dist = Math.abs(food.x - head.x) + Math.abs(food.y - head.y);
      if (dist < minDist) {
        minDist = dist;
        nearestFood = food;
      }
    }

    const possibleMoves: Point[] = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 },  // Right
    ];

    // Filter out 180 reverse move
    const validMoves = possibleMoves.filter(
      move => !(move.x === -currentDir.x && move.y === -currentDir.y)
    );

    // Evaluate safe moves (no collision with body)
    const safeMoves = validMoves.filter(move => {
      let nx = head.x + move.x;
      let ny = head.y + move.y;

      // Wrap around logic
      if (nx < 0) nx = cols - 1;
      if (nx >= cols) nx = 0;
      if (ny < 0) ny = rows - 1;
      if (ny >= rows) ny = 0;

      // Snake body check (ignore tail tip)
      for (let i = 0; i < snakeRef.current.length - 1; i++) {
        if (snakeRef.current[i].x === nx && snakeRef.current[i].y === ny) {
          return false;
        }
      }
      return true;
    });

    if (safeMoves.length === 0) {
      return currentDir;
    }

    // Pick safe move that gets closer to nearest food
    safeMoves.sort((a, b) => {
      let nxa = head.x + a.x;
      let nya = head.y + a.y;
      if (nxa < 0) nxa = cols - 1;
      if (nxa >= cols) nxa = 0;
      if (nya < 0) nya = rows - 1;
      if (nya >= rows) nya = 0;

      let nxb = head.x + b.x;
      let nyb = head.y + b.y;
      if (nxb < 0) nxb = cols - 1;
      if (nxb >= cols) nxb = 0;
      if (nyb < 0) nyb = rows - 1;
      if (nyb >= rows) nyb = 0;

      const distA = Math.abs(nxa - nearestFood.x) + Math.abs(nya - nearestFood.y);
      const distB = Math.abs(nxb - nearestFood.x) + Math.abs(nyb - nearestFood.y);
      return distA - distB;
    });

    return safeMoves[0];
  };

  // Respawn Snake
  const respawnSnake = useCallback(() => {
    const cols = colsRef.current || 30;
    const rows = rowsRef.current || 20;
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);

    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 4, y: startY },
      { x: startX - 5, y: startY },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
  }, []);

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      const grid = width < 768 ? 22 : 28;
      gridSizeRef.current = grid;
      colsRef.current = Math.floor(width / grid);
      rowsRef.current = Math.floor(height / grid);

      maintainFoodSupply();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maintainFoodSupply]);

  // Handle Manual Direction Requests from D-Pad
  useEffect(() => {
    if (manualDirectionRequest) {
      const current = dirRef.current;
      if (!(manualDirectionRequest.x === -current.x && manualDirectionRequest.y === -current.y)) {
        nextDirRef.current = manualDirectionRequest;
        if (gameMode !== 'manual') {
          onModeChange('manual');
        }
        idleTimerRef.current = Date.now();
      }
      if (onClearDirectionRequest) {
        onClearDirectionRequest();
      }
    }
  }, [manualDirectionRequest, gameMode, onModeChange, onClearDirectionRequest]);

  // Keyboard Controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      let newDir: Point | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newDir = { x: 1, y: 0 };
          break;
        case ' ':
          if (gameMode === 'paused') {
            onModeChange('manual');
            sound.playClick();
          } else if (gameMode === 'manual' || gameMode === 'auto') {
            onModeChange('paused');
            sound.playClick();
          }
          return;
      }

      if (newDir) {
        e.preventDefault();
        const current = dirRef.current;
        if (!(newDir.x === -current.x && newDir.y === -current.y)) {
          nextDirRef.current = newDir;
          if (gameMode !== 'manual') {
            onModeChange('manual');
          }
          idleTimerRef.current = Date.now();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, onModeChange]);

  // Main Canvas Render & Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const grid = gridSizeRef.current;
      const cols = colsRef.current;
      const rows = rowsRef.current;

      const baseInterval = gameMode === 'auto' ? 130 : 100;
      const moveInterval = Math.max(45, baseInterval / speedMultiplier);

      // 1. UPDATE GAME STATE
      if (gameMode !== 'paused' && timestamp - lastMoveTimeRef.current > moveInterval) {
        lastMoveTimeRef.current = timestamp;

        if (gameMode === 'auto') {
          nextDirRef.current = computeNextAiDirection();
        }

        dirRef.current = nextDirRef.current;
        const head = snakeRef.current[0];
        const newHead: Point = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        // Wall wrapping
        if (newHead.x < 0) newHead.x = cols - 1;
        if (newHead.x >= cols) newHead.x = 0;
        if (newHead.y < 0) newHead.y = rows - 1;
        if (newHead.y >= rows) newHead.y = 0;

        // Check self-collision
        let selfCollision = false;
        if (!isGodModeRef.current) {
          for (let i = 1; i < snakeRef.current.length; i++) {
            if (snakeRef.current[i].x === newHead.x && snakeRef.current[i].y === newHead.y) {
              selfCollision = true;
              break;
            }
          }
        }

        if (selfCollision) {
          sound.playGameOver();
          addParticles(newHead.x, newHead.y, 'GAME OVER!', '#A04747');
          scoreRef.current = 0;
          onScoreUpdate(0, highScoreRef.current);
          respawnSnake();
          onModeChange('auto');
        } else {
          // Check Food Collision
          let ateFoodIndex = -1;
          for (let i = 0; i < foodsRef.current.length; i++) {
            if (foodsRef.current[i].x === newHead.x && foodsRef.current[i].y === newHead.y) {
              ateFoodIndex = i;
              break;
            }
          }

          if (ateFoodIndex !== -1) {
            const eaten = foodsRef.current[ateFoodIndex];
            foodsRef.current.splice(ateFoodIndex, 1);

            scoreRef.current += eaten.points;
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              localStorage.setItem('aswin_snake_high_score', String(highScoreRef.current));
            }
            onScoreUpdate(scoreRef.current, highScoreRef.current);

            if (eaten.type === 'star' || eaten.type === 'gem') {
              sound.playSpecialEat();
            } else {
              sound.playEat();
            }

            addParticles(newHead.x, newHead.y, `+${eaten.points}`, eaten.color);

            snakeRef.current.unshift(newHead);
            maintainFoodSupply();
          } else {
            snakeRef.current.unshift(newHead);
            snakeRef.current.pop();
          }
        }
      }

      // 2. RENDER STAGE
      // Clear canvas cleanly so underlying DOM elements and background colors blend
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle Background Grid Dots
      ctx.fillStyle = 'rgba(166, 123, 91, 0.18)';
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if ((c + r) % 2 === 0) {
            ctx.fillRect(c * grid + grid / 2 - 1.5, r * grid + grid / 2 - 1.5, 3, 3);
          }
        }
      }

      // 3. RENDER FOODS
      foodsRef.current.forEach(food => {
        const fx = food.x * grid;
        const fy = food.y * grid;
        const time = Date.now() / 200;
        const bob = Math.sin(time + food.x * 2) * 3;

        ctx.save();
        ctx.translate(0, bob);

        // Food Pulsing Aura / Shadow
        ctx.fillStyle = 'rgba(224, 169, 109, 0.25)';
        ctx.fillRect(fx + 1, fy + 1, grid - 2, grid - 2);

        if (food.type === 'apple') {
          // Pixel Apple with High-Contrast Border
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(fx + 3, fy + 5, grid - 6, grid - 8);
          ctx.fillRect(fx + 5, fy + 3, grid - 10, grid - 4);

          // Red Flesh
          ctx.fillStyle = '#C0392B';
          ctx.fillRect(fx + 5, fy + 7, grid - 10, grid - 12);
          ctx.fillRect(fx + 7, fy + 5, grid - 14, grid - 8);

          // Apple Highlight
          ctx.fillStyle = '#FFA07A';
          ctx.fillRect(fx + 7, fy + 7, 3, 3);

          // Green Leaf
          ctx.fillStyle = '#2ECC71';
          ctx.fillRect(fx + grid / 2 - 1, fy + 2, 4, 3);
        } else if (food.type === 'gold_coin') {
          // Pixel Coin: Gold circle with dark border
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(fx + 3, fy + 3, grid - 6, grid - 6);
          ctx.fillRect(fx + 5, fy + 1, grid - 10, grid - 2);

          ctx.fillStyle = '#F39C12';
          ctx.fillRect(fx + 5, fy + 5, grid - 10, grid - 10);
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(fx + 6, fy + 6, grid - 12, grid - 12);

          // Inner '$' or coin slot
          ctx.fillStyle = '#3C2A21';
          ctx.fillRect(fx + grid / 2 - 1.5, fy + 5, 3, grid - 10);
        } else if (food.type === 'gem') {
          // Pixel Emerald Gem
          ctx.fillStyle = '#1E120B';
          ctx.beginPath();
          ctx.moveTo(fx + grid / 2, fy + 1);
          ctx.lineTo(fx + grid - 2, fy + grid / 2);
          ctx.lineTo(fx + grid / 2, fy + grid - 2);
          ctx.lineTo(fx + 2, fy + grid / 2);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#27AE60';
          ctx.beginPath();
          ctx.moveTo(fx + grid / 2, fy + 3);
          ctx.lineTo(fx + grid - 4, fy + grid / 2);
          ctx.lineTo(fx + grid / 2, fy + grid - 4);
          ctx.lineTo(fx + 4, fy + grid / 2);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#A3E4D7';
          ctx.fillRect(fx + grid / 2 - 2, fy + grid / 2 - 2, 4, 4);
        } else {
          // Pixel Star: Golden 4-point star
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(fx + grid / 2 - 3, fy + 1, 6, grid - 2);
          ctx.fillRect(fx + 1, fy + grid / 2 - 3, grid - 2, 6);

          ctx.fillStyle = '#F1C40F';
          ctx.fillRect(fx + grid / 2 - 2, fy + 2, 4, grid - 4);
          ctx.fillRect(fx + 2, fy + grid / 2 - 2, grid - 4, 4);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(fx + grid / 2 - 2, fy + grid / 2 - 2, 4, 4);
        }

        ctx.restore();
      });

      // 4. RENDER SNAKE
      const snake = snakeRef.current;
      snake.forEach((segment, index) => {
        const sx = segment.x * grid;
        const sy = segment.y * grid;
        const isHead = index === 0;

        if (isHead) {
          // Snake Head Outer Dark Border
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(sx, sy, grid, grid);

          // Head Core Color (Vibrant Retro Green)
          ctx.fillStyle = '#588157';
          ctx.fillRect(sx + 2, sy + 2, grid - 4, grid - 4);

          // Head Highlight
          ctx.fillStyle = '#A3B18A';
          ctx.fillRect(sx + 3, sy + 3, grid - 6, 3);

          // Eyes based on direction
          const dir = dirRef.current;
          let eye1 = { x: sx + 6, y: sy + 6 };
          let eye2 = { x: sx + grid - 10, y: sy + 6 };

          if (dir.x === 1) { // Facing right
            eye1 = { x: sx + grid - 8, y: sy + 5 };
            eye2 = { x: sx + grid - 8, y: sy + grid - 9 };
          } else if (dir.x === -1) { // Facing left
            eye1 = { x: sx + 4, y: sy + 5 };
            eye2 = { x: sx + 4, y: sy + grid - 9 };
          } else if (dir.y === 1) { // Facing down
            eye1 = { x: sx + 5, y: sy + grid - 8 };
            eye2 = { x: sx + grid - 9, y: sy + grid - 8 };
          } else if (dir.y === -1) { // Facing up
            eye1 = { x: sx + 5, y: sy + 4 };
            eye2 = { x: sx + grid - 9, y: sy + 4 };
          }

          // Dark eye sockets
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(eye1.x - 1, eye1.y - 1, 5, 5);
          ctx.fillRect(eye2.x - 1, eye2.y - 1, 5, 5);

          // White pupils
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(eye1.x, eye1.y, 3, 3);
          ctx.fillRect(eye2.x, eye2.y, 3, 3);

          // Black iris
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(eye1.x + 1, eye1.y + 1, 2, 2);
          ctx.fillRect(eye2.x + 1, eye2.y + 1, 2, 2);

          // Tongue flick animation
          const tongueFlick = Math.floor(Date.now() / 300) % 2 === 0;
          if (tongueFlick) {
            ctx.fillStyle = '#E74C3C';
            if (dir.x === 1) {
              ctx.fillRect(sx + grid, sy + grid / 2 - 1, 5, 2);
            } else if (dir.x === -1) {
              ctx.fillRect(sx - 5, sy + grid / 2 - 1, 5, 2);
            } else if (dir.y === 1) {
              ctx.fillRect(sx + grid / 2 - 1, sy + grid, 2, 5);
            } else if (dir.y === -1) {
              ctx.fillRect(sx + grid / 2 - 1, sy - 5, 2, 5);
            }
          }
        } else {
          // Body segments with dark pixel outlines
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(sx + 1, sy + 1, grid - 2, grid - 2);

          const isAlternate = index % 2 === 0;
          ctx.fillStyle = isAlternate ? '#606C38' : '#708238';
          ctx.fillRect(sx + 3, sy + 3, grid - 6, grid - 6);

          // Segment dorsal scale pattern
          ctx.fillStyle = '#8BA848';
          ctx.fillRect(sx + grid / 2 - 2, sy + grid / 2 - 2, 4, 4);
        }
      });

      // 5. RENDER PARTICLES
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = alpha;

        if (p.text) {
          ctx.font = 'bold 13px "Press Start 2P", monospace';
          // Dark drop shadow
          ctx.fillStyle = '#1E120B';
          ctx.fillText(p.text, p.x + 2, p.y + 2);
          ctx.fillStyle = p.color;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = '#1E120B';
          ctx.fillRect(p.x - 1, p.y - 1, p.size + 2, p.size + 2);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        ctx.restore();

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, speedMultiplier, onScoreUpdate, onModeChange, respawnSnake, maintainFoodSupply]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 select-none overflow-hidden"
      style={{ opacity: opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
