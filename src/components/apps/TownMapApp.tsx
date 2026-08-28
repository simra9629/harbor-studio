import React from 'react';
import { useGameStore } from '@/game/store';
import { clients } from '@/game/clients';
import { allLevels } from '@/game/levels';
import { getSkyColors, getTimePeriod } from '@/game/time-weather';

interface Building {
  id: string;
  name: string;
  clientId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  roofColor: string;
  roofType: 'flat' | 'gable' | 'pointed';
  description: string;
  hasAwning?: boolean;
  awningColor?: string;
  signText?: string;
  windowCount: number;
  doorColor: string;
}

const harborRowBuildings: Building[] = [
  { id: 'studio', name: 'Harbor Studio', x: 55, y: 175, width: 60, height: 72, color: '#e8ddd0', roofColor: '#8b7355', roofType: 'gable', description: 'Your workspace', windowCount: 3, doorColor: '#6b5b3e', signText: 'STUDIO' },
  { id: 'bakery', name: "Elena's Bakery", clientId: 'elena', x: 140, y: 162, width: 82, height: 90, color: '#f5e6d3', roofColor: '#c4956a', roofType: 'gable', description: 'Fresh bread daily', windowCount: 4, doorColor: '#8b6914', hasAwning: true, awningColor: '#e8a87c', signText: "ELENA'S BAKERY" },
  { id: 'bookstore', name: "Iqbal's Books", clientId: 'iqbal', x: 248, y: 166, width: 76, height: 86, color: '#d4c4a8', roofColor: '#6b5b3e', roofType: 'flat', description: 'Books & Antiquarian', windowCount: 5, doorColor: '#4a3a2a', signText: "IQBAL'S BOOKS" },
  { id: 'cafe', name: "Theo's Café", clientId: 'theo', x: 348, y: 164, width: 78, height: 88, color: '#2a2a2a', roofColor: '#1a1a1a', roofType: 'flat', description: 'Best coffee on Harbor Row', windowCount: 3, doorColor: '#444', hasAwning: true, awningColor: '#333', signText: "THEO'S CAFÉ" },
  { id: 'florist', name: 'Harbor Blooms', clientId: 'maya', x: 450, y: 172, width: 58, height: 80, color: '#d4e8d4', roofColor: '#5a7a5a', roofType: 'gable', description: 'Flowers & arrangements', windowCount: 2, doorColor: '#4a6a4a', signText: 'HARBOR BLOOMS' },
  { id: 'chandlery', name: "Rowe's Chandlery", x: 525, y: 168, width: 65, height: 84, color: '#c8b89a', roofColor: '#7a6a4a', roofType: 'flat', description: 'Maritime supplies', windowCount: 3, doorColor: '#5a4a3a', signText: 'CHANDLERY' },
  { id: 'fishmarket', name: 'Fresh Catch', x: 610, y: 170, width: 72, height: 82, color: '#b8d4e3', roofColor: '#5a8fa8', roofType: 'flat', description: 'Daily seafood', windowCount: 3, doorColor: '#4a7a8a', hasAwning: true, awningColor: '#7ab0c8', signText: 'FRESH CATCH' },
  { id: 'postoffice', name: 'Post Office', x: 700, y: 170, width: 60, height: 82, color: '#e0d0c0', roofColor: '#8a7a5a', roofType: 'gable', description: 'Mail & parcels', windowCount: 3, doorColor: '#6a5a4a', signText: 'POST OFFICE' },
  { id: 'lighthouse', name: 'Lighthouse', x: 790, y: 110, width: 32, height: 142, color: '#f0f0f0', roofColor: '#cc3333', roofType: 'pointed', description: 'Guides ships home', windowCount: 2, doorColor: '#888' },
  { id: 'harbor', name: 'Harbor Office', x: 845, y: 168, width: 70, height: 84, color: '#c5d5c5', roofColor: '#5a7a5a', roofType: 'flat', description: 'Port Authority', windowCount: 4, doorColor: '#4a6a4a', signText: 'PORT' },
];

const seabrookBuildings: Building[] = [
  { id: 'pier', name: 'Seabrook Pier', x: 60, y: 180, width: 70, height: 65, color: '#d8c8a8', roofColor: '#8a7a5a', roofType: 'flat', description: 'Boardwalk entrance', windowCount: 2, doorColor: '#6a5a3a', signText: 'PIER' },
  { id: 'boutique', name: 'Tide & Linen', clientId: 'mira', x: 155, y: 158, width: 88, height: 94, color: '#f0ece4', roofColor: '#9a8a7a', roofType: 'flat', description: 'Modern coastal boutique', windowCount: 6, doorColor: '#3a3a3a', signText: 'TIDE & LINEN', hasAwning: true, awningColor: '#d4c0a8' },
  { id: 'gelato', name: 'Sole Gelato', x: 270, y: 168, width: 64, height: 84, color: '#ffd6e0', roofColor: '#cc8aa0', roofType: 'gable', description: 'Italian gelato', windowCount: 3, doorColor: '#a05a70', hasAwning: true, awningColor: '#ff9ab0', signText: 'GELATO' },
  { id: 'arcade', name: 'Promenade Arcade', x: 350, y: 162, width: 92, height: 90, color: '#3a2a5a', roofColor: '#1a0a3a', roofType: 'flat', description: '80s vibes, real coins', windowCount: 5, doorColor: '#aa44ff', signText: 'ARCADE' },
  { id: 'surfschool', name: 'Bennett & Co.', clientId: 'lucas', x: 470, y: 170, width: 76, height: 82, color: '#a8d8e8', roofColor: '#5a8aa8', roofType: 'gable', description: 'Bennett startup HQ', windowCount: 3, doorColor: '#4a7a98', signText: 'BENNETT & CO' },
  { id: 'icecream', name: 'The Cone', x: 575, y: 174, width: 50, height: 78, color: '#fff0d0', roofColor: '#e0a040', roofType: 'pointed', description: 'Soft serve & sundaes', windowCount: 2, doorColor: '#a06000' },
  { id: 'gallery', name: 'Driftwood Gallery', x: 650, y: 168, width: 70, height: 84, color: '#e8e0d0', roofColor: '#7a6a5a', roofType: 'flat', description: 'Local artists', windowCount: 4, doorColor: '#5a4a3a', signText: 'GALLERY' },
  { id: 'hotel', name: 'Hotel Mistral', x: 750, y: 145, width: 90, height: 107, color: '#e0d4c0', roofColor: '#a08a6a', roofType: 'flat', description: 'Boutique hotel', windowCount: 9, doorColor: '#6a5a4a', signText: 'MISTRAL', hasAwning: true, awningColor: '#c0a878' },
  { id: 'pieroffice', name: 'Pier Office', x: 860, y: 175, width: 60, height: 77, color: '#c8d8d0', roofColor: '#5a7a6a', roofType: 'flat', description: 'Boardwalk mgmt', windowCount: 3, doorColor: '#4a6a5a' },
];

