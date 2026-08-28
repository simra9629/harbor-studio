import React from 'react';
import { useGameStore } from '@/game/store';
import { VirtualFile } from '@/game/types';
import { Folder, FileText, ChevronRight, ArrowLeft, Eye, EyeOff, Search, FileCode, FileImage, Music, Terminal } from 'lucide-react';

const getFileIcon = (name: string) => {
  if (name.endsWith('.html')) return <FileCode size={15} className="text-[hsl(15,70%,55%)] shrink-0" />;
  if (name.endsWith('.css')) return <FileCode size={15} className="text-[hsl(210,70%,55%)] shrink-0" />;
  if (name.endsWith('.js')) return <FileCode size={15} className="text-[hsl(50,75%,50%)] shrink-0" />;
  if (name.endsWith('.mp3') || name.endsWith('.wav')) return <Music size={15} className="text-[hsl(280,50%,55%)] shrink-0" />;
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.svg')) return <FileImage size={15} className="text-[hsl(160,50%,50%)] shrink-0" />;
  if (name.endsWith('.log') || name.endsWith('.dat')) return <Terminal size={15} className="text-[hsl(130,40%,45%)] shrink-0" />;
  return <FileText size={15} className="text-muted-foreground shrink-0" />;
};

const FileExplorerApp: React.FC = () => {
  const fileSystem = useGameStore(s => s.fileSystem);
  const downloads = useGameStore(s => s.downloads);
  const studioCanvasDiscovered = useGameStore(s => s.studioCanvasDiscovered);
  const discoverCanvas = useGameStore(s => s.discoverStudioCanvas);
  const openApp = useGameStore(s => s.openApp);
  const [currentPath, setCurrentPath] = React.useState<string[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<VirtualFile | null>(null);
  const [showHidden, setShowHidden] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);

  // Build the full file tree with humor files
  const rootFiles: VirtualFile[] = [
    { name: 'Projects', type: 'folder', children: fileSystem },
    { name: 'Downloads', type: 'folder', children: [
      ...downloads,
      { name: 'harbor-os-wallpaper.png', type: 'file', content: '(binary: harbor wallpaper 1920x1080)' },
      { name: 'readme.txt', type: 'file', content: 'Welcome to Harbor Studio!\n\nThis is your workspace. Complete projects to unlock more tools and features.\n\nTips:\n- Check your mail for new projects\n- Use the editor to write code\n- Submit when ready for client feedback\n- Explore the town map to see your progress\n\nHidden tip: Try pressing Ctrl + ` sometime...' },
    ]},
    { name: 'Archive', type: 'folder', children: [
      { name: 'final_final_v2_REAL.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<head><title>FINAL VERSION (for real this time)</title></head>\n<body>\n  <h1>This is definitely the final version</h1>\n  <p>No more changes. I promise.</p>\n  <p>...okay maybe one more.</p>\n  <!-- sys.override("assist") -->\n</body>\n</html>' },
      { name: 'definitely_final.css', type: 'file', content: '/* This CSS file is FINAL.\n   Do not change.\n   I mean it.\n   ...okay fine, one more fix */\n\nbody {\n  font-family: "Comic Sans MS"; /* NO */\n  font-family: Georgia, serif; /* yes */\n  background: #faf3e8;\n}\n\n/* Hidden hint: try sys.override("lint") */' },
      { name: 'backup_backup_final.js', type: 'file', content: '// Backup of the backup of the final version\n// This is fine. Everything is fine.\n\nconsole.log("If you\'re reading this, you\'re a real developer.");\n\n// override hint: sys.override("devtools")' },
      { name: 'todo_never_done.txt', type: 'file', content: '☐ Fix that one bug\n☐ Add dark mode\n☐ Make it responsive\n☐ Learn flexbox (finally)\n☐ Stop procrastinating\n☐ Actually finish a project\n☑ Make a todo list' },
      { name: 'notes_from_mira.txt', type: 'file', content: 'Hey! Mira here. I found something cool on the Seabrook forums.\n\nApparently if you open the console (Ctrl + `) and type:\n  sys.override("chaos")\n\nSomething... interesting happens. Don\'t tell anyone! 🤫\n\nAlso try: sys.override("arcade")' },
    ]},
    {
      name: '.sys',
      type: 'folder',
      hidden: true,
      children: [
        { name: 'studio.theme.css', type: 'file', content: '/* Harbor Studio Theme */\n:root {\n  --studio-bg: #1e2330;\n  --studio-accent: #4a90d9;\n  --studio-warm: #c4956a;\n}\n\n/* Modify at your own risk */\n/* // Some parts of the studio reflect its owner. */' },
        { name: 'studio.canvas.html', type: 'file', content: '<!-- Studio Canvas -->\n<!-- Build your cozy studio space with code -->\n<div id="studio-canvas">\n  <!-- Your decorations here -->\n</div>' },
        { name: 'studio.canvas.css', type: 'file', content: '/* Studio Canvas Styles */\n#studio-canvas {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(180deg, #2a2520 0%, #1e1a17 100%);\n}\n\n/* Your custom styles here */' },
        { name: 'studio.canvas.js', type: 'file', content: '// Studio Canvas Script\n// Add interactivity to your studio\n\ndocument.addEventListener("click", (e) => {\n  // Add click effects\n  console.log("Canvas interaction at", e.clientX, e.clientY);\n});' },
        { name: 'system.log', type: 'file', content: `[Harbor OS v1.0.3]\n[Boot: OK]\n[Editor Module: Active]\n[Canvas Module: Standby]\n[Audio Engine: 3-Layer Ready]\n\n// Some parts of the studio reflect its owner.\n\n[EOF]` },
        { name: 'overrides.dat', type: 'file', content: '# Override Registry\n# Ctrl + ` to access console\n# sys.override("code") to apply\n\n# Editor:\n#   autoclose, indent, lint, emmet, autocomplete\n#\n# Debug:\n#   devtools, inspect, diff, score\n#\n# Dev (advanced):\n#   godmode, skip, unlockall, levelup\n#\n# Some codes are hidden in client websites...\n# Some are shared by NPCs on the forum...' },
        { name: 'harbor.conf', type: 'file', content: '# Harbor OS Configuration\nversion=1.0.3\naudio.layers=3\naudio.ambient=ocean\naudio.music=enabled\naudio.sfx=enabled\neditor.level=auto\ncanvas.maxnodes=200\ntheme=adaptive\n\n# Uncomment to enable debug:\n# debug.mode=true\n# debug.overlay=true' },
      ],
    },
  ];

  const navigateToFolder = (path: string[]) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const getCurrentFolder = (): VirtualFile[] => {
    let current = rootFiles;
    for (const segment of currentPath) {
      const folder = current.find(f => f.name === segment && f.type === 'folder');
      if (folder?.children) current = folder.children;
    }
    let result = current.filter(f => showHidden || !f.hidden);
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Sort: folders first, then files
    return result.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  const handleFileClick = (file: VirtualFile) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
      setSelectedFile(null);
      if (file.name === '.sys' && !studioCanvasDiscovered) {
        discoverCanvas();
      }
    } else {
      setSelectedFile(file);
    }
  };

  const handleOpenInEditor = () => {
    if (selectedFile?.name.includes('studio.canvas')) {
      openApp('canvas');
    }
  };

  const files = getCurrentFolder();
  const totalFiles = files.filter(f => f.type === 'file').length;
  const totalFolders = files.filter(f => f.type === 'folder').length;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border px-3 py-2 flex items-center gap-2">
        <button
          onClick={() => { if (currentPath.length > 0) { setCurrentPath(currentPath.slice(0, -1)); setSelectedFile(null); } }}
          disabled={currentPath.length === 0}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-1 min-w-0">
          <button onClick={() => navigateToFolder([])} className="hover:text-foreground transition-colors">~</button>
          {currentPath.map((segment, i) => (
            <React.Fragment key={i}>
              <span>/</span>
              <button onClick={() => navigateToFolder(currentPath.slice(0, i + 1))} className="hover:text-foreground transition-colors truncate">{segment}</button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setShowSearch(!showSearch)} className={`p-1 rounded transition-colors ${showSearch ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Search size={13} />
          </button>
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`p-1 rounded transition-colors ${showHidden ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            title={showHidden ? 'Hide hidden files' : 'Show hidden files'}
          >
            {showHidden ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-3 py-1.5 border-b border-border">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full text-xs bg-muted/50 rounded px-2 py-1.5 outline-none text-foreground placeholder:text-muted-foreground border border-border focus:border-primary/30"
            autoFocus
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File list */}
        <div className={`${selectedFile ? 'w-1/2 border-r border-border' : 'w-full'} overflow-auto harbor-scrollbar`}>
          {files.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <div className="text-3xl opacity-30">📁</div>
                <p>{searchQuery ? 'No matches found' : 'Empty folder'}</p>
              </div>
            </div>
          ) : (
            <div className="p-1.5 space-y-px">
              {files.map(file => (
                <button
                  key={file.name}
                  onClick={() => handleFileClick(file)}
                  onDoubleClick={() => file.type === 'file' && file.name.includes('studio.canvas') && openApp('canvas')}
                  className={`w-full text-left px-3 py-1.5 rounded flex items-center gap-2.5 transition-colors ${
                    selectedFile?.name === file.name ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-foreground'
                  } ${file.hidden ? 'opacity-50' : ''}`}
                >
                  {file.type === 'folder' ? (
                    <Folder size={15} className="text-[hsl(var(--harbor-gold))] shrink-0" />
                  ) : getFileIcon(file.name)}
                  <span className="text-[12px] truncate flex-1">{file.name}</span>
                  {file.type === 'folder' && (
                    <ChevronRight size={11} className="ml-auto text-muted-foreground shrink-0" />
                  )}
                  {file.type === 'file' && (
                    <span className="text-[9px] text-muted-foreground shrink-0">
                      {file.content ? `${(file.content.length / 1024).toFixed(1)}kb` : '—'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* File preview */}
        {selectedFile && (
          <div className="w-1/2 flex flex-col">
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-2">
              {getFileIcon(selectedFile.name)}
              <span className="text-xs font-medium text-foreground flex-1 truncate">{selectedFile.name}</span>
              {selectedFile.name.includes('studio.canvas') && (
                <button onClick={handleOpenInEditor} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  Open in Canvas
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3 harbor-scrollbar bg-[hsl(220,18%,13%)]">
              <pre className="text-[11px] text-[hsl(210,25%,75%)] font-mono whitespace-pre-wrap leading-5">
                {selectedFile.content || '(binary file)'}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="h-5 border-t border-border px-3 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">
          {totalFolders} folder{totalFolders !== 1 ? 's' : ''} · {totalFiles} file{totalFiles !== 1 ? 's' : ''}
          {searchQuery && ` (filtered)`}
        </span>
        <span className="text-[9px] text-muted-foreground">
          {showHidden ? 'Hidden files visible' : ''}
        </span>
      </div>
    </div>
  );
};

export default FileExplorerApp;
