import { useEffect, useState } from 'react';
import { synthEngine, TRACKS } from '../lib/synth';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      synthEngine.play(currentTrack);
    } else if (hasStarted) {
      synthEngine.pause();
    }
    return () => synthEngine.pause();
  }, [isPlaying, currentTrack, hasStarted]);

  const togglePlay = () => {
    if (!hasStarted) setHasStarted(true);
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div className="w-full flex flex-col h-full gap-8 justify-between mt-4">
      
      {/* Stream Selector */}
      <div className="flex-1 w-full">
        <h2 className="text-3xl text-cyan-neon mb-4 border-b-4 border-cyan-neon pb-2">AUDIO_STREAM_MUX</h2>
        <div className="flex flex-col gap-3">
          {TRACKS.map((track, i) => (
             <div 
               key={track.id} 
               onClick={() => {
                 setCurrentTrack(i);
                 if (!isPlaying) {
                   setHasStarted(true);
                   setIsPlaying(true);
                 }
               }}
               className={`p-3 flex items-center justify-between border-2 cursor-pointer transition-none ${
                 i === currentTrack 
                   ? 'bg-cyan-neon text-black border-cyan-neon shadow-[4px_4px_0_#f0f]' 
                   : 'border-zinc-800 text-zinc-500 hover:border-cyan-neon hover:text-cyan-neon'
               }`}
             >
               <span className="font-bold text-xl">[{i.toString().padStart(2, '0')}]</span>
               <span className="truncate ml-4 flex-1 text-lg">{track.title}</span>
               {i === currentTrack && isPlaying && <span className="animate-pulse tracking-widest text-xl">|||</span>}
             </div>
          ))}
        </div>
      </div>

      {/* Control Deck */}
      <div className="bg-zinc-950 border-4 border-magenta-neon p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center bg-black p-2 border border-magenta-neon/50">
           <span className="text-magenta-neon text-lg">DECODER_STATUS:</span>
           <span className={`text-xl font-bold ${isPlaying ? 'text-cyan-neon' : 'text-zinc-600'}`}>{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
           <button 
             onClick={skipBack} 
             className="bg-black border-2 border-cyan-neon text-cyan-neon py-6 text-2xl hover:bg-cyan-neon hover:text-black transition-none focus:outline-none"
           >
             [ &lt;&lt; ]
           </button>
           <button 
             onClick={togglePlay} 
             className={`font-bold text-3xl py-6 transition-none border-2 border-magenta-neon focus:outline-none ${
               isPlaying 
                 ? 'bg-magenta-neon text-black hover:bg-black hover:text-magenta-neon' 
                 : 'bg-black text-magenta-neon hover:bg-magenta-neon hover:text-black'
             }`}
           >
             {isPlaying ? '[ HALT ]' : '[ EXEC ]'}
           </button>
           <button 
             onClick={skipForward} 
             className="bg-black border-2 border-cyan-neon text-cyan-neon py-6 text-2xl hover:bg-cyan-neon hover:text-black transition-none focus:outline-none"
           >
             [ &gt;&gt; ]
           </button>
        </div>
      </div>

    </div>
  );
}
