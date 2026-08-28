import React from 'react';
import { useGameStore } from '@/game/store';

const Prologue: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  
  const steps = [
    { text: "You unlock the door to your tiny rented studio space.", delay: 2000 },
    { text: "One desk. One laptop. One window overlooking the harbor.", delay: 2500 },
    { text: "The morning light catches the water outside.", delay: 2000 },
    { text: "You open the laptop. The screen flickers on.", delay: 2000 },
    { text: "An empty inbox. A town that doesn't know your name yet.", delay: 2500 },
    { text: "And one email from a bakery owner who \"needs something simple.\"", delay: 2500 },
  ];
  
  React.useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), steps[step].delay);
      return () => clearTimeout(timer);
    }
  }, [step]);
  
  return (
    <div className="fixed inset-0 bg-[hsl(220,25%,8%)] flex items-center justify-center z-50">
      <div className="max-w-lg text-center px-8">
        <div className="space-y-6">
          {steps.slice(0, step + 1).map((s, i) => (
            <p
              key={i}
              className="text-[hsl(210,30%,80%)] font-light text-lg leading-relaxed animate-in fade-in duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {s.text}
            </p>
          ))}
        </div>
        
        {step >= steps.length - 1 && (
          <button
            onClick={onComplete}
            className="mt-12 px-8 py-3 rounded-lg bg-[hsl(var(--harbor-ocean))] text-primary-foreground font-medium text-sm tracking-wide hover:brightness-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            Open Laptop →
          </button>
        )}
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[hsl(220,15%,30%)] text-xs tracking-[0.3em] uppercase">
        Harbor Studio
      </div>
    </div>
  );
};

export default Prologue;
