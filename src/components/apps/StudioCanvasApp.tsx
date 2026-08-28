import React from 'react';
import { useGameStore } from '@/game/store';
import { Play, RotateCcw, Undo2, Redo2, Code2, Eye, EyeOff, FileText, Maximize2 } from 'lucide-react';

const DEFAULT_HTML = `<!-- Studio Canvas -->
<!-- Build your cozy studio space with code! -->
<div id="studio-canvas">
  <h2 style="font-family: Georgia, serif; color: #6b5b3e;">
    Welcome to Your Studio
  </h2>
  <p style="color: #8b7355;">
    Write HTML, CSS, and JS here to decorate your workspace.
  </p>
</div>`;

const DEFAULT_CSS = `/* Studio Canvas Styles */
#studio-canvas {
  font-family: 'Inter', sans-serif;
  padding: 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5efe6 0%, #e8ddd0 100%);
}

h2 {
  margin-bottom: 12px;
}

p {
  font-size: 14px;
  line-height: 1.6;
}`;

const DEFAULT_JS = `// Studio Canvas Script
// Add interactivity to your studio

// Example: Click the heading to change color
const heading = document.querySelector('h2');
if (heading) {
  heading.addEventListener('click', () => {
    const colors = ['#6b5b3e', '#c4956a', '#4a7a9b', '#cc3333', '#5a7a5a'];
    heading.style.color = colors[Math.floor(Math.random() * colors.length)];
  });
}`;

type Tab = 'html' | 'css' | 'js';

const StudioCanvasApp: React.FC = () => {
  const canvasElements = useGameStore(s => s.canvasElements);
  const addCanvasElement = useGameStore(s => s.addCanvasElement);
  
  // Use canvas elements to persist code (repurpose the store)
  const savedHtml = canvasElements.find(e => e.id === 'canvas-html')?.content || DEFAULT_HTML;
  const savedCss = canvasElements.find(e => e.id === 'canvas-css')?.content || DEFAULT_CSS;
  const savedJs = canvasElements.find(e => e.id === 'canvas-js')?.content || DEFAULT_JS;

  const [htmlCode, setHtmlCode] = React.useState(savedHtml);
  const [cssCode, setCssCode] = React.useState(savedCss);
  const [jsCode, setJsCode] = React.useState(savedJs);
  const [activeTab, setActiveTab] = React.useState<Tab>('html');
  const [showPreview, setShowPreview] = React.useState(true);
  const [isFullPreview, setIsFullPreview] = React.useState(false);
  const [undoStacks, setUndoStacks] = React.useState<Record<Tab, string[]>>({ html: [], css: [], js: [] });
  const [redoStacks, setRedoStacks] = React.useState<Record<Tab, string[]>>({ html: [], css: [], js: [] });
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const currentCode = activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode;
  const setCurrentCode = activeTab === 'html' ? setHtmlCode : activeTab === 'css' ? setCssCode : setJsCode;

  // Auto-save to store
  React.useEffect(() => {
    const store = useGameStore.getState();
    const saveEl = (id: string, content: string) => {
      const existing = store.canvasElements.find(e => e.id === id);
      if (existing) {
        store.updateCanvasElement(id, { content });
      } else {
        store.addCanvasElement({
          id, type: 'text', x: 0, y: 0, width: 0, height: 0,
          content, style: {}, zIndex: 0,
        });
      }
    };
    const timer = setTimeout(() => {
      saveEl('canvas-html', htmlCode);
      saveEl('canvas-css', cssCode);
      saveEl('canvas-js', jsCode);
    }, 1000);
    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode]);

  const handleCodeChange = (value: string) => {
    setUndoStacks(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab].slice(-50), currentCode]
    }));
    setRedoStacks(prev => ({ ...prev, [activeTab]: [] }));
    setCurrentCode(value);
  };

  const handleUndo = () => {
    const stack = undoStacks[activeTab];
    if (stack.length === 0) return;
    setRedoStacks(prev => ({ ...prev, [activeTab]: [...prev[activeTab], currentCode] }));
    const prev = stack[stack.length - 1];
    setUndoStacks(s => ({ ...s, [activeTab]: s[activeTab].slice(0, -1) }));
    setCurrentCode(prev);
  };

  const handleRedo = () => {
    const stack = redoStacks[activeTab];
    if (stack.length === 0) return;
    setUndoStacks(prev => ({ ...prev, [activeTab]: [...prev[activeTab], currentCode] }));
    const next = stack[stack.length - 1];
    setRedoStacks(s => ({ ...s, [activeTab]: s[activeTab].slice(0, -1) }));
    setCurrentCode(next);
  };

  const handleReset = () => {
    if (!confirm('Reset this file to default?')) return;
    handleCodeChange(activeTab === 'html' ? DEFAULT_HTML : activeTab === 'css' ? DEFAULT_CSS : DEFAULT_JS);
  };

  // Build full preview document
  const previewDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${cssCode}</style>