// Act III — Cedar Heights University Campus (per doc)
interface CedarBuilding extends Building { subdistrict?: 'innovation-hall' | 'student-hub' | 'north-lawn' }
const cedarHeightsBuildings: CedarBuilding[] = [
  { id: 'transit', name: 'Campus Transit Hub', clientId: 'events', x: 50, y: 165, width: 80, height: 87, color: '#d0d0d8', roofColor: '#5a5a6a', roofType: 'flat', description: 'Shuttle & event portal', windowCount: 6, doorColor: '#3a3a4a', signText: 'TRANSIT', subdistrict: 'innovation-hall' },
  { id: 'architect', name: 'Dept. of Design', clientId: 'dean', x: 150, y: 130, width: 95, height: 122, color: '#f8f8f8', roofColor: '#1a1a1a', roofType: 'flat', description: 'Department offices', windowCount: 9, doorColor: '#1a1a1a', signText: 'DEPT', subdistrict: 'student-hub' },
  { id: 'startup', name: 'Kindle.dev Incubator', clientId: 'nora', x: 265, y: 110, width: 110, height: 142, color: '#0a0a18', roofColor: '#000', roofType: 'flat', description: 'Campus incubator', windowCount: 12, doorColor: '#5af', signText: 'KINDLE.DEV', hasAwning: true, awningColor: '#1a1a3a', subdistrict: 'innovation-hall' },
  { id: 'coworking', name: 'Student Union', x: 395, y: 145, width: 90, height: 107, color: '#e8d8c8', roofColor: '#7a5a3a', roofType: 'flat', description: 'Student lounge', windowCount: 8, doorColor: '#5a3a1a', signText: 'UNION', subdistrict: 'student-hub' },
  { id: 'bookstore2', name: 'Campus Bookshop', x: 505, y: 160, width: 70, height: 92, color: '#d8c0a0', roofColor: '#6a4a2a', roofType: 'gable', description: 'Texts & supplies', windowCount: 4, doorColor: '#4a2a0a', signText: 'BOOKS', subdistrict: 'north-lawn' },
  { id: 'matcha', name: 'Hush Matcha', clientId: 'jun', x: 595, y: 168, width: 60, height: 84, color: '#d8e8c8', roofColor: '#5a7a4a', roofType: 'flat', description: 'Matcha bar', windowCount: 2, doorColor: '#3a5a2a', hasAwning: true, awningColor: '#a0c080', subdistrict: 'student-hub' },
  { id: 'gym', name: 'Robotics Lab', clientId: 'robotics', x: 670, y: 145, width: 90, height: 107, color: '#3a3a3a', roofColor: '#1a1a1a', roofType: 'flat', description: 'Student robotics club', windowCount: 6, doorColor: '#ff6633', signText: 'ROBOTICS', subdistrict: 'innovation-hall' },
  { id: 'tower', name: 'Cedar Library', clientId: 'iris', x: 785, y: 90, width: 65, height: 162, color: '#c8d0d8', roofColor: '#3a3a4a', roofType: 'flat', description: 'Main university library', windowCount: 18, doorColor: '#3a3a4a', subdistrict: 'north-lawn' },
];

const cedarSubdistricts = [
  { id: 'all', label: 'All Campus' },
  { id: 'innovation-hall', label: 'Innovation Hall' },
  { id: 'student-hub', label: 'Student Hub' },
  { id: 'north-lawn', label: 'North Lawn' },
];

