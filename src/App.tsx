import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono crt-overlay flex flex-col selection:bg-magenta-neon selection:text-black">
       {/* UI HEADER */}
       <header className="brutal-border border-b-8 p-4 mb-12 flex flex-col md:flex-row justify-between md:items-end bg-zinc-950 tear-layer z-10 relative">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold glitch-text leading-none shadow-black drop-shadow-xl" data-text="SYS.OVERRIDE">
            SYS.OVERRIDE
          </h1>
          <div className="text-left md:text-right text-cyan-neon flex flex-col mt-4 md:mt-0">
            <span className="text-lg bg-magenta-neon text-black px-2 self-start md:self-end">TERMINAL_ACTIVE: TRUE</span>
            <span className="text-sm mt-1 animate-pulse">V: 9.9.9 [FATAL_ERR]</span>
          </div>
       </header>

       {/* KERNEL SUBMODULES */}
       <main className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-12 w-full max-w-7xl mx-auto z-10 relative">
          
          <section className="glitch-bg brutal-border-alt p-6 flex flex-col relative bg-black/90">
             <div className="absolute -top-4 -right-4 bg-magenta-neon text-black px-4 py-2 text-xl font-bold border-2 border-black">
               PROC.01 // AUDIO
             </div>
             <MusicPlayer />
          </section>

          <section className="glitch-bg brutal-border p-6 flex flex-col bg-black/90 relative">
             <div className="absolute -top-4 -left-4 bg-cyan-neon text-black px-4 py-2 text-xl font-bold border-2 border-black">
               PROC.02 // KINETIC_TEST
             </div>
             <p className="text-zinc-500 text-sm mb-4">EXECUTE DIRECTIVES. CONSUME RAW DATA.</p>
             <div className="flex-1 flex items-center justify-center">
               <SnakeGame />
             </div>
          </section>

       </main>

       {/* FOOTER */}
       <footer className="mt-12 text-center text-sm text-magenta-neon opacity-70 crt-flicker z-10 relative">
         [ END OF LINE. MEMORY CORRUPTION DETECTED. ]
       </footer>
    </div>
  )
}