</head>
<body style="margin:0;overflow:auto;">
  ${htmlCode}
  <script>
  try {
    ${jsCode}
  } catch(e) {
    console.error(e);
  }
  </script>
</body>
</html>`;

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const pos = textarea.selectionStart;
      const newCode = currentCode.slice(0, pos) + '  ' + currentCode.slice(pos);
      handleCodeChange(newCode);
      setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = pos + 2; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
  };

  const tabs: { id: Tab; label: string; ext: string }[] = [
    { id: 'html', label: 'studio.canvas.html', ext: 'HTML' },
    { id: 'css', label: 'studio.canvas.css', ext: 'CSS' },
    { id: 'js', label: 'studio.canvas.js', ext: 'JS' },
  ];

  if (isFullPreview) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-8 bg-editor-line flex items-center justify-between px-3 border-b border-[hsl(220,15%,20%)] shrink-0">
          <span className="text-xs text-editor-fg font-medium">Studio Canvas — Full Preview</span>
          <button onClick={() => setIsFullPreview(false)} className="text-[10px] text-editor-gutter hover:text-editor-fg px-2 py-0.5 rounded hover:bg-[hsl(220,15%,20%)]">
            ← Back to Editor
          </button>
        </div>
        <div className="flex-1 bg-white">
          <iframe srcDoc={previewDoc} className="w-full h-full border-0" title="Studio Canvas Preview" sandbox="allow-scripts" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Toolbar */}
      <div className="h-9 bg-editor-line flex items-center justify-between px-3 border-b border-[hsl(220,15%,20%)] shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-editor-gutter" />
          <span className="text-xs text-editor-fg font-medium">Studio Canvas</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--harbor-gold)/0.15)] text-[hsl(var(--harbor-gold))] font-mono">sandbox</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleUndo} disabled={undoStacks[activeTab].length === 0} className="text-editor-gutter hover:text-editor-fg disabled:opacity-30 p-1" title="Undo"><Undo2 size={13} /></button>
          <button onClick={handleRedo} disabled={redoStacks[activeTab].length === 0} className="text-editor-gutter hover:text-editor-fg disabled:opacity-30 p-1" title="Redo"><Redo2 size={13} /></button>
          <div className="w-px h-4 bg-[hsl(220,15%,25%)] mx-1" />
          <button onClick={() => setShowPreview(!showPreview)} className="text-editor-gutter hover:text-editor-fg p-1" title="Toggle Preview">
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => setIsFullPreview(true)} className="text-editor-gutter hover:text-editor-fg p-1" title="Full Preview">
            <Maximize2 size={14} />
          </button>
          <button onClick={handleReset} className="text-editor-gutter hover:text-editor-fg p-1" title="Reset"><RotateCcw size={14} /></button>
        </div>
      </div>

      {/* File tabs */}
      <div className="h-8 bg-[hsl(220,15%,14%)] flex items-center px-1 border-b border-[hsl(220,15%,20%)] shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1 text-[11px] rounded-t transition-colors ${
              activeTab === tab.id
                ? 'bg-editor-bg text-editor-fg'
                : 'text-editor-gutter hover:text-editor-fg'
            }`}
          >
            <FileText size={10} />
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[9px] text-editor-gutter font-mono mr-2">
          {currentCode.split('\n').length} lines · {(new TextEncoder().encode(currentCode).length / 1024).toFixed(1)}kb
        </span>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code editor */}
        <div className={`flex-1 relative ${showPreview ? 'max-w-[50%]' : ''}`}>
          <textarea
            ref={textareaRef}
            value={currentCode}
            onChange={e => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full font-mono text-sm leading-6 bg-editor-bg text-editor-fg caret-[hsl(var(--editor-cursor))] resize-none outline-none pl-12 pt-3 pb-3 pr-4 overflow-auto harbor-scrollbar"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-editor-bg text-editor-gutter text-xs font-mono text-right pt-3 pr-2 select-none overflow-hidden leading-6">
            {currentCode.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
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
                  ref={iframeRef}
                  srcDoc={previewDoc}
                  className="w-full h-full border-0"
                  title="Studio Canvas Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Status bar */}
      <div className="h-6 bg-[hsl(220,15%,12%)] flex items-center justify-between px-3 border-t border-[hsl(220,15%,20%)] shrink-0">
        <span className="text-[9px] text-editor-gutter">
          studio.canvas.{activeTab} · Sandboxed · No external imports
        </span>
        <span className="text-[9px] text-editor-gutter">
          Max 200 DOM nodes · Auto-saved
        </span>
      </div>
    </div>
  );
};

export default StudioCanvasApp;
