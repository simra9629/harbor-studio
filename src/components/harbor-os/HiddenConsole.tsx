import React from 'react';
import { useGameStore } from '@/game/store';
import { processConsoleCommand } from '@/game/overrides';

const HiddenConsole: React.FC = () => {
  const consoleVisible = useGameStore(s => s.consoleVisible);
  const consoleHistory = useGameStore(s => s.consoleHistory);
  const toggleConsole = useGameStore(s => s.toggleConsole);
  const addConsoleEntry = useGameStore(s => s.addConsoleEntry);
  const applyOverride = useGameStore(s => s.applyOverride);
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggleConsole();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleConsole]);
  
  React.useEffect(() => {
    if (consoleVisible) {
      inputRef.current?.focus();
    }
  }, [consoleVisible]);
  
  React.useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [consoleHistory]);
  
  if (!consoleVisible) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    addConsoleEntry(`> ${input}`);
    const result = processConsoleCommand(input);
    
    if (result.message === '__CLEAR__') {
      useGameStore.getState().clearConsole();
    } else {
      addConsoleEntry(result.success
        ? `✓ ${result.message}`
        : `✗ ${result.message}`
      );
      
      if (result.effect) {
        applyOverride(result.effect);
      }
    }
    
    setInput('');
  };
  
  return (
    <div className="fixed top-7 left-0 right-0 z-[9999] animate-in slide-in-from-top duration-200">
      <div className="bg-[hsl(220,25%,8%,0.96)] backdrop-blur-xl border-b border-[hsl(220,15%,20%)] shadow-2xl">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-[hsl(220,15%,15%)]">
          <span className="text-[10px] font-mono text-[hsl(130,55%,50%)]">harbor-os://console</span>
          <button
            onClick={toggleConsole}
            className="text-[10px] text-[hsl(220,15%,40%)] hover:text-[hsl(220,15%,60%)] font-mono"
          >
            [Ctrl+`] close
          </button>
        </div>
        
        <div
          ref={scrollRef}
          className="max-h-40 overflow-y-auto px-4 py-2 font-mono text-xs leading-5 harbor-scrollbar"
        >
          {consoleHistory.length === 0 && (
            <p className="text-[hsl(220,15%,35%)]">Harbor OS Console v1.0 — Type "help" for commands</p>
          )}
          {consoleHistory.map((line, i) => (
            <p
              key={i}
              className={`whitespace-pre-wrap ${
                line.startsWith('✓') ? 'text-[hsl(130,55%,50%)]' :
                line.startsWith('✗') ? 'text-[hsl(0,72%,55%)]' :
                line.startsWith('>') ? 'text-[hsl(210,30%,70%)]' :
                'text-[hsl(220,15%,55%)]'
              }`}
            >
              {line}
            </p>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="px-4 py-2 border-t border-[hsl(220,15%,15%)] flex items-center gap-2">
          <span className="text-[hsl(130,55%,50%)] text-xs font-mono">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent text-xs font-mono text-[hsl(210,30%,80%)] outline-none placeholder:text-[hsl(220,15%,30%)]"
            placeholder="Type a command..."
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default HiddenConsole;