// Act IV — Axiom Institute Facility (subdistricts: data-wing, mission-wing, research-wing)
interface AxiomBuilding extends Building { subdistrict?: 'data-wing' | 'mission-wing' | 'research-wing' }
const cliffsideBuildings: AxiomBuilding[] = [
  { id: 'observatory', name: 'Cliffside Observatory', clientId: 'aria', x: 80, y: 110, width: 110, height: 142, color: '#e8e8f0', roofColor: '#5a5a8a', roofType: 'pointed', description: "Dr. Sen's observatory", windowCount: 4, doorColor: '#2a2a4a', signText: 'OBSERVATORY', subdistrict: 'research-wing' },
  { id: 'launchpad', name: 'Launchpad Control', clientId: 'launch', x: 230, y: 140, width: 130, height: 112, color: '#1a1a2a', roofColor: '#000', roofType: 'flat', description: 'Mission control', windowCount: 10, doorColor: '#ff5533', signText: 'MISSION CTRL', subdistrict: 'mission-wing' },
  { id: 'dataviz-lab', name: 'Data Viz Lab', clientId: 'dataviz', x: 400, y: 130, width: 120, height: 122, color: '#0a1a2a', roofColor: '#000', roofType: 'flat', description: 'Analytics & dashboards', windowCount: 14, doorColor: '#33aaff', signText: 'DATAVIZ', subdistrict: 'data-wing' },
  { id: 'researchwing', name: 'Research Wing', x: 560, y: 145, width: 130, height: 107, color: '#d8d8e0', roofColor: '#4a4a6a', roofType: 'flat', description: 'Cliffside labs', windowCount: 12, doorColor: '#3a3a5a', signText: 'LABS', subdistrict: 'research-wing' },
  { id: 'cliff-lighthouse', name: 'Cliff Beacon', x: 730, y: 80, width: 36, height: 172, color: '#f0f0f0', roofColor: '#cc3333', roofType: 'pointed', description: 'Storm watch', windowCount: 3, doorColor: '#888', subdistrict: 'mission-wing' },
];

const axiomSubdistricts = [
  { id: 'all', label: 'All Wings' },
  { id: 'data-wing', label: 'Data Wing' },
  { id: 'mission-wing', label: 'Mission Wing' },
  { id: 'research-wing', label: 'Research Wing' },
];

// Final Act — Seabrook Meridian District (subdistricts: civic-core, public-services, media-row)
interface MeridianBuilding extends Building { subdistrict?: 'civic-core' | 'public-services' | 'media-row' }
const townPortalBuildings: MeridianBuilding[] = [
  { id: 'townhall', name: 'Seabrook Town Hall', clientId: 'civic', x: 200, y: 95, width: 200, height: 157, color: '#f0e8d8', roofColor: '#8a6a4a', roofType: 'gable', description: 'Civic seat — Meridian District', windowCount: 14, doorColor: '#5a3a2a', signText: 'TOWN HALL', hasAwning: true, awningColor: '#c89860', subdistrict: 'civic-core' },
  { id: 'plaza-fountain', name: 'Civic Plaza', x: 470, y: 170, width: 90, height: 82, color: '#e8e8e0', roofColor: '#aaaaaa', roofType: 'flat', description: 'Public plaza & fountain', windowCount: 0, doorColor: '#888', subdistrict: 'civic-core' },
  { id: 'archive', name: 'Town Archive', x: 600, y: 140, width: 100, height: 112, color: '#d4c8b0', roofColor: '#6a5a3a', roofType: 'flat', description: 'Historical records', windowCount: 7, doorColor: '#4a3a2a', signText: 'ARCHIVE', subdistrict: 'public-services' },
  { id: 'broadcast', name: 'Seabrook Broadcast', x: 730, y: 110, width: 90, height: 142, color: '#d8d4cc', roofColor: '#5a5a5a', roofType: 'flat', description: 'Civic radio & news', windowCount: 9, doorColor: '#3a3a3a', signText: 'BROADCAST', subdistrict: 'media-row' },
];

const meridianSubdistricts = [
  { id: 'all', label: 'All Districts' },
  { id: 'civic-core', label: 'Civic Core' },
  { id: 'public-services', label: 'Public Services' },
  { id: 'media-row', label: 'Media Row' },
];

const ZONE_SUBDISTRICTS: Record<string, { id: string; label: string }[]> = {
  'cedar-heights': cedarSubdistricts,
  'axiom-institute': axiomSubdistricts,
  'meridian-district': meridianSubdistricts,
};

const ZONES: Record<string, { label: string; buildings: Building[] }> = {
  'harbor-row': { label: 'Harbor Row', buildings: harborRowBuildings },
  'seabrook-promenade': { label: 'Seabrook Promenade', buildings: seabrookBuildings },
  'cedar-heights': { label: 'Cedar Heights Campus', buildings: cedarHeightsBuildings },
  'axiom-institute': { label: 'Axiom Institute', buildings: cliffsideBuildings },
  'meridian-district': { label: 'Meridian District', buildings: townPortalBuildings },
};

const ZONE_UNLOCK_THRESHOLDS: Record<string, number> = {
  'harbor-row': 0,
  'seabrook-promenade': 10,
  'cedar-heights': 16,
  'axiom-institute': 24,
  'meridian-district': 32,
};

interface TreeProps { x: number; y: number; size: number; type: 'round' | 'pine' | 'bush' }
const trees: TreeProps[] = [
  { x: 30, y: 0, size: 1, type: 'round' },
  { x: 125, y: 0, size: 0.7, type: 'bush' },
  { x: 235, y: 0, size: 0.9, type: 'round' },
  { x: 335, y: 0, size: 0.6, type: 'bush' },
  { x: 440, y: 0, size: 1.1, type: 'pine' },
  { x: 520, y: 0, size: 0.7, type: 'bush' },
  { x: 590, y: 0, size: 0.8, type: 'round' },
  { x: 690, y: 0, size: 0.6, type: 'bush' },
  { x: 770, y: 0, size: 1, type: 'pine' },
  { x: 840, y: 0, size: 0.7, type: 'round' },
];

