import React from 'react';
import { useGameStore } from '@/game/store';
import { AppId } from '@/game/types';
import { Mail, Code2, Layout, Map, MessageSquare, FolderOpen, Globe, Palette, Settings, Music, Gamepad2, Lock, Home } from 'lucide-react';
import { audioEngine } from '@/game/audio';

const allDockApps: { id: AppId; icon: React.ReactNode; label: string; alwaysShow?: boolean }[] = [
  { id: 'mail', icon: <Mail size={20} />, label: 'Harbor Mail' },
  { id: 'editor', icon: <Code2 size={20} />, label: 'Notepad+' },
  { id: 'projectBoard', icon: <Layout size={20} />, label: 'Project Board' },
  { id: 'townMap', icon: <Map size={20} />, label: 'Harbor Row' },
  { id: 'studioRoom', icon: <Home size={20} />, label: 'Your Studio' },
  { id: 'chat', icon: <MessageSquare size={20} />, label: 'Messages' },
  { id: 'files', icon: <FolderOpen size={20} />, label: 'Files' },
  { id: 'forum', icon: <Globe size={20} />, label: 'Seabrook Board' },
  { id: 'canvas', icon: <Palette size={20} />, label: 'Studio Canvas' },
  { id: 'music', icon: <Music size={20} />, label: 'Music' },
  { id: 'miniGame', icon: <Gamepad2 size={20} />, label: 'Mini-Games' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Settings', alwaysShow: true },
];

const Dock: React.FC = () => {
  const openApp = useGameStore(s => s.openApp);
  const badges = useGameStore(s => s.dockBadges);
  const unlockedApps = useGameStore(s => s.unlockedApps);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const dockApps = allDockApps.filter(a =>
    a.alwaysShow || unlockedApps.includes(a.id)
  );

  const handleClick = (appId: AppId) => {
    audioEngine.playClick();
    openApp(appId);
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="harbor-dock-glass rounded-2xl px-2 py-1.5 flex items-center gap-0.5 shadow-2xl border border-[hsl(220,20%,25%)]">
        {dockApps.map((app, i) => {
          const showSep = app.id === 'settings' && i > 0;
          return (
            <React.Fragment key={app.id}>
              {showSep && <div className="w-px h-6 bg-[hsl(220,15%,30%)] mx-0.5" />}
              <button
                onClick={() => handleClick(app.id)}
                onMouseEnter={() => setHoveredId(app.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 hover:bg-[hsl(220,20%,25%)] active:scale-90"
              >
                {hoveredId === app.id && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 harbor-glass px-2 py-0.5 rounded-md text-[10px] font-medium text-foreground whitespace-nowrap shadow-lg border border-border animate-in fade-in duration-100">
                    {app.label}
                  </div>
                )}
                <span className="text-os-dock-foreground transition-transform duration-150 group-hover:scale-110">
                  {app.icon}
                </span>
                {(badges[app.id] || 0) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center">
                    {badges[app.id]}
                  </span>
                )}
                <RunningDot appId={app.id} />
              </button>
            </React.Fragment>
          );
        })}

        <div className="w-px h-6 bg-[hsl(220,15%,30%)] mx-0.5" />
        <MinimizedDots />
      </div>
    </div>
  );
};

const RunningDot: React.FC<{ appId: AppId }> = ({ appId }) => {
  const windows = useGameStore(s => s.windows);
  const isRunning = windows.some(w => w.appId === appId);
  if (!isRunning) return null;
  return <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[hsl(var(--harbor-ocean))]" />;
};

const MinimizedDots: React.FC = () => {
  const windows = useGameStore(s => s.windows);
  const focusWindow = useGameStore(s => s.focusWindow);
  const minimized = windows.filter(w => w.isMinimized);
  if (minimized.length === 0) return null;

  return (
    <div className="flex gap-1 px-1">
      {minimized.map(w => (
        <button key={w.id} onClick={() => focusWindow(w.id)}
          className="w-2 h-2 rounded-full bg-[hsl(var(--harbor-ocean))] opacity-40 hover:opacity-100 transition-opacity" title={w.title} />
      ))}
    </div>
  );
};

export default Dock;
