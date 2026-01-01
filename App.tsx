
import React, { useState, useEffect, useRef } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import { AnimationPhase } from './types';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AnimationPhase>(AnimationPhase.IDLE);
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startSequence = () => {
    setIsStarted(true);
    setPhase(AnimationPhase.COUNTDOWN_3);
    
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  useEffect(() => {
    if (!isStarted) return;

    let timer: number;
    const sequence = [
      { phase: AnimationPhase.COUNTDOWN_3, duration: 1000 },
      { phase: AnimationPhase.COUNTDOWN_2, duration: 1000 },
      { phase: AnimationPhase.COUNTDOWN_1, duration: 1000 },
      { phase: AnimationPhase.HAPPY_NEW_YEAR, duration: 3400 },
      { phase: AnimationPhase.NAME, duration: 3400 },
      { phase: AnimationPhase.ATTRIBUTES, duration: 3400 },
      { phase: AnimationPhase.WISH_1, duration: 3400 },
      { phase: AnimationPhase.WISH_2, duration: 3400 },
      { phase: AnimationPhase.HEART, duration: 3000 },
      { phase: AnimationPhase.FINAL_MESSAGE, duration: 5000 },
    ];

    let currentStep = 0;
    
    const runNext = () => {
      if (currentStep < sequence.length) {
        setPhase(sequence[currentStep].phase);
        timer = window.setTimeout(() => {
          currentStep++;
          runNext();
        }, sequence[currentStep].duration);
      }
    };

    runNext();

    return () => clearTimeout(timer);
  }, [isStarted]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center font-sans">
      <audio 
        ref={audioRef} 
        src="https://res.cloudinary.com/dyovozajb/video/upload/v1767240881/media_4_o5vlro.mp3" 
        loop
      />
      
      <ParticleCanvas phase={phase} />

      {!isStarted && (
        <div className="z-10 text-center animate-in fade-in zoom-in duration-1000 px-4">
          <h1 className="text-white text-4xl md:text-7xl font-black mb-4 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,45,117,0.8)] leading-tight">
            HAPPY<br/><span className="text-pink-500">NEW YEAR</span>
          </h1>
          <div className="text-pink-400 text-3xl md:text-5xl font-black mb-12 tracking-[0.4em] drop-shadow-[0_0_10px_rgba(255,45,117,0.5)]">
            2026
          </div>
          <button
            onClick={startSequence}
            className="group relative px-8 py-4 md:px-12 md:py-5 bg-transparent overflow-hidden border-2 border-pink-500 text-pink-500 rounded-full text-lg md:text-2xl font-black hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
          >
            <span className="relative z-10 uppercase tracking-widest">Gửi lời chúc đến bạn thân</span>
            <div className="absolute inset-0 bg-pink-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      )}

      {isStarted && phase !== AnimationPhase.FINAL_MESSAGE && (
        <div className="absolute bottom-24 left-0 w-full text-center text-pink-500/80 text-[12px] md:text-lg font-bold tracking-[0.8em] pointer-events-none uppercase drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
          Happy New Year 2026
        </div>
      )}

      {/* Watermark Section */}
      <div className="absolute bottom-6 right-6 text-right flex flex-col space-y-1.5 z-20">
        <div className="text-white/90 text-[12px] md:text-base font-bold font-mono tracking-widest uppercase drop-shadow-lg">
          code by Nhutcoder
        </div>
        <a 
          href="https://www.facebook.com/share/17fLrvXAkk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white/70 hover:text-pink-400 transition-colors text-[10px] md:text-sm font-mono flex items-center justify-end gap-1"
        >
          <span>FB:</span> Nhutcoder
        </a>
        <div className="text-white/70 text-[10px] md:text-sm font-mono flex items-center justify-end gap-1">
          <span>TikTok:</span> nhutcoder0902
        </div>
      </div>
    </div>
  );
};

export default App;