const Tree: React.FC<TreeProps & { season: string }> = ({ x, y, size, type, season }) => {
  const s = size * 18;
  const leafColor = season === 'autumn' ? '#c47a3a' : season === 'winter' ? '#7a8a7a' : season === 'spring' ? '#6ab04c' : '#4a8a3a';
  const leafColor2 = season === 'autumn' ? '#a85a2a' : season === 'winter' ? '#6a7a6a' : season === 'spring' ? '#7ac85c' : '#5a9a4a';
  
  if (type === 'bush') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <ellipse cx="0" cy={-s * 0.3} rx={s * 0.6} ry={s * 0.4} fill={leafColor} opacity="0.85" />
        <ellipse cx={-s * 0.3} cy={-s * 0.2} rx={s * 0.4} ry={s * 0.3} fill={leafColor2} opacity="0.7" />
      </g>
    );
  }
  if (type === 'pine') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect x="-2" y={-s * 0.3} width="4" height={s * 0.3} fill="#6b5b3e" />
        <polygon points={`0,${-s * 1.4} ${-s * 0.5},${-s * 0.3} ${s * 0.5},${-s * 0.3}`} fill={season === 'winter' ? '#4a6a5a' : '#3a6a3a'} />
        <polygon points={`0,${-s * 1.6} ${-s * 0.35},${-s * 0.8} ${s * 0.35},${-s * 0.8}`} fill={season === 'winter' ? '#5a7a6a' : '#4a7a4a'} />
        {season === 'winter' && <polygon points={`0,${-s * 1.65} ${-s * 0.3},${-s * 0.9} ${s * 0.3},${-s * 0.9}`} fill="white" opacity="0.3" />}
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-2.5" y={-s * 0.35} width="5" height={s * 0.35} fill="#7a6845" />
      <circle cx="0" cy={-s * 0.7} r={s * 0.45} fill={leafColor2} />
      <circle cx={-s * 0.2} cy={-s * 0.8} r={s * 0.3} fill={leafColor} opacity="0.8" />
      {season === 'winter' && <circle cx={s * 0.1} cy={-s * 0.9} r={s * 0.2} fill="white" opacity="0.25" />}
    </g>
  );
};

