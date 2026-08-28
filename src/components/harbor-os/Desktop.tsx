import React from 'react';
import { useGameStore } from '@/game/store';
import Dock from './Dock';
import OSWindow from './OSWindow';
import Prologue from './Prologue';
import HiddenConsole from './HiddenConsole';
import CursorEffects from './CursorEffects';

const wallpapers: Record<string, string> = {
  default: 'linear-gradient(180deg, hsl(200, 55%, 75%) 0%, hsl(210, 50%, 82%) 40%, hsl(35, 45%, 82%) 100%)',
  'wallpaper-lighthouse': 'linear-gradient(180deg, hsl(215, 45%, 25%) 0%, hsl(210, 50%, 45%) 40%, hsl(35, 50%, 75%) 100%)',
  'wallpaper-coffee': 'linear-gradient(180deg, hsl(30, 35%, 85%) 0%, hsl(25, 40%, 78%) 40%, hsl(20, 30%, 70%) 100%)',
  'wallpaper-neon': 'linear-gradient(180deg, hsl(260, 40%, 12%) 0%, hsl(280, 35%, 18%) 40%, hsl(300, 30%, 15%) 100%)',
};

// Functional dropdown menus
const MenuDropdown: React.FC<{ items: { label: string; action?: () => void; separator?: boolean; disabled?: boolean }[]; onClose: () => void }> = ({ items, onClose }) => (
  <div className="absolute top-7 left-0 z-[9999] harbor-glass rounded-md shadow-xl border border-border/50 py-1 min-w-[180px] animate-in fade-in duration-100" onClick={e => e.stopPropagation()}>
    {items.map((item, i) => item.separator ? (
      <div key={i} className="h-px bg-border/30 my-1" />
    ) : (
      <button key={i} onClick={() => { item.action?.(); onClose(); }}
        disabled={item.disabled}
        className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${item.disabled ? 'text-muted-foreground/30' : 'text-foreground hover:bg-primary/10'}`}>
        {item.label}
      </button>
    ))}
  </div>
);

const Desktop: React.FC = () => {
  const prologueComplete = useGameStore(s => s.prologueComplete);
  const completePrologue = useGameStore(s => s.completePrologue);
  const windows = useGameStore(s => s.windows);
  const unlockedWallpaper = useGameStore(s => s.unlockedWallpaper);
  const editorLevel = useGameStore(s => s.editorLevel);
  const projectsCompleted = useGameStore(s => s.projectsCompleted);
  const studioCanvasDiscovered = useGameStore(s => s.studioCanvasDiscovered);
  const themeMode = useGameStore(s => s.themeMode);
  const overrideCodes = useGameStore(s => s.overrideCodes);
  const gameTime = useGameStore(s => s.gameTime);
  const advanceTime = useGameStore(s => s.advanceTime);
  const menuOpen = useGameStore(s => s.menuOpen);
  const setMenuOpen = useGameStore(s => s.setMenuOpen);
  const openApp = useGameStore(s => s.openApp);
  const resetGame = useGameStore(s => s.resetGame);
  const toggleConsole = useGameStore(s => s.toggleConsole);

  // Apply theme
  React.useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'theme-neon', 'theme-frost', 'theme-nightshift');
    if (themeMode === 'dark' || themeMode === 'neon' || themeMode === 'nightshift') html.classList.add('dark');
    if (themeMode === 'neon') html.classList.add('theme-neon');
    if (themeMode === 'frost') html.classList.add('theme-frost');
    if (themeMode === 'nightshift') html.classList.add('theme-nightshift');
  }, [themeMode]);

  // Game time clock — 1 game minute every 1.5 real seconds
  React.useEffect(() => {
    const interval = setInterval(() => advanceTime(1), 1500);
    return () => clearInterval(interval);
  }, [advanceTime]);

  // Weather roll every ~90 real seconds for visible variety (rain/snow randomly)
  const setWeather = useGameStore(s => s.setWeather);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const s = useGameStore.getState();
      const season = s.gameTime.season;
      const r = Math.random();
      const pools: Record<string, [string, number][]> = {
        spring: [['clear', 0.45], ['cloudy', 0.25], ['rain', 0.25], ['fog', 0.05]],
        summer: [['clear', 0.7], ['cloudy', 0.18], ['rain', 0.1], ['fog', 0.02]],
        autumn: [['clear', 0.3], ['cloudy', 0.3], ['rain', 0.25], ['fog', 0.1], ['snow', 0.05]],
        winter: [['clear', 0.2], ['cloudy', 0.25], ['snow', 0.35], ['rain', 0.1], ['fog', 0.1]],
      };
      let acc = 0;
      for (const [w, p] of pools[season]) {
        acc += p;
        if (r < acc) { setWeather(w as any); break; }
      }
    }, 90000);
    return () => clearInterval(interval);
  }, [setWeather]);

  // Close menu on outside click
  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(null);
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen, setMenuOpen]);

  if (!prologueComplete) {
    return <Prologue onComplete={completePrologue} />;
  }

  const bg = wallpapers[unlockedWallpaper] || wallpapers.default;
  const isSlowmo = overrideCodes['easter-slowmo'];
  const isChaos = overrideCodes['easter-chaos'];
  const isGhost = overrideCodes['easter-ghost'];
  const isDrift = overrideCodes['anim-drift'];

  const timeStr = `${gameTime.hour.toString().padStart(2, '0')}:${gameTime.minute.toString().padStart(2, '0')}`;
  const dayPeriod = gameTime.hour >= 6 && gameTime.hour < 12 ? 'AM' : gameTime.hour >= 12 && gameTime.hour < 18 ? 'PM' : gameTime.hour >= 18 && gameTime.hour < 21 ? 'EVE' : 'NIGHT';

  const fileMenu = [
    { label: '📝 New Project...', action: () => openApp('mail') },
    { label: '📁 Open Files', action: () => openApp('files') },
    { separator: true },
    { label: '💾 Save (Auto)', disabled: true },
    { separator: true },
    { label: '⚙️ Settings', action: () => openApp('settings') },
  ];

  const editMenu = [
    { label: '↩ Undo  (Ctrl+Z)', disabled: true },
    { label: '↪ Redo  (Ctrl+Shift+Z)', disabled: true },
    { separator: true },
    { label: '🔍 Find...', disabled: true },
    { label: '📋 Copy', disabled: true },
  ];

  const viewMenu = [
    { label: '🗺️ Town Map', action: () => openApp('townMap') },
    { label: '📊 Project Board', action: () => openApp('projectBoard') },
    { label: '💬 Messages', action: () => openApp('chat') },
    { separator: true },
    { label: '🎨 Studio Canvas', action: () => openApp('canvas') },
    { label: '🎵 Music Player', action: () => openApp('music') },
    { separator: true },
    { label: '🖥️ Toggle Console  (Ctrl+`)', action: () => toggleConsole() },
  ];

  const helpMenu = [
    { label: '📖 About Harbor Studio', action: () => {} },
    { label: '⌨️ Keyboard Shortcuts', disabled: true },
    { separator: true },
    { label: '🔄 Reset Progress...', action: () => { if (confirm('Reset all progress?')) resetGame(); } },
  ];

  return (
    <div className={`fixed inset-0 overflow-hidden select-none ${isSlowmo ? 'slowmo-mode' : ''} ${isChaos ? 'chaos-mode' : ''} ${isGhost ? 'ghost-mode' : ''} ${isDrift ? 'drift-mode' : ''}`}
      style={{ background: bg }}>
      {/* Menu bar */}
      <div className="h-7 harbor-glass border-b border-border/30 flex items-center justify-between px-4 z-[9999] relative">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-foreground">⚓ Harbor Studio</span>
          {[
            { id: 'file', label: 'File', items: fileMenu },
            { id: 'edit', label: 'Edit', items: editMenu },
            { id: 'view', label: 'View', items: viewMenu },
            { id: 'help', label: 'Help', items: helpMenu },
          ].map(menu => (
            <div key={menu.id} className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === menu.id ? null : menu.id); }}
                className={`text-[11px] px-1 transition-colors ${menuOpen === menu.id ? 'text-foreground bg-primary/10 rounded' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {menu.label}
              </button>
              {menuOpen === menu.id && <MenuDropdown items={menu.items as any} onClose={() => setMenuOpen(null)} />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {editorLevel > 1 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-mono">L{editorLevel}</span>
            )}
            {studioCanvasDiscovered && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-mono">Canvas</span>
            )}
            {themeMode !== 'light' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">{themeMode}</span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">
            {projectsCompleted > 0 && `${projectsCompleted} ✓ · `}
            Day {gameTime.dayCount} · {timeStr} {dayPeriod}
          </span>
        </div>
      </div>

      {/* Desktop area */}
      <div className="absolute inset-0 top-7 bottom-[52px]" style={{ minHeight: 0 }}>
        {windows.map(w => (
          <OSWindow key={w.id} window={w} />
        ))}

        {windows.filter(w => !w.isMinimized).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3 opacity-25">
              <div className="text-5xl">⚓</div>
              <p className="text-sm font-medium text-foreground/50">Click an app in the dock to get started</p>
              <p className="text-[10px] text-foreground/20 font-mono">Ctrl + ` for console</p>
            </div>
          </div>
        )}
      </div>

      <HiddenConsole />
      <CursorEffects />
      <Dock />
    </div>
  );
};

export default Desktop;
