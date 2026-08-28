// ============ CORE GAME TYPES ============

export type AppId = 'mail' | 'editor' | 'projectBoard' | 'townMap' | 'chat' | 'browser' | 'files' | 'forum' | 'canvas' | 'settings' | 'music' | 'miniGame' | 'impact' | 'studioRoom';

export type ProjectStatus = 'new' | 'in_progress' | 'needs_revision' | 'completed';

export type SatisfactionTier = 'needs_revision' | 'acceptable' | 'great_work' | 'outstanding';

export type StyleTag = 'structured' | 'creative' | 'chaotic' | 'minimalist';

export type EditorLevel = 1 | 2 | 3 | 4;

export type ThemeMode = 'light' | 'dark' | 'neon' | 'nightshift' | 'frost';

export type CursorEffect = 'none' | 'neon' | 'ghost' | 'stars' | 'cyber';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type Weather = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog';

export type TimePeriod = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'dusk' | 'night';

export interface ClientProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality: string;
  valuesmost: ('precision' | 'creativity' | 'professionalism')[];
  communicationStyle: 'email' | 'chat';
}

export interface ProjectRequirement {
  id: string;
  description: string;
  type: 'required' | 'bonus';
  check: (html: string) => boolean;
}

export interface ProjectLevel {
  id: string;
  clientId: string;
  title: string;
  zone?: string; // 'harbor-row' | 'seabrook-promenade' | 'cedar-heights' etc.
  briefSubject: string;
  briefBody: string;
  requirements: ProjectRequirement[];
  templateCode: string;
  concepts: string[];
  unlocks?: string[];
  feedbackHigh: string;
  feedbackMid: string;
  feedbackLow: string;
  assets?: { name: string; content: string }[];
}

export interface ProjectScore {
  precision: number;
  creativity: number;
  professionalism: number;
  tier: SatisfactionTier;
}

export interface ProjectState {
  levelId: string;
  status: ProjectStatus;
  code: string;
  score?: ProjectScore;
  feedbackMessage?: string;
  attempts: number;
  hintsUsed: number;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  read: boolean;
  levelId: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  from: string;
  avatar: string;
  message: string;
  timestamp: string;
  isPlayer?: boolean;
  isCall?: boolean;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { w: number; h: number };
}

export interface VirtualFile {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: VirtualFile[];
  hidden?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  body: string;
  reward?: string;
  type: 'gig' | 'discussion' | 'weird' | 'community';
  accepted?: boolean;
  zone?: string;
}

export interface OverrideCode {
  command: string;
  description: string;
  unlocked: boolean;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'widget';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: Record<string, string>;
  zIndex: number;
}

export interface StudioItem {
  id: string;
  name: string;
  type: 'poster' | 'plant' | 'decoration' | 'light' | 'shelf' | 'canvas';
  x: number;
  y: number;
  wall: 'front' | 'left' | 'right' | 'back';
  unlocked: boolean;
  emoji: string;
  // Optional rendered preview (HTML/CSS/JS) for canvas creations
  preview?: { html: string; css: string; js: string };
  width?: number;
  height?: number;
}

export interface CustomTrack {
  id: string;
  title: string;
  artist: string;
  category: 'lo-fi' | 'ambient' | 'classical' | 'chill-electronic' | 'minimal-piano';
  src: string; // object URL or asset path
  custom: true;
}

export interface GameTime {
  hour: number; // 0-23
  minute: number;
  dayCount: number;
  season: Season;
  weather: Weather;
}

export interface AudioState {
  masterVolume: number;
  ambientEnabled: boolean;
  sfxEnabled: boolean;
  typingEnabled: boolean;
  musicEnabled: boolean;
}

export interface GameState {
  // Progression
  currentZone: string;
  completedLevels: string[];
  activeProjects: ProjectState[];

  // Communication
  emails: Email[];
  chatMessages: Record<string, ChatMessage[]>;

  // Harbor OS
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  dockBadges: Record<string, number>;

  // Town
  townBuildings: Record<string, { completed: boolean; glowing: boolean }>;

  // Player stats
  totalPrecision: number;
  totalCreativity: number;
  totalProfessionalism: number;
  projectsCompleted: number;
  styleProfile: StyleTag[];

  // Editor state
  currentEditingLevel: string | null;
  editorCode: string;
  editorLevel: EditorLevel;

  // File system
  fileSystem: VirtualFile[];
  downloads: VirtualFile[];

  // Studio Canvas
  studioCanvasDiscovered: boolean;
  canvasElements: CanvasElement[];

  // Studio Room
  studioItems: StudioItem[];

  // Override codes
  overrideCodes: Record<string, boolean>;
  consoleHistory: string[];
  consoleVisible: boolean;

  // Forum
  forumPosts: ForumPost[];

  // Hints
  hintsEnabled: boolean;

  // Prologue
  prologueComplete: boolean;

  // Ghost UI
  mapControlsShown: boolean;

  // Unlocks
  unlockedApps: AppId[];
  unlockedWallpaper: string;

  // Theme & Display
  themeMode: ThemeMode;
  cursorEffect: CursorEffect;

  // Audio
  audio: AudioState;

  // Custom music
  customTracks: CustomTrack[];
  trackRenames: Record<string, string>; // trackId -> new title
  zoneMusic: Record<string, string[]>; // zoneId -> trackIds preferred

  // Time system
  gameTime: GameTime;

  // Menu state
  menuOpen: string | null;

  // Studio room
  currentStudioWall: 'front' | 'left' | 'right' | 'back';

  // Map sub-zone (e.g. cedar-heights subdistrict)
  currentSubdistrict: string;
}