// Weather particles
const WeatherParticles: React.FC<{ weather: string; width: number; height: number }> = ({ weather, width, height }) => {
  if (weather === 'rain') {
    return (
      <g opacity="0.4">
        {[...Array(40)].map((_, i) => {
          const x = (i * 47 + 13) % width;
          const y = (i * 31 + 7) % height;
          return <line key={i} x1={x} y1={y} x2={x - 2} y2={y + 8} stroke="#6a9ab8" strokeWidth="0.5" opacity={0.3 + (i % 3) * 0.2}>
            <animate attributeName="y1" values={`${y};${y + height}`} dur={`${0.5 + (i % 5) * 0.1}s`} repeatCount="indefinite" />
            <animate attributeName="y2" values={`${y + 8};${y + height + 8}`} dur={`${0.5 + (i % 5) * 0.1}s`} repeatCount="indefinite" />
          </line>;
        })}
      </g>
    );
  }
  if (weather === 'snow') {
    return (
      <g opacity="0.6">
        {[...Array(25)].map((_, i) => {
          const x = (i * 67 + 23) % width;
          const y = (i * 41 + 11) % height;
          return <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.5} fill="white" opacity={0.4 + (i % 3) * 0.2}>
            <animate attributeName="cy" values={`${y};${y + height}`} dur={`${2 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="cx" values={`${x};${x + 10};${x}`} dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>;
        })}
      </g>
    );
  }
  return null;
};

const TownMapApp: React.FC = () => {
  const townBuildings = useGameStore(s => s.townBuildings);
  const completedLevels = useGameStore(s => s.completedLevels);
  const openApp = useGameStore(s => s.openApp);
  const mapControlsShown = useGameStore(s => s.mapControlsShown);
  const markMapControlsUsed = useGameStore(s => s.markMapControlsUsed);
  const gameTime = useGameStore(s => s.gameTime);
  const currentZone = useGameStore(s => s.currentZone);
  const setCurrentZone = useGameStore(s => s.setCurrentZone);
  const subdistrict = useGameStore(s => s.currentSubdistrict);
  const setSubdistrict = useGameStore(s => s.setSubdistrict);
  const allBuildings = (ZONES[currentZone] || ZONES['harbor-row']).buildings;
  const subdistricts = ZONE_SUBDISTRICTS[currentZone];
  const buildings = subdistricts && subdistrict !== 'all'
    ? allBuildings.filter(b => (b as any).subdistrict === subdistrict)
    : allBuildings;
  const studioItems = useGameStore(s => s.studioItems);
  const setStudioWall = useGameStore(s => s.setStudioWall);
  const acceptProject = useGameStore(s => s.acceptProject);
  const startEditing = useGameStore(s => s.startEditing);
  const activeProjects = useGameStore(s => s.activeProjects);
  const completedCount = completedLevels.length;
  const zonesUnlocked: Record<string, boolean> = Object.fromEntries(
    Object.entries(ZONE_UNLOCK_THRESHOLDS).map(([id, n]) => [id, completedCount >= n])
  );
  const [hoveredBuilding, setHoveredBuilding] = React.useState<string | null>(null);
  const [cameraX, setCameraX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const animFrame = React.useRef<number>(0);
  const targetX = React.useRef(0);
  const currentX = React.useRef(0);
  const keysPressed = React.useRef<Set<string>>(new Set());

  const mapWidth = 960;
  const viewWidth = 760;
  const maxScroll = -(mapWidth - viewWidth);

  const hour = gameTime?.hour ?? 10;
  const season = gameTime?.season ?? 'summer';
  const weather = gameTime?.weather ?? 'clear';
  const skyColors = getSkyColors(hour, season, weather);
  const period = getTimePeriod(hour);
  const isNight = period === 'night';
  const isDark = isNight || period === 'dusk';
  const skyGradient = `linear-gradient(180deg, ${skyColors.sky[0]} 0%, ${skyColors.sky[1]} 50%, ${skyColors.sky[2]} 100%)`;

  React.useEffect(() => {
    const tick = () => {
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) targetX.current = Math.min(0, targetX.current + 3);
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) targetX.current = Math.max(maxScroll, targetX.current - 3);
      currentX.current += (targetX.current - currentX.current) * 0.12;
      setCameraX(currentX.current);
      animFrame.current = requestAnimationFrame(tick);
    };
    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, [maxScroll]);

  React.useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'Tab'].includes(e.key)) {
        if (showControls) { setShowControls(false); markMapControlsUsed(); }
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const ib = buildings.filter(b => b.clientId);
        const idx = ib.findIndex(b => b.id === hoveredBuilding);
        const next = ib[(idx + 1) % ib.length];
        setHoveredBuilding(next.id);
        targetX.current = Math.max(maxScroll, Math.min(0, -(next.x - viewWidth / 2 + next.width / 2)));
      }
    };
    const onUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, [hoveredBuilding, showControls, maxScroll, markMapControlsUsed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX - currentX.current);
    if (showControls) { setShowControls(false); markMapControlsUsed(); }
  };

  React.useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => { targetX.current = Math.max(maxScroll, Math.min(0, e.clientX - dragStart)); };
    const handleUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => { document.removeEventListener('mousemove', handleMove); document.removeEventListener('mouseup', handleUp); };
  }, [isDragging, dragStart, maxScroll]);

  const handleWheel = (e: React.WheelEvent) => {
    targetX.current = Math.max(maxScroll, Math.min(0, targetX.current - e.deltaY * 0.5));
    if (showControls) { setShowControls(false); markMapControlsUsed(); }
  };

  const getClientProgress = (clientId: string) => completedLevels.filter(l => l.startsWith(clientId)).length;

  const svgH = 320;
  const groundY = 252;
  const waterY = 280;

  return (
    <div className="h-full overflow-hidden cursor-grab active:cursor-grabbing relative" onMouseDown={handleMouseDown} onWheel={handleWheel} style={{ background: skyGradient }}>
      <div className="absolute inset-0" style={{ transform: `translateX(${cameraX}px)`, width: mapWidth }}>
        <svg width={mapWidth} height="100%" viewBox={`0 0 ${mapWidth} ${svgH}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="softShadow"><feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.15" /></filter>
            <filter id="sunGlow"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>

          {/* Stars */}
          {skyColors.starOpacity > 0.05 && [...Array(30)].map((_, i) => (
            <circle key={`star-${i}`} cx={(i * 83 + 17) % mapWidth} cy={(i * 47 + 5) % 80 + 5} r={0.5 + (i % 3) * 0.3} fill="white" opacity={skyColors.starOpacity * (0.5 + (i % 4) * 0.15)} />
          ))}

          {/* Sun/Moon */}
          <circle cx={680 - cameraX * 0.02} cy={skyColors.sunY} r={isNight ? 10 : 16} fill={skyColors.sun} opacity={0.7} />

          {/* Mountains parallax */}
          <g transform={`translate(${-cameraX * 0.15}, 0)`} opacity={0.15 * skyColors.ambientLight + 0.05}>
            <path d="M-50,180 L30,100 L80,130 L140,85 L220,120 L280,75 L360,110 L430,70 L520,105 L590,80 L670,100 L750,65 L830,95 L960,180 Z" fill={isDark ? '#1a2a3a' : '#8aa8c0'} />
          </g>

          {/* Hills parallax */}
          <g transform={`translate(${-cameraX * 0.08}, 0)`} opacity={0.12 * skyColors.ambientLight + 0.03}>
            <path d="M-50,200 L50,160 L150,180 L250,150 L350,175 L450,145 L550,170 L650,155 L750,180 L960,200 Z" fill={isDark ? '#2a3a4a' : '#7a9ab0'} />
          </g>

          {/* Clouds */}
          {weather !== 'clear' && (
            <g transform={`translate(${-cameraX * 0.05}, 0)`} opacity={weather === 'rain' ? 0.4 : weather === 'cloudy' ? 0.35 : 0.2}>
              <ellipse cx="120" cy="35" rx="60" ry="16" fill={isDark ? '#3a3a4a' : '#ccc'} />
              <ellipse cx="90" cy="28" rx="30" ry="12" fill={isDark ? '#3a3a4a' : '#ddd'} />
              <ellipse cx="450" cy="28" rx="50" ry="14" fill={isDark ? '#3a3a4a' : '#ccc'} />
              <ellipse cx="750" cy="40" rx="45" ry="12" fill={isDark ? '#3a3a4a' : '#ddd'} />
            </g>
          )}
          {weather === 'clear' && (
            <g transform={`translate(${-cameraX * 0.05}, 0)`} opacity={isDark ? 0.06 : 0.15}>
              <ellipse cx="80" cy="40" rx="50" ry="14" fill="white" />
              <ellipse cx="55" cy="34" rx="25" ry="11" fill="white" />
            </g>
          )}

          {/* Birds (not at night or bad weather) */}
          {!isDark && weather === 'clear' && (
            <g transform={`translate(${-cameraX * 0.04}, 0)`} opacity="0.2">
              <path d="M200,55 Q208,48 216,55 Q224,48 232,55" stroke="#555" fill="none" strokeWidth="1" />
              <path d="M600,60 Q607,52 614,60 Q621,52 628,60" stroke="#555" fill="none" strokeWidth="1" />
            </g>
          )}

          {/* Road */}
          <rect x="0" y={groundY - 14} width={mapWidth} height="18" fill={isDark ? '#3a3830' : '#8a8578'} />
          <line x1="0" y1={groundY - 5} x2={mapWidth} y2={groundY - 5} stroke={isDark ? '#4a4840' : '#b8ad9c'} strokeWidth="0.5" strokeDasharray="8 6" />
          <rect x="0" y={groundY - 14} width={mapWidth} height="5" fill={isDark ? '#4a4538' : '#d0c0a0'} />

          {/* Snow on ground */}
          {season === 'winter' && weather === 'snow' && (
            <rect x="0" y={groundY - 16} width={mapWidth} height="3" fill="white" opacity="0.4" rx="1" />
          )}

          {/* Trees */}
          {trees.map((t, i) => <Tree key={`tree-${i}`} {...t} y={groundY - 16} season={season} />)}

          {/* Zone-specific scenery */}
          {currentZone === 'seabrook-promenade' && (
            <g>
              {/* Boardwalk planks */}
              <rect x="0" y={groundY - 6} width={mapWidth} height="6" fill={isDark ? '#5a4530' : '#c89a6a'} />
              {[...Array(40)].map((_, i) => (
                <line key={i} x1={i * 24} y1={groundY - 6} x2={i * 24} y2={groundY} stroke={isDark ? '#3a2a1a' : '#8a6a4a'} strokeWidth="0.5" />
              ))}
              {/* Palm trees */}
              {[80, 240, 410, 560, 720, 880].map((px, i) => (
                <g key={`palm-${i}`} transform={`translate(${px}, ${groundY - 16})`}>
                  <rect x="-2" y="-40" width="4" height="40" fill="#6b5b3e" />
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <ellipse key={deg} cx="0" cy="-40" rx="14" ry="3"
                      fill={season === 'winter' ? '#5a7a5a' : '#3a8a4a'}
                      opacity="0.85"
                      transform={`rotate(${deg - 90} 0 -40)`} />
                  ))}
                </g>
              ))}
              {/* Beach umbrellas */}
              {[160, 380, 620].map((ux, i) => (
                <g key={`umb-${i}`} transform={`translate(${ux}, ${groundY - 8})`}>
                  <rect x="-0.5" y="-18" width="1" height="18" fill="#666" />
                  <path d="M-12,-18 Q0,-26 12,-18 Z" fill={['#e74c3c', '#3498db', '#f39c12'][i % 3]} opacity="0.9" />
                </g>
              ))}
              {/* Seagulls */}
              {!isDark && weather === 'clear' && [...Array(5)].map((_, i) => (
                <path key={`gull-${i}`} d={`M${100 + i * 180},${70 + (i % 2) * 25} q5,-4 10,0 q5,-4 10,0`}
                  stroke="white" fill="none" strokeWidth="1.2" opacity="0.7" />
              ))}
            </g>
          )}
          {currentZone === 'cedar-heights' && (
            <g>
              {/* City skyline silhouette behind buildings */}
              <g opacity="0.25">
                <rect x="0" y={groundY - 100} width="40" height="100" fill={isDark ? '#0a0a14' : '#5a6a7a'} />
                <rect x="50" y={groundY - 130} width="35" height="130" fill={isDark ? '#0a0a14' : '#5a6a7a'} />
                <rect x="200" y={groundY - 110} width="30" height="110" fill={isDark ? '#0a0a14' : '#5a6a7a'} />
                <rect x="400" y={groundY - 140} width="40" height="140" fill={isDark ? '#0a0a14' : '#5a6a7a'} />
                <rect x="600" y={groundY - 105} width="35" height="105" fill={isDark ? '#0a0a14' : '#5a6a7a'} />
                <rect x="900" y={groundY - 125} width="38" height="125" fill={isDark ? '#0a0a14' : '#5a6a7a'} />
              </g>
              {/* Skybridge connecting two of the towers */}
              <rect x="345" y={groundY - 130} width="60" height="6" fill={isDark ? '#2a2a3a' : '#8a90a0'} />
              <line x1="345" y1={groundY - 124} x2="405" y2={groundY - 124} stroke={isDark ? '#5af' : '#3a4a5a'} strokeWidth="0.4" opacity="0.6" />
              {/* Neon signage glow on Kindle.dev */}
              {isDark && (
                <g opacity="0.5">
                  <rect x="280" y={groundY - 200} width="80" height="6" fill="#5af" rx="1">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
                  </rect>
                </g>
              )}
              {/* Power lines */}
              {[...Array(6)].map((_, i) => (
                <line key={i} x1={i * 180} y1={groundY - 80} x2={i * 180 + 180} y2={groundY - 80}
                  stroke={isDark ? '#222' : '#555'} strokeWidth="0.4" opacity="0.5" />
              ))}
              {/* Light rail */}
              <rect x="0" y={groundY - 11} width={mapWidth} height="2" fill={isDark ? '#2a2a3a' : '#888'} />
              <rect x="0" y={groundY - 8} width={mapWidth} height="2" fill={isDark ? '#2a2a3a' : '#888'} />
            </g>
          )}

          {/* Street lamps */}
          {[110, 310, 500, 680, 830].map((lx, i) => (
            <g key={`lamp-${i}`}>
              <rect x={lx - 1.5} y={groundY - 50} width="3" height="36" fill="#555" rx="1" />
              <rect x={lx - 6} y={groundY - 52} width="12" height="4" fill="#666" rx="2" />
              <ellipse cx={lx} cy={groundY - 52} rx="4" ry="2" fill={isDark ? '#FFE088' : '#aaa'} opacity={isDark ? 0.9 : 0.3} />
              {isDark && <ellipse cx={lx} cy={groundY - 20} rx="20" ry="25" fill="#FFE088" opacity="0.04" />}
            </g>
          ))}

          {/* Buildings */}
          {buildings.map(b => {
            const state = townBuildings[b.id] || { completed: false, glowing: false };
            const isHovered = hoveredBuilding === b.id;
            const progress = b.clientId ? getClientProgress(b.clientId) : 0;
            const isLighthouse = b.id === 'lighthouse';
            const bodyH = isLighthouse ? b.height * 0.85 : b.height * 0.72;
            const roofH = isLighthouse ? b.height * 0.15 : b.height * 0.28;
            const bodyY = groundY - 14 - bodyH;
            const litWindows = state.completed ? b.windowCount : Math.min(progress, b.windowCount);

            const handleJump = () => {
              if (b.id === 'studio') { openApp('studioRoom'); return; }
              if (b.clientId) {
                // Find next incomplete level for this client
                const clientLevels = allLevels.filter(l => l.clientId === b.clientId);
                const next = clientLevels.find(l => !completedLevels.includes(l.id));
                if (next) {
                  const hasActive = activeProjects.find(p => p.levelId === next.id);
                  if (!hasActive) acceptProject(next.id);
                  startEditing(next.id);
                } else {
                  openApp('projectBoard');
                }
                // Jump studio room to wall with the most recent pinned canvas (if any)
                const pinned = studioItems.filter(i => i.type === 'canvas');
                if (pinned.length > 0) {
                  setStudioWall(pinned[pinned.length - 1].wall);
                }
              } else {
                openApp('projectBoard');
              }
            };
            return (
              <g key={b.id} className="cursor-pointer" style={{ transition: 'transform 0.3s ease' }}
                transform={isHovered ? 'translate(0, -3)' : ''}
                onMouseEnter={() => setHoveredBuilding(b.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
                onClick={handleJump}
                filter="url(#softShadow)">

                <rect x={b.x} y={bodyY} width={b.width} height={bodyH} fill={b.color} rx="2"
                  stroke={isHovered ? 'rgba(200,170,100,0.5)' : 'rgba(0,0,0,0.06)'} strokeWidth={isHovered ? 1.5 : 0.5} />

                {b.roofType === 'gable' ? (
                  <polygon points={`${b.x - 3},${bodyY} ${b.x + b.width / 2},${bodyY - roofH} ${b.x + b.width + 3},${bodyY}`} fill={b.roofColor} />
                ) : b.roofType === 'pointed' ? (
                  <polygon points={`${b.x - 2},${bodyY} ${b.x + b.width / 2},${bodyY - roofH - 10} ${b.x + b.width + 2},${bodyY}`} fill={b.roofColor} />
                ) : (
                  <rect x={b.x - 3} y={bodyY - 4} width={b.width + 6} height={6} fill={b.roofColor} rx="1" />
                )}

                {!isLighthouse && (() => {
                  const wSize = 7;
                  const gap = 4;
                  const perRow = Math.min(b.windowCount, Math.floor((b.width - 10) / (wSize + gap)));
                  return [...Array(b.windowCount)].map((_, i) => {
                    const col = i % perRow;
                    const row = Math.floor(i / perRow);
                    const startX = b.x + (b.width - perRow * (wSize + gap) + gap) / 2;
                    const wx = startX + col * (wSize + gap);
                    const wy = bodyY + 10 + row * (wSize + gap + 2);
                    const isLit = i < litWindows || isDark;
                    return <rect key={i} x={wx} y={wy} width={wSize} height={wSize + 2} rx="1"
                      fill={isLit ? (isDark ? 'rgba(255,220,100,0.6)' : 'rgba(255,220,100,0.35)') : 'rgba(100,140,180,0.15)'}
                      stroke="rgba(0,0,0,0.08)" strokeWidth="0.3" />;
                  });
                })()}

                {isLighthouse && (
                  <>
                    <circle cx={b.x + b.width / 2} cy={bodyY + 10} r={5} fill="#FFD700" opacity={state.completed || isDark ? 0.9 : 0.2} />
                    {[0.25, 0.5, 0.75].map((p, i) => (
                      <rect key={i} x={b.x} y={bodyY + bodyH * p} width={b.width} height={3} fill={i % 2 === 0 ? '#cc3333' : 'transparent'} opacity="0.4" />
                    ))}
                  </>
                )}

                {b.hasAwning && (
                  <path d={`M${b.x - 3},${bodyY + bodyH - 2} Q${b.x + b.width / 2},${bodyY + bodyH + 4} ${b.x + b.width + 3},${bodyY + bodyH - 2}`} fill={b.awningColor} opacity="0.9" />
                )}

                {!isLighthouse && (
                  <rect x={b.x + b.width / 2 - 5} y={groundY - 14 - 14} width={10} height={14} fill={b.doorColor} rx="1" />
                )}

                {b.signText && (
                  <g>
                    <rect x={b.x + b.width / 2 - b.signText.length * 2.2} y={bodyY + bodyH * 0.42} width={b.signText.length * 4.4} height={9} fill="rgba(255,255,255,0.85)" rx="1.5" />
                    <text x={b.x + b.width / 2} y={bodyY + bodyH * 0.42 + 7} textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#555" fontFamily="Inter, sans-serif" letterSpacing="0.3">{b.signText}</text>
                  </g>
                )}

                {state.glowing && (
                  <rect x={b.x - 2} y={bodyY - 2} width={b.width + 4} height={bodyH + 4} fill="none" stroke="hsl(40,80%,55%)" strokeWidth="1" opacity="0.3" rx="3">
                    <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
                  </rect>
                )}
              </g>
            );
          })}

          {/* Water */}
          <rect x="0" y={waterY} width={mapWidth} height={svgH - waterY} fill={isDark ? '#1a3050' : '#4a7a94'} />
          <path d={`M0,${waterY + 5} Q40,${waterY + 2} 80,${waterY + 5} T160,${waterY + 5} T240,${waterY + 5} T320,${waterY + 5} T400,${waterY + 5} T480,${waterY + 5} T560,${waterY + 5} T640,${waterY + 5} T720,${waterY + 5} T${mapWidth},${waterY + 5}`}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="wave-animation" />
          <rect x="0" y={waterY - 3} width={mapWidth} height="4" fill={isDark ? '#2a4a5a' : '#5A7A94'} opacity="0.3" />

          {/* Dock & Boat */}
          <rect x="730" y={waterY - 3} width="50" height="5" fill="#9b8365" rx="1" />
          <rect x="735" y={waterY} width="3" height="18" fill="#6b5b3e" />
          <rect x="772" y={waterY} width="3" height="18" fill="#6b5b3e" />

          <g className="wave-animation" style={{ animationDelay: '-1s' }}>
            <path d={`M650,${waterY + 8} Q665,${waterY + 14} 680,${waterY + 8} L675,${waterY + 3} H655 Z`} fill="#8b7355" />
            <line x1="665" y1={waterY + 3} x2="665" y2={waterY - 6} stroke="#6b5b3e" strokeWidth="1" />
            <polygon points={`665,${waterY - 6} 678,${waterY + 3} 665,${waterY}`} fill="white" opacity="0.75" />
          </g>

          {/* Weather particles */}
          <WeatherParticles weather={weather} width={mapWidth} height={svgH} />
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredBuilding && (() => {
        const b = buildings.find(bi => bi.id === hoveredBuilding);
        if (!b) return null;
        const progress = b.clientId ? getClientProgress(b.clientId) : 0;
        const state = townBuildings[b.id] || { completed: false, glowing: false };
        return (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 harbor-glass rounded-lg px-4 py-2 shadow-lg border border-border/50 animate-in fade-in duration-100" style={{ pointerEvents: 'none' }}>
            <p className="text-xs font-semibold text-foreground">{b.name}</p>
            <p className="text-[10px] text-muted-foreground">{b.description}</p>
            {b.clientId && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < progress ? 'bg-[hsl(var(--harbor-gold))]' : 'bg-muted'}`} />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground ml-1">
                  {state.completed ? 'Complete ✓' : `${progress}/4 projects`}
                </span>
              </div>
            )}
          </div>
        );
      })()}

      {showControls && mapControlsShown && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4 pointer-events-none animate-pulse">
          <div className="bg-foreground/10 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-foreground/30 font-mono">← A/D →</div>
          <div className="bg-foreground/10 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-foreground/30 font-mono">Scroll or Drag</div>
        </div>
      )}

      <div className="absolute bottom-2 left-3 flex items-center gap-2">
        <span className="text-[10px] text-foreground/20 font-mono">
          {(ZONES[currentZone] || ZONES['harbor-row']).label} · {season.charAt(0).toUpperCase() + season.slice(1)} · {weather !== 'clear' ? weather.charAt(0).toUpperCase() + weather.slice(1) + ' · ' : ''}{period}
        </span>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 z-30">
        {Object.entries(ZONES).map(([id, z]) => {
          const unlocked = zonesUnlocked[id];
          const active = id === currentZone;
          return (
            <button key={id}
              disabled={!unlocked}
              onClick={() => { setCurrentZone(id); setSubdistrict('all'); targetX.current = 0; currentX.current = 0; setCameraX(0); }}
              className={`text-[10px] px-2 py-1 rounded-md font-medium transition-all ${
                active ? 'bg-foreground text-background' :
                unlocked ? 'harbor-glass text-foreground hover:bg-foreground/10' :
                'bg-foreground/5 text-foreground/30 cursor-not-allowed'
              }`}
              title={unlocked ? z.label : `Unlocks at ${ZONE_UNLOCK_THRESHOLDS[id]} projects`}>
              {unlocked ? z.label : '🔒 ' + z.label}
            </button>
          );
        })}
      </div>
      {subdistricts && (
        <div key={currentZone} className="absolute top-10 right-2 flex gap-1 z-30 animate-in fade-in duration-300">
          {subdistricts.map(sd => {
            const sdBuildings = sd.id === 'all' ? allBuildings : allBuildings.filter(b => (b as any).subdistrict === sd.id);
            const center = sdBuildings.length ? sdBuildings.reduce((a, b) => a + b.x + b.width / 2, 0) / sdBuildings.length : 0;
            return (
              <button key={sd.id}
                onClick={() => {
                  setSubdistrict(sd.id);
                  if (sd.id !== 'all' && center) {
                    targetX.current = Math.max(maxScroll, Math.min(0, -(center - viewWidth / 2)));
                  }
                }}
                className={`text-[9px] px-2 py-0.5 rounded-md font-medium transition-all ${subdistrict === sd.id ? 'bg-foreground/80 text-background' : 'harbor-glass text-foreground/70 hover:bg-foreground/10'}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" style={{ background: sd.id === 'all' ? 'transparent' : 'hsl(40,80%,55%)' }} />
                {sd.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TownMapApp;
