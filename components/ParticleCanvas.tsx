
import React, { useRef, useEffect, useState } from 'react';
import { AnimationPhase, Particle } from '../types';
import { COLORS, TEXT_CONTENT } from '../constants';

interface Props {
  phase: AnimationPhase;
}

interface BinaryDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
}

const ParticleCanvas: React.FC<Props> = ({ phase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Matrix-style falling binary numbers
  const drops = useRef<BinaryDrop[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    
    // Initialize binary drops
    const fontSize = 16;
    const columns = Math.ceil(window.innerWidth / fontSize);
    drops.current = Array.from({ length: columns }, (_, i) => ({
      x: i * fontSize,
      y: Math.random() * -window.innerHeight,
      speed: 1 + Math.random() * 4,
      length: 15 + Math.floor(Math.random() * 15),
      chars: Array.from({ length: 30 }, () => Math.random() > 0.5 ? '1' : '0')
    }));

    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions.width]);

  const createParticlesFromText = (text: string, fontSize: number = 100) => {
    const canvas = canvasRef.current;
    if (!canvas) return [];
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = `900 ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = text.split('\n');
    const lineHeight = fontSize * 1.1;
    const totalHeight = lineHeight * lines.length;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    lines.forEach((line, i) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + i * lineHeight);
    });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const targets: { x: number, y: number }[] = [];
    const step = 4;

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        const alpha = imageData[index + 3];
        if (alpha > 128) {
          targets.push({ x, y });
        }
      }
    }

    return targets;
  };

  const createParticlesFromHeart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return [];
    const targets: { x: number, y: number }[] = [];
    const scale = Math.min(canvas.width, canvas.height) / 45;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;

    for (let t = 0; t < Math.PI * 2; t += 0.015) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      for(let r = 0; r <= 1; r += 0.15) {
          targets.push({
            x: centerX + x * scale * r,
            y: centerY + y * scale * r
          });
      }
    }
    return targets;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    if (particles.current.length === 0) {
      const count = 4000;
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          originX: Math.random() * canvas.width,
          originY: Math.random() * canvas.height,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          color: COLORS.PRIMARY,
          size: Math.random() * 2 + 0.5,
          vx: 0,
          vy: 0,
          friction: 0.95,
          ease: 0.05 + Math.random() * 0.05
        });
      }
    }

    let targets: { x: number, y: number }[] = [];

    switch (phase) {
      case AnimationPhase.COUNTDOWN_3:
      case AnimationPhase.COUNTDOWN_2:
      case AnimationPhase.COUNTDOWN_1:
        targets = createParticlesFromText(phase, Math.min(canvas.width, canvas.height) / 2);
        break;
      case AnimationPhase.HAPPY_NEW_YEAR:
        targets = createParticlesFromText(TEXT_CONTENT.HAPPY_NEW_YEAR, Math.min(canvas.width * 0.15, 80));
        break;
      case AnimationPhase.NAME:
        targets = createParticlesFromText(TEXT_CONTENT.NAME, Math.min(canvas.width * 0.12, 100));
        break;
      case AnimationPhase.ATTRIBUTES:
        targets = createParticlesFromText(TEXT_CONTENT.ATTRIBUTES, Math.min(canvas.width * 0.08, 60));
        break;
      case AnimationPhase.WISH_1:
        targets = createParticlesFromText(TEXT_CONTENT.WISH_1, Math.min(canvas.width * 0.08, 60));
        break;
      case AnimationPhase.WISH_2:
        targets = createParticlesFromText(TEXT_CONTENT.WISH_2, Math.min(canvas.width * 0.08, 60));
        break;
      case AnimationPhase.HEART:
        targets = createParticlesFromHeart();
        break;
      case AnimationPhase.FINAL_MESSAGE:
        targets = createParticlesFromText(TEXT_CONTENT.FINAL_MESSAGE, Math.min(canvas.width * 0.1, 70));
        break;
      default:
        targets = [];
    }

    if (targets.length > 0) {
      particles.current.forEach((p, i) => {
        const target = targets[i % targets.length];
        p.targetX = target.x;
        p.targetY = target.y;
        p.color = Math.random() > 0.8 ? COLORS.SECONDARY : COLORS.PRIMARY;
      });
    }

    const animate = () => {
      // Background with trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Binary Rain
      ctx.font = 'bold 12px monospace';
      drops.current.forEach(drop => {
        for (let i = 0; i < drop.length; i++) {
          const char = drop.chars[i];
          const opacity = (i / drop.length) * 0.25;
          ctx.fillStyle = `rgba(255, 45, 117, ${opacity})`;
          // Draw character at drop.x, and offset it by the character's position in the "tail"
          ctx.fillText(char, drop.x, drop.y - (i * 15));
        }

        drop.y += drop.speed;
        // Reset when the entire tail is off screen
        if (drop.y - (drop.length * 15) > canvas.height) {
          drop.y = -20;
          drop.speed = 1.5 + Math.random() * 4;
        }

        // Mutation effect
        if (Math.random() > 0.98) {
          drop.chars[Math.floor(Math.random() * drop.chars.length)] = Math.random() > 0.5 ? '1' : '0';
        }
      });

      // Update and Draw Particles
      particles.current.forEach(p => {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        
        p.x += dx * p.ease;
        p.y += dy * p.ease;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [phase, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block w-full h-full cursor-default"
    />
  );
};

export default ParticleCanvas;
