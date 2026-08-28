import React from 'react';
import { useGameStore } from '@/game/store';
import { getLevelById } from '@/game/levels';
import { clients } from '@/game/clients';
import { getTierLabel } from '@/game/evaluation';
import { Play, RotateCcw, Eye, EyeOff, CheckCircle2, XCircle, Circle, HelpCircle, Undo2, Redo2 } from 'lucide-react';

function highlightHTML(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let key = 0;
    const regex = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][a-zA-Z0-9]*)|(\s[a-zA-Z-]+=)|("[^"]*")|('([^']*)')|([^<"']+)/g;
    let match;
    let lastIndex = 0;
    
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++} className="syntax-text">{line.slice(lastIndex, match.index)}</span>);
      }
      if (match[1]) parts.push(<span key={key++} className="syntax-comment">{match[0]}</span>);
      else if (match[2]) parts.push(<span key={key++} className="syntax-tag">{match[0]}</span>);
      else if (match[3]) parts.push(<span key={key++} className="syntax-attribute">{match[0]}</span>);
      else if (match[4] || match[5]) parts.push(<span key={key++} className="syntax-string">{match[0]}</span>);
      else parts.push(<span key={key++} className="syntax-text">{match[0]}</span>);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < line.length) {
      parts.push(<span key={key++} className="syntax-text">{line.slice(lastIndex)}</span>);
    }
    if (parts.length === 0) parts.push(<span key={0} className="syntax-text">{'\u200b'}</span>);
    return parts;
  });
}

// Generate hints based on failed requirements
function generateHint(html: string, level: ReturnType<typeof getLevelById>): string | null {
  if (!level) return null;
  const failed = level.requirements.filter(r => r.type === 'required' && !r.check(html));
  if (failed.length === 0) return 'All requirements met! Try submitting.';
  
  const first = failed[0];
  // Vague hints first
  const desc = first.description.toLowerCase();
  if (desc.includes('heading')) return 'Check your heading structure.';
  if (desc.includes('list')) return 'Look at your list structure.';
  if (desc.includes('image') || desc.includes('img')) return 'Images need correct attributes.';
  if (desc.includes('style')) return 'Consider how your styles are organized.';
  if (desc.includes('table')) return 'Tables need proper rows and cells.';
  if (desc.includes('link') || desc.includes('nav')) return 'Navigation needs proper links.';
  if (desc.includes('footer')) return 'Don\'t forget the footer.';
  if (desc.includes('section') || desc.includes('semantic')) return 'Think about semantic structure.';
  return `Something is missing: ${first.description}`;
}

