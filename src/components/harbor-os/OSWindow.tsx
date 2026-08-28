import React from 'react';
import { useGameStore } from '@/game/store';
import { WindowState } from '@/game/types';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import MailApp from '../apps/MailApp';
import EditorApp from '../apps/EditorApp';
import ProjectBoardApp from '../apps/ProjectBoardApp';
import TownMapApp from '../apps/TownMapApp';
import ChatApp from '../apps/ChatApp';
import FileExplorerApp from '../apps/FileExplorerApp';
import ForumApp from '../apps/ForumApp';
import StudioCanvasApp from '../apps/StudioCanvasApp';
import SettingsApp from '../apps/SettingsApp';
import MusicPlayerApp from '../apps/MusicPlayerApp';
import MiniGameApp from '../apps/MiniGameApp';
import EnvironmentalImpactApp from '../apps/EnvironmentalImpactApp';
import StudioRoomApp from '../apps/StudioRoomApp';

const AppContent: React.FC<{ appId: string }> = ({ appId }) => {
  switch (appId) {
    case 'mail': return <MailApp />;
    case 'editor': return <EditorApp />;
    case 'projectBoard': return <ProjectBoardApp />;
    case 'townMap': return <TownMapApp />;
    case 'chat': return <ChatApp />;
    case 'files': return <FileExplorerApp />;
    case 'forum': return <ForumApp />;
    case 'canvas': return <StudioCanvasApp />;
    case 'settings': return <SettingsApp />;
    case 'music': return <MusicPlayerApp />;
    case 'miniGame': return <MiniGameApp />;
    case 'impact': return <EnvironmentalImpactApp />;
    case 'studioRoom': return <StudioRoomApp />;
    default: return <div className="p-4 text-muted-foreground">App not found</div>;
  }
};

const OSWindow: React.FC<{ window: WindowState }> = ({ window: win }) => {
  const closeWindow = useGameStore(s => s.closeWindow);
  const focusWindow = useGameStore(s => s.focusWindow);
  const minimizeWindow = useGameStore(s => s.minimizeWindow);
  const maximizeWindow = useGameStore(s => s.maximizeWindow);
  const activeWindowId = useGameStore(s => s.activeWindowId);
  const isActive = activeWindowId === win.id;

  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [pos, setPos] = React.useState(win.position);
  const [size, setSize] = React.useState(win.size);
  const [resizeStart, setResizeStart] = React.useState({ x: 0, y: 0, w: 0, h: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    focusWindow(win.id);
  };

  const handleDoubleClick = () => maximizeWindow(win.id);

  React.useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - dragOffset.x, y: Math.max(28, e.clientY - dragOffset.y) });
    };
    const handleUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => { document.removeEventListener('mousemove', handleMove); document.removeEventListener('mouseup', handleUp); };
  }, [isDragging, dragOffset]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, w: size.w, h: size.h });
    focusWindow(win.id);
  };

  React.useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      setSize({
        w: Math.max(300, resizeStart.w + (e.clientX - resizeStart.x)),
        h: Math.max(200, resizeStart.h + (e.clientY - resizeStart.y)),
      });
    };
    const handleUp = () => setIsResizing(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => { document.removeEventListener('mousemove', handleMove); document.removeEventListener('mouseup', handleUp); };
  }, [isResizing, resizeStart]);

  if (win.isMinimized) return null;

  const isMax = win.isMaximized;

  return (
    <div
      className={`absolute flex flex-col ${isMax ? '' : 'rounded-lg'} overflow-hidden shadow-2xl border ${
        isActive ? 'border-border shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)]' : 'border-border/40 shadow-lg'
      }`}
      style={{
        left: isMax ? 0 : pos.x,
        top: isMax ? 0 : pos.y,
        width: isMax ? '100%' : size.w,
        height: isMax ? '100%' : size.h,
        zIndex: win.zIndex,
        transition: isMax ? 'none' : undefined,
      }}
      onMouseDown={() => !isActive && focusWindow(win.id)}
    >
      {/* Titlebar */}
      <div
        className={`flex items-center h-8 px-3 shrink-0 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isActive ? 'bg-os-titlebar-active' : 'bg-os-titlebar'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="window-controls flex items-center gap-1.5 mr-3">
          <button onClick={() => closeWindow(win.id)}
            className="w-3 h-3 rounded-full bg-[hsl(0,68%,52%)] hover:brightness-90 transition-colors flex items-center justify-center group">
            <X size={7} className="text-[hsl(0,68%,20%)] opacity-0 group-hover:opacity-100" />
          </button>
          <button onClick={() => minimizeWindow(win.id)}
            className="w-3 h-3 rounded-full bg-[hsl(45,90%,55%)] hover:bg-[hsl(45,90%,45%)] transition-colors flex items-center justify-center group">
            <Minus size={7} className="text-[hsl(45,90%,25%)] opacity-0 group-hover:opacity-100" />
          </button>
          <button onClick={() => maximizeWindow(win.id)}
            className="w-3 h-3 rounded-full bg-[hsl(130,55%,50%)] hover:bg-[hsl(130,55%,40%)] transition-colors flex items-center justify-center group">
            {isMax ? <Maximize2 size={6} className="text-[hsl(130,55%,20%)] opacity-0 group-hover:opacity-100" /> : <Square size={6} className="text-[hsl(130,55%,20%)] opacity-0 group-hover:opacity-100" />}
          </button>
        </div>

        <span className="text-[11px] font-medium text-muted-foreground flex-1 text-center truncate">
          {win.title}
        </span>

        <div className="w-[54px]" />
      </div>

      {/* Content */}
      <div className="flex-1 bg-os-window-bg overflow-hidden">
        <AppContent appId={win.appId} />
      </div>

      {/* Resize handle */}
      {!isMax && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10" onMouseDown={handleResizeStart}>
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground/20">
            <path d="M14,16 L16,14 M10,16 L16,10 M6,16 L16,6" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OSWindow;
