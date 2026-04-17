import { useEffect, useState, useCallback, useRef } from 'react';

const GRID_SIZE = 15; // chunky grid
const INITIAL_SNAKE = [
  { x: 7, y: 7 },
  { x: 7, y: 8 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 3, y: 3 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const collision = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent screen scrolling when using arrow keys, space, or standard game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isStarted && e.key.startsWith('Arrow')) {
         setIsStarted(true);
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted]);

  useEffect(() => {
    if (gameOver || !isStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120);
    return () => clearInterval(intervalId);
  }, [gameOver, food, isStarted, generateFood]);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Ticker HUD border */}
      <div className="w-full max-w-[340px] mb-4 bg-zinc-950 border-4 border-magenta-neon p-3 flex justify-between items-center">
        <span className="text-magenta-neon text-xl font-bold">DATA_EXTRACT: <span className="text-white ml-2">{score.toString().padStart(4, '0')}</span></span>
        <span className={`text-xl font-bold bg-black px-2 ${gameOver ? 'text-cyan-neon animate-pulse' : 'text-zinc-600'}`}>
          {gameOver ? 'ERR:0x0' : isStarted ? 'RUN' : 'WAIT'}
        </span>
      </div>

      <div className="relative border-8 border-cyan-neon bg-black p-1 shadow-[8px_8px_0_#f0f] crt-flicker tear-layer">
        
        {/* Play Area */}
        <div 
          className="grid gap-0.5 bg-zinc-900" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 22px)`, 
            gridTemplateRows: `repeat(${GRID_SIZE}, 22px)` 
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = 'w-full h-full ';
            
            if (isHead) {
              cellClass += 'bg-magenta-neon shadow-[0_0_8px_#f0f] z-10';
            } else if (isBody) {
              cellClass += 'bg-magenta-neon opacity-70';
            } else if (isFood) {
              cellClass += 'bg-cyan-neon animate-pulse shadow-[0_0_8px_#0ff]';
            } else {
              cellClass += 'bg-black'
            }

            return <div key={i} className={cellClass} />;
          })}
        </div>

        {/* HUD Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-cyan-neon/30 flex flex-col items-center justify-center backdrop-blur-sm z-10 border-8 border-magenta-neon">
            <h2 className="text-4xl font-bold text-magenta-neon bg-black px-4 py-2 mb-6 glitch-text" data-text="CORRUPTION">
              CORRUPTION
            </h2>
            <button 
              onClick={resetGame}
              className="bg-black text-cyan-neon text-2xl font-bold border-4 border-cyan-neon px-6 py-3 hover:bg-cyan-neon hover:text-black transition-none uppercase focus:outline-none focus:ring-4 ring-magenta-neon"
            >
              [ RESTART_SYS ]
            </button>
          </div>
        )}
        
        {!isStarted && !gameOver && (
           <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-4 border-cyan-neon p-4 text-center">
             <div className="text-cyan-neon text-3xl font-bold mb-4 animate-pulse uppercase tracking-widest">
               AWAITING INPUT
             </div>
             <div className="text-base font-bold text-zinc-500 border border-zinc-800 p-2">
               &gt; PRESS_ANY_ARROW_KEY
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