const EditorApp: React.FC = () => {
  const currentEditingLevel = useGameStore(s => s.currentEditingLevel);
  const editorCode = useGameStore(s => s.editorCode);
  const updateCode = useGameStore(s => s.updateCode);
  const submitProject = useGameStore(s => s.submitProject);
  const activeProjects = useGameStore(s => s.activeProjects);
  const editorLevel = useGameStore(s => s.editorLevel);
  const [showPreview, setShowPreview] = React.useState(true);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);
  const [undoStack, setUndoStack] = React.useState<string[]>([]);
  const [redoStack, setRedoStack] = React.useState<string[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightRef = React.useRef<HTMLDivElement>(null);
  
  const level = currentEditingLevel ? getLevelById(currentEditingLevel) : null;
  const project = currentEditingLevel ? activeProjects.find(p => p.levelId === currentEditingLevel) : null;
  const client = level ? clients[level.clientId] : null;
  
  const handleCodeChange = (newCode: string) => {
    setUndoStack(prev => [...prev.slice(-50), editorCode]);
    setRedoStack([]);
    updateCode(newCode);
  };
  
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [...prev, editorCode]);
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    updateCode(prev);
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, editorCode]);
    const next = redoStack[redoStack.length - 1];
    setRedoStack(s => s.slice(0, -1));
    updateCode(next);
  };
  
  const handleSubmit = () => {
    submitProject();
    setShowFeedback(true);
  };
  
  const handleReset = () => {
    if (level) {
      setUndoStack(prev => [...prev, editorCode]);
      updateCode(level.templateCode);
      setShowFeedback(false);
    }
  };
  
  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
        if (e.key === 'z' && e.shiftKey) { e.preventDefault(); handleRedo(); }
        if (e.key === 'y') { e.preventDefault(); handleRedo(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editorCode, undoStack, redoStack]);
  
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };
  
  // Auto-close tags (editor level 2+)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (editorLevel >= 2) {
      // Auto-close tags
      if (e.key === '>') {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const pos = textarea.selectionStart;
        const before = editorCode.slice(0, pos);
        const tagMatch = before.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?$/);
        if (tagMatch) {
          const tagName = tagMatch[1];
          const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName.toLowerCase());
          if (!selfClosing) {
            e.preventDefault();
            const closingTag = `></${tagName}>`;
            const newCode = editorCode.slice(0, pos) + closingTag + editorCode.slice(pos);
            handleCodeChange(newCode);
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = pos + 1;
            }, 0);
          }
        }
      }
      
      // Auto-indent after Enter
      if (e.key === 'Enter') {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const pos = textarea.selectionStart;
        const before = editorCode.slice(0, pos);
        const currentLine = before.split('\n').pop() || '';
        const indent = currentLine.match(/^\s*/)?.[0] || '';
        const openTag = currentLine.match(/<[a-zA-Z][^/]*>$/);
        
        if (openTag) {
          e.preventDefault();
          const newIndent = indent + '  ';
          const insertion = '\n' + newIndent;
          const newCode = editorCode.slice(0, pos) + insertion + editorCode.slice(pos);
          handleCodeChange(newCode);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = pos + insertion.length;
          }, 0);
        }
      }
    }
    
    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const pos = textarea.selectionStart;
      const newCode = editorCode.slice(0, pos) + '  ' + editorCode.slice(pos);
      handleCodeChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = pos + 2;
      }, 0);
    }
  };
  
  if (!level || !project) {
    return (
      <div className="h-full flex items-center justify-center bg-editor-bg text-editor-fg/60">
        <div className="text-center space-y-2">
          <div className="text-4xl opacity-30">📝</div>
          <p className="text-sm">No project open</p>
          <p className="text-xs text-editor-gutter">Accept a project from your email to start coding</p>
        </div>
      </div>
    );
  }
  
  const highlightedLines = highlightHTML(editorCode);
  const hint = showHint ? generateHint(editorCode, level) : null;
  
  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Editor toolbar */}
      <div className="h-9 bg-editor-line flex items-center justify-between px-3 border-b border-[hsl(220,15%,20%)] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-editor-gutter">{client?.avatar}</span>
          <span className="text-xs text-editor-fg font-medium truncate max-w-[200px]">{level.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[hsl(var(--harbor-ocean)/0.2)] text-[hsl(var(--harbor-ocean))]">
            index.html
          </span>
          {editorLevel > 1 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[hsl(130,55%,50%,0.15)] text-[hsl(130,55%,50%)] font-mono">
              L{editorLevel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleUndo} disabled={undoStack.length === 0} className="text-editor-gutter hover:text-editor-fg disabled:opacity-30 transition-colors p-1" title="Undo (Ctrl+Z)">
            <Undo2 size={13} />
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0} className="text-editor-gutter hover:text-editor-fg disabled:opacity-30 transition-colors p-1" title="Redo (Ctrl+Shift+Z)">
            <Redo2 size={13} />
          </button>
          <div className="w-px h-4 bg-[hsl(220,15%,25%)] mx-1" />
          <button onClick={() => setShowPreview(!showPreview)} className="text-editor-gutter hover:text-editor-fg transition-colors p-1" title="Toggle Preview">
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={handleReset} className="text-editor-gutter hover:text-editor-fg transition-colors p-1" title="Reset to template">
            <RotateCcw size={14} />
          </button>
          {project.attempts > 0 && (
            <button
              onClick={() => setShowHint(!showHint)}
              className={`transition-colors p-1 ${showHint ? 'text-harbor-gold' : 'text-editor-gutter hover:text-editor-fg'}`}
              title="Ask for a hint"
            >
              <HelpCircle size={14} />
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[hsl(var(--harbor-ocean))] text-primary-foreground text-xs font-medium hover:brightness-110 transition-all ml-1"
          >
            <Play size={12} />
            Submit
          </button>
        </div>
      </div>
      
      {/* Requirements bar */}
      <div className="h-8 bg-[hsl(220,15%,15%)] flex items-center gap-3 px-3 overflow-x-auto border-b border-[hsl(220,15%,20%)] shrink-0">
        <span className="text-[10px] text-editor-gutter uppercase tracking-wider shrink-0">Req:</span>
        {level.requirements.filter(r => r.type === 'required').map(req => {
          const passed = req.check(editorCode);
          return (
            <span key={req.id} className={`flex items-center gap-1 text-[10px] shrink-0 transition-colors ${passed ? 'text-[hsl(130,55%,50%)]' : 'text-editor-gutter'}`}>
              {passed ? <CheckCircle2 size={10} /> : <Circle size={10} />}
              <span className="truncate max-w-[120px]">{req.description.replace(/<[^>]+>/g, '')}</span>
            </span>
          );
        })}
        <div className="w-px h-4 bg-[hsl(220,15%,25%)] mx-1 shrink-0" />
        {level.requirements.filter(r => r.type === 'bonus').map(req => {
          const passed = req.check(editorCode);
          return (
            <span key={req.id} className={`flex items-center gap-1 text-[10px] shrink-0 ${passed ? 'text-harbor-gold' : 'text-editor-gutter/50'}`}>
              {passed ? '★' : '☆'}
              <span className="truncate max-w-[100px]">{req.description.replace(/<[^>]+>/g, '')}</span>
            </span>
          );
        })}
      </div>
      
      {/* Hint bar */}
      {showHint && hint && (
        <div className="h-7 bg-[hsl(40,50%,15%)] flex items-center px-3 border-b border-[hsl(40,40%,20%)] shrink-0">
          <span className="text-[10px] text-harbor-gold mr-2">💡</span>
          <span className="text-[11px] text-[hsl(40,40%,70%)] italic">{hint}</span>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code editor */}
        <div className={`flex-1 relative ${showPreview ? 'max-w-[50%]' : ''}`}>
          <div
            ref={highlightRef}
            className="absolute inset-0 overflow-auto font-mono text-sm leading-6 p-0 pointer-events-none harbor-scrollbar"
            aria-hidden="true"
          >
            <div className="flex min-h-full">
              <div className="shrink-0 w-12 text-right pr-3 pt-3 pb-3 select-none">
                {highlightedLines.map((_, i) => (
                  <div key={i} className="text-editor-gutter text-xs leading-6">{i + 1}</div>
                ))}
              </div>
              <div className="flex-1 pt-3 pb-3 pr-4">
                {highlightedLines.map((parts, i) => (
                  <div key={i} className="leading-6 whitespace-pre">{parts}</div>
                ))}
              </div>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            value={editorCode}
            onChange={e => handleCodeChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full font-mono text-sm leading-6 bg-transparent text-transparent caret-[hsl(var(--editor-cursor))] resize-none outline-none pl-12 pt-3 pb-3 pr-4 overflow-auto"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        
        {/* Preview pane */}
        {showPreview && (
          <>
            <div className="w-px bg-[hsl(220,15%,20%)]" />
            <div className="flex-1 flex flex-col">
              <div className="h-7 bg-[hsl(220,15%,15%)] flex items-center px-3 border-b border-[hsl(220,15%,20%)] shrink-0">
                <span className="text-[10px] text-editor-gutter uppercase tracking-wider">Live Preview</span>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  srcDoc={editorCode}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Feedback panel */}
      {showFeedback && project.score && (
        <FeedbackPanel project={project} client={client} onClose={() => setShowFeedback(false)} />
      )}
    </div>
  );
};

const FeedbackPanel: React.FC<{
  project: { score?: { precision: number; creativity: number; professionalism: number; tier: string }; feedbackMessage?: string };
  client: { name: string; avatar: string } | null;
  onClose: () => void;
}> = ({ project, client, onClose }) => {
  if (!project.score) return null;
  
  return (
    <div className="border-t border-[hsl(220,15%,20%)] bg-[hsl(220,15%,12%)] p-4 shrink-0 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{client?.avatar}</span>
          <div>
            <p className="text-xs text-editor-fg font-medium">{client?.name}</p>
            <p className="text-[10px] text-editor-gutter">{getTierLabel(project.score.tier as any)}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-editor-gutter hover:text-editor-fg text-xs">Close</button>
      </div>
      
      <p className="text-sm text-editor-fg italic mb-4">"{project.feedbackMessage}"</p>
      
      <div className="grid grid-cols-3 gap-4">
        <ScoreBar label="Precision" value={project.score.precision} color="hsl(210, 80%, 65%)" />
        <ScoreBar label="Creativity" value={project.score.creativity} color="hsl(35, 75%, 60%)" />
        <ScoreBar label="Professionalism" value={project.score.professionalism} color="hsl(165, 50%, 55%)" />
      </div>
      
      {/* Hidden override code in source */}
      {project.score.tier !== 'needs_revision' && (
        <p className="mt-3 text-[9px] text-editor-gutter/30 font-mono">
          {/* <!-- sys.override("assist") --> */}
          Build #{Math.floor(Math.random() * 999)}
        </p>
      )}
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-editor-gutter">{label}</span>
      <span className="text-xs text-editor-fg font-mono">{value}</span>
    </div>
    <div className="h-2 bg-[hsl(220,15%,20%)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export default EditorApp;
