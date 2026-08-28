import React from 'react';
import { useGameStore } from '@/game/store';
import { getTimePeriod } from '@/game/time-weather';
import { Trash2, Plus, MapPin } from 'lucide-react';

const StudioRoomApp: React.FC = () => {
  const studioItems = useGameStore(s => s.studioItems);
  const gameTime = useGameStore(s => s.gameTime);
  const openApp = useGameStore(s => s.openApp);
  const removeStudioItem = useGameStore(s => s.removeStudioItem);
  const updateStudioItem = useGameStore(s => s.updateStudioItem);
  const pinCanvasToStudio = useGameStore(s => s.pinCanvasToStudio);
  const canvasElements = useGameStore(s => s.canvasElements);
  const currentWall = useGameStore(s => s.currentStudioWall);
  const setCurrentWall = useGameStore(s => s.setStudioWall);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showPinnedList, setShowPinnedList] = React.useState(false);
  const hasCanvas = canvasElements.some(e => e.id === 'canvas-html');
  const weather = gameTime.weather;
  const allCanvasItems = studioItems.filter(i => i.type === 'canvas');

  const period = getTimePeriod(gameTime.hour);
  const isDark = period === 'night' || period === 'dusk';
  const windowLight = period === 'dawn' ? '#ffeaa7' : period === 'morning' ? '#74b9ff' : period === 'afternoon' ? '#dfe6e9' : period === 'evening' ? '#e17055' : period === 'dusk' ? '#6c5ce7' : '#2d3436';

  const wallItems = studioItems.filter(i => i.wall === currentWall && i.unlocked);

  const wallLabels = { front: 'Desk & Computer', left: 'Bookshelf Wall', right: 'Window & Corkboard', back: 'Door & Shelf' };

  return (
    <div className="h-full flex flex-col bg-[#1e1a17]">
      {/* Studio View */}
      <div className="flex-1 relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
          {/* Floor */}
          <rect x="0" y="200" width="400" height="80" fill="#3a3020" />
          <line x1="50" y1="200" x2="0" y2="280" stroke="#4a4030" strokeWidth="0.5" opacity="0.3" />
          <line x1="150" y1="200" x2="120" y2="280" stroke="#4a4030" strokeWidth="0.5" opacity="0.3" />
          <line x1="250" y1="200" x2="240" y2="280" stroke="#4a4030" strokeWidth="0.5" opacity="0.3" />
          <line x1="350" y1="200" x2="360" y2="280" stroke="#4a4030" strokeWidth="0.5" opacity="0.3" />

          {/* Wall */}
          <rect x="0" y="0" width="400" height="200" fill="#2a2520" />
          <rect x="0" y="0" width="400" height="200" fill="url(#wallTexture)" opacity="0.08" />
          <defs>
            <pattern id="wallTexture" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="none" />
              <line x1="0" y1="10" x2="20" y2="10" stroke="#5a5040" strokeWidth="0.3" />
            </pattern>
          </defs>

          {/* Wall baseboard */}
          <rect x="0" y="195" width="400" height="5" fill="#1a1510" />

          {currentWall === 'front' && (
            <>
              {/* Desk */}
              <rect x="80" y="140" width="240" height="8" fill="#5a4a35" rx="1" />
              <rect x="90" y="148" width="8" height="52" fill="#4a3a25" />
              <rect x="302" y="148" width="8" height="52" fill="#4a3a25" />
              <rect x="100" y="175" width="200" height="5" fill="#4a3a25" rx="1" />

              {/* Monitor */}
              <rect x="150" y="70" width="100" height="65" fill="#111" rx="3" />
              <rect x="153" y="73" width="94" height="56" fill={isDark ? '#1a2030' : '#1e2636'} rx="1" />
              <text x="200" y="105" textAnchor="middle" fontSize="7" fill="#5a8aaa" fontFamily="monospace">Harbor OS</text>
              <text x="200" y="118" textAnchor="middle" fontSize="5" fill="#4a6a7a" fontFamily="monospace">v1.0.3</text>
              <rect x="190" y="135" width="20" height="5" fill="#333" rx="1" />

              {/* Keyboard */}
              <rect x="165" y="145" width="70" height="20" fill="#222" rx="2" opacity="0.5" />

              {/* Mug */}
              <rect x="285" y="128" width="14" height="16" fill="#8a6a4a" rx="2" />
              <rect x="295" y="132" width="5" height="8" fill="none" stroke="#8a6a4a" strokeWidth="1.5" rx="2" />
            </>
          )}

          {currentWall === 'right' && (
            <>
              <rect x="100" y="30" width="120" height="110" fill="#2a3540" rx="2" stroke="#4a3a2a" strokeWidth="3" />
              <rect x="105" y="35" width="110" height="100" fill={windowLight} opacity="0.3" rx="1" />
              <defs>
                <clipPath id="winClip"><rect x="105" y="35" width="110" height="100" rx="1" /></clipPath>
              </defs>
              <g clipPath="url(#winClip)">
                {weather === 'rain' && [...Array(20)].map((_, i) => {
                  const x = 105 + (i * 13 + 7) % 110;
                  const y = 35 + (i * 11 + 3) % 100;
                  return <line key={i} x1={x} y1={y} x2={x - 1} y2={y + 5} stroke="#9ac" strokeWidth="0.4" opacity="0.6">
                    <animate attributeName="y1" values={`${y};${y + 100}`} dur={`${0.6 + (i % 4) * 0.1}s`} repeatCount="indefinite" />
                    <animate attributeName="y2" values={`${y + 5};${y + 105}`} dur={`${0.6 + (i % 4) * 0.1}s`} repeatCount="indefinite" />
                  </line>;
                })}
                {weather === 'snow' && [...Array(15)].map((_, i) => {
                  const x = 105 + (i * 17 + 5) % 110;
                  const y = 35 + (i * 13 + 2) % 100;
                  return <circle key={i} cx={x} cy={y} r={0.8 + (i % 3) * 0.3} fill="white" opacity="0.7">
                    <animate attributeName="cy" values={`${y};${y + 100}`} dur={`${2 + (i % 3) * 0.6}s`} repeatCount="indefinite" />
                  </circle>;
                })}
                {weather === 'fog' && (
                  <rect x="105" y="35" width="110" height="100" fill="white" opacity="0.35">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" />
                  </rect>
                )}
              </g>
              <line x1="160" y1="35" x2="160" y2="135" stroke="#4a3a2a" strokeWidth="2" />
              <line x1="105" y1="85" x2="215" y2="85" stroke="#4a3a2a" strokeWidth="2" />

              {/* Corkboard */}
              <rect x="260" y="40" width="100" height="80" fill="#a0784a" rx="2" stroke="#6a5830" strokeWidth="2" />
              <rect x="265" y="45" width="90" height="70" fill="#b88a5a" rx="1" />
              {allCanvasItems.slice(0, 6).map((it, i) => {
                const cx = 270 + (i % 3) * 28;
                const cy = 50 + Math.floor(i / 3) * 32;
                const rot = i % 2 === 0 ? -3 : 2;
                return (
                  <g key={it.id} className="cursor-pointer" onClick={() => { setCurrentWall(it.wall); setSelectedId(it.id); }}>
                    <rect x={cx} y={cy} width="24" height="20" fill="#f0e8d0" rx="1" transform={`rotate(${rot} ${cx + 12} ${cy + 10})`} />
                    <text x={cx + 12} y={cy + 13} textAnchor="middle" fontSize="3.5" fill="#555"
                      transform={`rotate(${rot} ${cx + 12} ${cy + 10})`}>{it.name.slice(0, 10)}</text>
                    <circle cx={cx + 12} cy={cy} r="1.5" fill="#cc3333" />
                  </g>
                );
              })}
              {allCanvasItems.length === 0 && <text x="310" y="82" fontSize="5" fill="#5a4a3a" textAnchor="middle" opacity="0.6">empty corkboard</text>}
            </>
          )}

          {currentWall === 'left' && (
            <>
              {/* Bookshelf */}
              <rect x="60" y="30" width="180" height="170" fill="#3a2a1a" rx="2" />
              {[0, 1, 2, 3].map(row => (
                <g key={row}>
                  <rect x="65" y={38 + row * 42} width="170" height="5" fill="#4a3a2a" />
                  {[...Array(6)].map((_, i) => {
                    const colors = ['#8b4513', '#4a6a8a', '#6a4a6a', '#2a6a4a', '#8a6a2a', '#5a3a2a'];
                    const w = 12 + (i % 3) * 4;
                    return <rect key={i} x={70 + i * 28} y={38 + row * 42 - 28 + (i % 2) * 3} width={w} height={25 - (i % 2) * 3} fill={colors[i]} rx="1" opacity="0.8" />;
                  })}
                </g>
              ))}

              {/* Plant */}
              <circle cx="290" cy="170" r="15" fill="#3a6a3a" opacity="0.8" />
              <circle cx="285" cy="165" r="10" fill="#4a7a4a" opacity="0.7" />
              <rect x="283" y="182" width="14" height="18" fill="#8a6a4a" rx="2" />
            </>
          )}

          {currentWall === 'back' && (
            <>
              {/* Door */}
              <rect x="150" y="40" width="80" height="160" fill="#4a3a2a" rx="2" stroke="#3a2a1a" strokeWidth="3" />
              <circle cx="220" cy="120" r="3" fill="#8a7a5a" />
              
              {/* Coat hook */}
              <rect x="100" y="60" width="3" height="8" fill="#666" />
              
              {/* Small shelf */}
              <rect x="260" y="100" width="80" height="5" fill="#4a3a2a" rx="1" />
              <rect x="260" y="105" width="3" height="30" fill="#3a2a1a" />
              <rect x="337" y="105" width="3" height="30" fill="#3a2a1a" />
            </>
          )}

          {/* Placed non-canvas decorations from emoji items */}
          {wallItems.filter(i => i.type !== 'canvas').map(item => (
            <text key={item.id} x={item.x * 4} y={item.y * 2.8} fontSize="16" textAnchor="middle"
              className="cursor-pointer" onClick={() => setSelectedId(item.id)}>{item.emoji}</text>
          ))}

          {/* Ambient light overlay */}
          {isDark && <rect x="0" y="0" width="400" height="280" fill="rgba(0,0,0,0.3)" />}
          {isDark && (
            <ellipse cx="200" cy="100" rx="80" ry="60" fill="rgba(255,230,150,0.05)" />
          )}
          {weather === 'fog' && (
            <rect x="0" y="0" width="400" height="280" fill="white" opacity="0.18">
              <animate attributeName="opacity" values="0.12;0.25;0.12" dur="8s" repeatCount="indefinite" />
            </rect>
          )}
        </svg>

        {/* Canvas items rendered as live iframes overlaid */}
        {wallItems.filter(i => i.type === 'canvas' && i.preview).map(item => {
          const isSel = selectedId === item.id;
          const doc = `<!DOCTYPE html><html><head><style>${item.preview!.css}</style></head><body style="margin:0;overflow:hidden;transform:scale(0.35);transform-origin:0 0;width:285%;height:285%;">${item.preview!.html}<script>try{${item.preview!.js}}catch(e){}<\/script></body></html>`;
          return (
            <div key={item.id}
              onMouseDown={(e) => {
                setSelectedId(item.id);
                const startX = e.clientX, startY = e.clientY, ix = item.x, iy = item.y;
                const move = (ev: MouseEvent) => {
                  const dx = (ev.clientX - startX) * (100 / e.currentTarget.parentElement!.clientWidth);
                  const dy = (ev.clientY - startY) * (100 / e.currentTarget.parentElement!.clientHeight);
                  updateStudioItem(item.id, { x: Math.max(0, Math.min(90, ix + dx)), y: Math.max(0, Math.min(85, iy + dy)) });
                };
                const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
              }}
              className={`absolute cursor-move rounded shadow-lg overflow-hidden bg-white ${isSel ? 'ring-2 ring-primary' : 'ring-1 ring-black/40'}`}
              style={{
                left: `${item.x}%`, top: `${item.y}%`,
                width: `${item.width || 25}%`, height: `${item.height || 18}%`,
              }}
              title={item.name}>
              <iframe srcDoc={doc} className="w-full h-full border-0 pointer-events-none" sandbox="allow-scripts" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white px-1 truncate">{item.name}</div>
            </div>
          );
        })}
      </div>

      {/* Wall navigation */}
      <div className="border-t border-border/30 bg-card px-4 py-2 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {(['left', 'front', 'right', 'back'] as const).map(wall => (
              <button key={wall} onClick={() => { setCurrentWall(wall); setSelectedId(null); }}
                className={`text-[11px] px-3 py-1 rounded transition-colors ${currentWall === wall ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
                {wall === 'front' ? '🖥️ Desk' : wall === 'left' ? '📚 Books' : wall === 'right' ? '🪟 Window' : '🚪 Door'}
              </button>
            ))}
          </div>
          <div className="flex gap-1 items-center">
            {selectedId && (
              <>
                <button onClick={() => { const it = studioItems.find(i => i.id === selectedId); if (it) updateStudioItem(it.id, { width: Math.min(80, (it.width || 25) + 5), height: Math.min(70, (it.height || 18) + 3) }); }}
                  className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted/80">+</button>
                <button onClick={() => { const it = studioItems.find(i => i.id === selectedId); if (it) updateStudioItem(it.id, { width: Math.max(8, (it.width || 25) - 5), height: Math.max(6, (it.height || 18) - 3) }); }}
                  className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted/80">−</button>
                <button onClick={() => { removeStudioItem(selectedId); setSelectedId(null); }}
                  className="text-[10px] px-2 py-1 rounded bg-destructive/15 text-destructive hover:bg-destructive/25 flex items-center gap-1">
                  <Trash2 size={10} /> Remove
                </button>
              </>
            )}
            {hasCanvas && (
              <button onClick={() => {
                const name = prompt('Name this canvas piece:', `Canvas on ${currentWall} wall`);
                if (name !== null) pinCanvasToStudio(name || 'Untitled', currentWall);
              }}
                className="text-[10px] px-2 py-1 rounded bg-accent/15 text-accent hover:bg-accent/25 flex items-center gap-1">
                <Plus size={10} /> Pin Canvas
              </button>
            )}
            <button onClick={() => setShowPinnedList(s => !s)}
              className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted/80 flex items-center gap-1">
              <MapPin size={10} /> Pinned ({allCanvasItems.length})
            </button>
            <button onClick={() => openApp('canvas')} className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Edit Canvas
            </button>
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground">{wallLabels[currentWall]} · {weather !== 'clear' ? weather + ' · ' : ''}Drag to move · Click to select</p>
        {showPinnedList && (
          <div className="border-t border-border/30 pt-1 max-h-36 overflow-y-auto">
            {allCanvasItems.length === 0 && <p className="text-[10px] text-muted-foreground italic">No pinned canvas pieces yet — pin from any wall.</p>}
            {allCanvasItems.map(it => (
              <button key={it.id}
                onClick={() => { setCurrentWall(it.wall); setSelectedId(it.id); setShowPinnedList(false); }}
                className={`w-full text-left text-[10px] px-2 py-1 rounded flex items-center justify-between ${selectedId === it.id ? 'bg-primary/10' : 'hover:bg-muted/60'}`}>
                <span className="truncate">🖼️ {it.name}</span>
                <span className="text-muted-foreground ml-2">{it.wall}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioRoomApp;
