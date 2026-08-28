import React from 'react';
import { RotateCcw, Trophy, Zap } from 'lucide-react';
import { audioEngine } from '@/game/audio';

// === Typing Speed Game ===
const TypingGame: React.FC = () => {
  const wordSets = {
    html: ['div', 'span', 'class', 'style', 'header', 'footer', 'section', 'article', 'nav', 'button', 'input', 'form', 'table', 'body', 'html', 'head', 'title', 'link', 'meta', 'script'],
    css: ['color', 'margin', 'padding', 'border', 'display', 'flex', 'grid', 'width', 'height', 'font', 'align', 'center', 'background', 'position', 'transform', 'opacity', 'transition', 'overflow', 'cursor', 'outline'],
    mixed: ['function', 'const', 'return', 'import', 'export', 'async', 'await', 'class', 'extends', 'render', 'state', 'props', 'effect', 'event', 'query', 'fetch', 'error', 'catch', 'throw', 'promise'],
  };
  const [wordSet, setWordSet] = React.useState<'html' | 'css' | 'mixed'>('html');
  const [targetWords, setTargetWords] = React.useState<string[]>([]);
  const [input, setInput] = React.useState('');
  const [wordIdx, setWordIdx] = React.useState(0);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [wpm, setWpm] = React.useState<number | null>(null);
  const [errors, setErrors] = React.useState(0);
  const [bestWpm, setBestWpm] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    const words = wordSets[wordSet];
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 20);
    setTargetWords(shuffled);
    setInput(''); setWordIdx(0); setStartTime(null); setWpm(null); setErrors(0);
    inputRef.current?.focus();
  };

  React.useEffect(() => { reset(); }, [wordSet]);

  const handleInput = (val: string) => {
    if (!startTime) setStartTime(Date.now());
    if (val.endsWith(' ')) {
      const typed = val.trim();
      if (typed === targetWords[wordIdx]) {
        audioEngine.playClick();
        const next = wordIdx + 1;
        if (next >= targetWords.length) {
          const elapsed = (Date.now() - startTime!) / 1000 / 60;
          const result = Math.round(targetWords.length / elapsed);
          setWpm(result);
          if (result > bestWpm) setBestWpm(result);
          audioEngine.playSuccess();
        }
        setWordIdx(next);
      } else {
        setErrors(e => e + 1);
        audioEngine.playError();
        setWordIdx(wordIdx + 1);
      }
      setInput('');
    } else {
      setInput(val);
    }
  };

  if (wpm !== null) {
    const accuracy = Math.round(((targetWords.length - errors) / targetWords.length) * 100);
    return (
      <div className="text-center space-y-4 py-6">
        <Trophy className="mx-auto text-primary" size={28} />
        <div className="text-3xl font-bold text-primary">{wpm} WPM</div>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <span>{accuracy}% accuracy</span>
          <span>{errors} errors</span>
          <span>Best: {bestWpm} WPM</span>
        </div>
        <div className="flex justify-center gap-2">
          <button onClick={reset} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2 hover:brightness-110">
            <RotateCcw size={13} /> Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-3">
      <div className="flex gap-1.5 mb-2">
        {(['html', 'css', 'mixed'] as const).map(s => (
          <button key={s} onClick={() => setWordSet(s)}
            className={`text-[10px] px-2 py-1 rounded-full capitalize ${wordSet === s ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>{s}</button>
        ))}
        {bestWpm > 0 && <span className="text-[10px] text-muted-foreground ml-auto">Best: {bestWpm} WPM</span>}
      </div>
      <div className="flex flex-wrap gap-1.5 leading-relaxed min-h-[60px]">
        {targetWords.map((word, i) => (
          <span key={i} className={`text-sm font-mono px-1.5 py-0.5 rounded transition-colors ${
            i < wordIdx ? 'text-primary/40 line-through' : i === wordIdx ? 'text-foreground bg-primary/10 font-bold' : 'text-muted-foreground'
          }`}>{word}</span>
        ))}
      </div>
      <input ref={inputRef} value={input} onChange={e => handleInput(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground font-mono text-sm outline-none focus:border-primary/50 transition-colors"
        placeholder="Type the highlighted word and press space..." autoFocus />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{wordIdx}/{targetWords.length} words</span>
        <span>{errors} errors</span>
      </div>
    </div>
  );
};

// === Tag Puzzle Game ===
const TagPuzzle: React.FC = () => {
  const puzzles = [
    { desc: 'Build a valid HTML document skeleton', answer: ['<!DOCTYPE html>', '<html>', '<head>', '<title>', '</title>', '</head>', '<body>', '</body>', '</html>'] },
    { desc: 'Create an unordered list with two items', answer: ['<ul>', '<li>', 'Item 1', '</li>', '<li>', 'Item 2', '</li>', '</ul>'] },
    { desc: 'Make a clickable link', answer: ['<a', 'href="url"', '>', 'Click here', '</a>'] },
    { desc: 'Build a form with a submit button', answer: ['<form>', '<input', 'type="text"', '/>', '<button>', 'Submit', '</button>', '</form>'] },
    { desc: 'Create a table row with two cells', answer: ['<tr>', '<td>', 'Cell 1', '</td>', '<td>', 'Cell 2', '</td>', '</tr>'] },
  ];

  const [puzzleIdx, setPuzzleIdx] = React.useState(0);
  const [placed, setPlaced] = React.useState<string[]>([]);
  const [available, setAvailable] = React.useState<string[]>([]);
  const [solved, setSolved] = React.useState<boolean[]>(new Array(puzzles.length).fill(false));
  const puzzle = puzzles[puzzleIdx];

  const reset = () => {
    setPlaced([]);
    setAvailable([...puzzle.answer].sort(() => Math.random() - 0.5));
  };

  React.useEffect(() => { reset(); }, [puzzleIdx]);

  const handlePick = (item: string, idx: number) => {
    const newPlaced = [...placed, item];
    setPlaced(newPlaced);
    setAvailable(available.filter((_, i) => i !== idx));
    audioEngine.playClick();
    if (newPlaced.length === puzzle.answer.length) {
      if (JSON.stringify(newPlaced) === JSON.stringify(puzzle.answer)) {
        audioEngine.playSuccess();
        const newSolved = [...solved];
        newSolved[puzzleIdx] = true;
        setSolved(newSolved);
      }
    }
  };

  const isComplete = placed.length === puzzle.answer.length;
  const isCorrect = isComplete && JSON.stringify(placed) === JSON.stringify(puzzle.answer);

  return (
    <div className="space-y-4 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{puzzle.desc}</p>
        <span className="text-[10px] text-muted-foreground">{solved.filter(Boolean).length}/{puzzles.length} solved</span>
      </div>

      <div className="min-h-[48px] p-3 rounded-lg bg-muted/30 border border-border flex flex-wrap gap-1">
        {placed.map((item, i) => (
          <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-primary/15 text-primary">{item}</span>
        ))}
        {placed.length > 0 && !isComplete && (
          <button onClick={() => { setAvailable([...available, placed[placed.length - 1]]); setPlaced(placed.slice(0, -1)); }}
            className="text-xs text-muted-foreground hover:text-foreground ml-1">← undo</button>
        )}
      </div>

      {!isComplete && (
        <div className="flex flex-wrap gap-1.5">
          {available.map((item, i) => (
            <button key={i} onClick={() => handlePick(item, i)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-muted hover:bg-primary/10 text-foreground hover:text-primary transition-colors border border-border">
              {item}
            </button>
          ))}
        </div>
      )}

      {isComplete && (
        <div className={`p-3 rounded-lg text-sm ${isCorrect ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
          {isCorrect ? '✓ Correct! Well structured.' : '✗ Not quite. The order matters — think about nesting.'}
          <button onClick={reset} className="ml-3 text-xs underline opacity-70 hover:opacity-100">
            {isCorrect ? 'Next →' : 'Try again'}
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5">
        {puzzles.map((_, i) => (
          <button key={i} onClick={() => setPuzzleIdx(i)}
            className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${
              i === puzzleIdx ? 'bg-primary text-primary-foreground' : solved[i] ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}>{solved[i] ? '✓' : i + 1}</button>
        ))}
      </div>
    </div>
  );
};

// === CSS Color Match Game ===
const ColorMatch: React.FC = () => {
  const colors = [
    { name: 'Tomato Red', hex: '#ff6347' },
    { name: 'Ocean Blue', hex: '#4a90d9' },
    { name: 'Forest Green', hex: '#228b22' },
    { name: 'Sunset Orange', hex: '#ff8c42' },
    { name: 'Lavender', hex: '#967bb6' },
    { name: 'Teal', hex: '#008080' },
  ];
  const [targetIdx, setTargetIdx] = React.useState(0);
  const [userColor, setUserColor] = React.useState('#000000');
  const [score, setScore] = React.useState(0);
  const [round, setRound] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const target = colors[targetIdx];

  const newRound = () => {
    setTargetIdx(Math.floor(Math.random() * colors.length));
    setUserColor('#000000');
    setShowResult(false);
    setRound(r => r + 1);
  };

  React.useEffect(() => { newRound(); }, []);

  const checkMatch = () => {
    // Simple hex distance
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    const [r1, g1, b1] = hexToRgb(target.hex);
    const [r2, g2, b2] = hexToRgb(userColor);
    const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    const accuracy = Math.max(0, Math.round((1 - dist / 441) * 100));
    if (accuracy > 70) { setScore(s => s + accuracy); audioEngine.playSuccess(); }
    else audioEngine.playError();
    setShowResult(true);
  };

  return (
    <div className="space-y-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Match the Color</span>
        <span className="text-[10px] text-muted-foreground">Score: {score} · Round {round}</span>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 text-center">
          <div className="w-full h-20 rounded-lg border border-border" style={{ backgroundColor: target.hex }} />
          <p className="text-[10px] text-muted-foreground mt-1">Target: {target.name}</p>
        </div>
        <div className="flex-1 text-center">
          <div className="w-full h-20 rounded-lg border border-border" style={{ backgroundColor: userColor }} />
          <p className="text-[10px] text-muted-foreground mt-1">Your pick</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="color" value={userColor} onChange={e => setUserColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        <input value={userColor} onChange={e => setUserColor(e.target.value)}
          className="flex-1 text-xs font-mono bg-muted rounded px-2 py-1.5 border border-border text-foreground outline-none" placeholder="#000000" />
        {!showResult ? (
          <button onClick={checkMatch} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs hover:brightness-110">Check</button>
        ) : (
          <button onClick={newRound} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs hover:brightness-110">Next</button>
        )}
      </div>
    </div>
  );
};

// === Main App ===
const MiniGameApp: React.FC = () => {
  const [game, setGame] = React.useState<'typing' | 'puzzle' | 'color'>('typing');

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-4 py-2 flex items-center gap-3">
        <Zap size={14} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">Mini-Games</span>
        <div className="flex gap-1 ml-auto">
          {[
            { id: 'typing' as const, label: '⌨️ Typing', },
            { id: 'puzzle' as const, label: '🧩 Tags', },
            { id: 'color' as const, label: '🎨 Colors', },
          ].map(g => (
            <button key={g.id} onClick={() => setGame(g.id)}
              className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${game === g.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto harbor-scrollbar px-5">
        {game === 'typing' ? <TypingGame /> : game === 'puzzle' ? <TagPuzzle /> : <ColorMatch />}
      </div>
    </div>
  );
};

export default MiniGameApp;
