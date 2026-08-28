import React from 'react';
import { useGameStore } from '@/game/store';

interface Particle {
  id: number;
  x: number;
  y: number;
  life: number;
  vx: number;
  vy: number;
}

const CursorEffects: React.FC = () => {
  const cursorEffect = useGameStore(s => s.cursorEffect);
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const nextId = React.useRef(0);

  React.useEffect(() => {
    if (cursorEffect === 'none') return;

    let frameId: number;
    const handleMove = (e: MouseEvent) => {
      const p: Particle = {
        id: nextId.current++,
        x: e.clientX,
        y: e.clientY,
        life: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
      };
      setParticles(prev => [...prev.slice(-30), p]);
    };

    const tick = () => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, life: p.life - 0.03, x: p.x + p.vx, y: p.y + p.vy }))
          .filter(p => p.life > 0)
      );
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove);
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(frameId);
    };
  }, [cursorEffect]);

  if (cursorEffect === 'none') return null;

  const getStyle = (p: Particle): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      left: p.x,
      top: p.y,
      pointerEvents: 'none',
      zIndex: 99999,
      transition: 'none',
    };

    switch (cursorEffect) {
      case 'neon':
        return {
          ...base,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: `hsla(180, 100%, 60%, ${p.life * 0.6})`,
          boxShadow: `0 0 ${p.life * 8}px hsla(180, 100%, 60%, ${p.life * 0.4})`,
        };
      case 'ghost':
        return {
          ...base,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: `hsla(220, 30%, 80%, ${p.life * 0.3})`,
          transform: `scale(${2 - p.life})`,
        };
      case 'stars':
        return {
          ...base,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: `hsla(45, 100%, 70%, ${p.life * 0.8})`,
          boxShadow: `0 0 ${p.life * 4}px hsla(45, 100%, 70%, ${p.life * 0.3})`,
        };
      default:
        return base;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {particles.map(p => (
        <div key={p.id} style={getStyle(p)} />
      ))}
    </div>
  );
};

export default CursorEffects;
