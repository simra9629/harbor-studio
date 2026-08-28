import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, AppId, WindowState, ProjectState, Email, ChatMessage, VirtualFile, EditorLevel, ThemeMode, CursorEffect, CanvasElement, GameTime, StudioItem, CustomTrack } from './types';
import { allLevels, getLevelById, getAvailableLevels } from './levels';
import { clients } from './clients';
import { evaluateSubmission, getFeedbackMessage } from './evaluation';
import { defaultForumPosts } from './forum-posts';
import { audioEngine } from './audio';
import { getSeasonFromDay, rollWeather } from './time-weather';

interface GameActions {
  completePrologue: () => void;
  openApp: (appId: AppId, extra?: Partial<WindowState>) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  generateInitialEmails: () => void;
  markEmailRead: (emailId: string) => void;
  acceptProject: (levelId: string) => void;
  startEditing: (levelId: string) => void;
  updateCode: (code: string) => void;
  submitProject: () => void;
  updateTownAfterCompletion: (levelId: string) => void;
  resetGame: () => void;
  addChatMessage: (clientId: string, msg: ChatMessage) => void;
  toggleConsole: () => void;
  addConsoleEntry: (entry: string) => void;
  clearConsole: () => void;
  applyOverride: (effect: string) => void;
  discoverStudioCanvas: () => void;
  markMapControlsUsed: () => void;
  setTheme: (theme: ThemeMode) => void;
  setCursorEffect: (effect: CursorEffect) => void;
  setMasterVolume: (v: number) => void;
  setAmbientEnabled: (e: boolean) => void;
  setSfxEnabled: (e: boolean) => void;
  addCanvasElement: (el: CanvasElement) => void;
  updateCanvasElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeCanvasElement: (id: string) => void;
  addStudioItem: (item: StudioItem) => void;
  updateStudioItem: (id: string, updates: Partial<StudioItem>) => void;
  removeStudioItem: (id: string) => void;
  pinCanvasToStudio: (name: string, wall: StudioItem['wall']) => void;
  advanceTime: (minutes: number) => void;
  setMenuOpen: (menu: string | null) => void;
  setCurrentZone: (zone: string) => void;
  addCustomTrack: (t: CustomTrack) => void;
  removeCustomTrack: (id: string) => void;
  renameTrack: (id: string, name: string) => void;
  assignTrackToZone: (zoneId: string, trackId: string) => void;
  unassignTrackFromZone: (zoneId: string, trackId: string) => void;
  setWeather: (w: GameTime['weather']) => void;
  setStudioWall: (w: 'front' | 'left' | 'right' | 'back') => void;
  setSubdistrict: (s: string) => void;
}

const defaultStudioItems: StudioItem[] = [
  { id: 'desk-lamp', name: 'Desk Lamp', type: 'light', x: 70, y: 60, wall: 'front', unlocked: true, emoji: '💡' },
  { id: 'plant-1', name: 'Small Plant', type: 'plant', x: 20, y: 80, wall: 'left', unlocked: true, emoji: '🪴' },
  { id: 'coffee-mug', name: 'Coffee Mug', type: 'decoration', x: 55, y: 65, wall: 'front', unlocked: true, emoji: '☕' },
];

const defaultState: GameState = {
  currentZone: 'harbor-row',
  completedLevels: [],
  activeProjects: [],
  emails: [],
  chatMessages: {},
  windows: [],
  activeWindowId: null,
  nextZIndex: 1,
  dockBadges: { mail: 0, editor: 0, projectBoard: 0, townMap: 0, chat: 0, browser: 0, files: 0, forum: 0, canvas: 0, settings: 0, music: 0, miniGame: 0, impact: 0, studioRoom: 0 },
  townBuildings: {
    bakery: { completed: false, glowing: false },
    bookstore: { completed: false, glowing: false },
    cafe: { completed: false, glowing: false },
    florist: { completed: false, glowing: false },
    fishmarket: { completed: false, glowing: false },
    chandlery: { completed: false, glowing: false },
    postoffice: { completed: false, glowing: false },
    harbor: { completed: false, glowing: false },
    lighthouse: { completed: false, glowing: false },
    studio: { completed: true, glowing: true },
    boutique: { completed: false, glowing: false },
    surfschool: { completed: false, glowing: false },
    gelato: { completed: false, glowing: false },
    arcade: { completed: false, glowing: false },
    hotel: { completed: false, glowing: false },
    gallery: { completed: false, glowing: false },
    architect: { completed: false, glowing: false },
    startup: { completed: false, glowing: false },
    matcha: { completed: false, glowing: false },
    gym: { completed: false, glowing: false },
    tower: { completed: false, glowing: false },
    transit: { completed: false, glowing: false },
    // Axiom Institute
    observatory: { completed: false, glowing: false },
    launchpad: { completed: false, glowing: false },
    'dataviz-lab': { completed: false, glowing: false },
    researchwing: { completed: false, glowing: false },
    'cliff-lighthouse': { completed: false, glowing: false },
    // Meridian District
    townhall: { completed: false, glowing: false },
    'plaza-fountain': { completed: false, glowing: false },
    archive: { completed: false, glowing: false },
    broadcast: { completed: false, glowing: false },
  },
  totalPrecision: 0,
  totalCreativity: 0,
  totalProfessionalism: 0,
  projectsCompleted: 0,
  styleProfile: [],
  currentEditingLevel: null,
  editorCode: '',
  editorLevel: 1,
  fileSystem: [],
  downloads: [],
  studioCanvasDiscovered: false,
  canvasElements: [],
  studioItems: defaultStudioItems,
  overrideCodes: {},
  consoleHistory: [],
  consoleVisible: false,
  forumPosts: defaultForumPosts,
  hintsEnabled: false,
  prologueComplete: false,
  mapControlsShown: true,
  unlockedApps: ['mail', 'editor', 'projectBoard', 'townMap'],
  unlockedWallpaper: 'default',
  themeMode: 'light',
  cursorEffect: 'none',
  audio: { masterVolume: 0.3, ambientEnabled: false, sfxEnabled: true, typingEnabled: true, musicEnabled: true },
  gameTime: { hour: 8, minute: 0, dayCount: 1, season: 'summer', weather: 'clear' },
  menuOpen: null,
  customTracks: [],
  trackRenames: {},
  zoneMusic: {},
  currentStudioWall: 'front',
  currentSubdistrict: 'all',
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...defaultState,

      completePrologue: () => {
        set({ prologueComplete: true });
        get().generateInitialEmails();
      },

      openApp: (appId, extra) => {
        const state = get();
        const existingWindow = state.windows.find(w => w.appId === appId && !extra);
        if (existingWindow) {
          set({
            windows: state.windows.map(w =>
              w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
            ),
            activeWindowId: existingWindow.id,
            nextZIndex: state.nextZIndex + 1,
          });
          return;
        }

        const titles: Record<AppId, string> = {
          mail: 'Harbor Mail',
          editor: 'Notepad+',
          projectBoard: 'Project Board',
          townMap: 'Harbor Row',
          chat: 'Messages',
          browser: 'Preview',
          files: 'Files',
          forum: 'Seabrook Board',
          canvas: 'Studio Canvas',
          settings: 'Settings',
          music: 'Music',
          miniGame: 'Mini-Games',
          impact: 'Town Impact',
          studioRoom: 'Your Studio',
        };

        const newWindow: WindowState = {
          id: `${appId}-${Date.now()}`,
          appId,
          title: extra?.title || titles[appId],
          isMinimized: false,
          isMaximized: false,
          zIndex: state.nextZIndex,
          position: { x: 40 + state.windows.length * 20, y: 30 + state.windows.length * 20 },
          size: { w: 800, h: 500 },
          ...extra,
        };

        audioEngine.playWindowOpen();
        set({
          windows: [...state.windows, newWindow],
          activeWindowId: newWindow.id,
          nextZIndex: state.nextZIndex + 1,
        });
      },

      closeWindow: (windowId) => {
        set(state => ({
          windows: state.windows.filter(w => w.id !== windowId),
          activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId,
        }));
      },

      focusWindow: (windowId) => {
        set(state => ({
          windows: state.windows.map(w =>
            w.id === windowId ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
          ),
          activeWindowId: windowId,
          nextZIndex: state.nextZIndex + 1,
        }));
      },

      minimizeWindow: (windowId) => {
        set(state => ({
          windows: state.windows.map(w =>
            w.id === windowId ? { ...w, isMinimized: true } : w
          ),
          activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId,
        }));
      },

      maximizeWindow: (windowId) => {
        set(state => ({
          windows: state.windows.map(w =>
            w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
          ),
        }));
      },

      generateInitialEmails: () => {
        const state = get();
        const available = getAvailableLevels(state.completedLevels);
        const existingLevelIds = state.emails.map(e => e.levelId);

        const newEmails: Email[] = [];
        for (const levelId of available) {
          if (existingLevelIds.includes(levelId)) continue;
          const level = getLevelById(levelId);
          if (!level) continue;
          const client = clients[level.clientId];
          if (!client) continue;

          newEmails.push({
            id: `email-${levelId}`,
            from: `${client.avatar} ${client.name}`,
            subject: level.briefSubject,
            body: level.briefBody,
            read: false,
            levelId,
            timestamp: `${state.gameTime.hour}:${state.gameTime.minute.toString().padStart(2, '0')}`,
          });
        }

        if (newEmails.length > 0) {
          audioEngine.playChime();
          set(state => ({
            emails: [...state.emails, ...newEmails],
            dockBadges: { ...state.dockBadges, mail: (state.dockBadges.mail || 0) + newEmails.length },
          }));
        }
      },

      markEmailRead: (emailId) => {
        set(state => {
          const email = state.emails.find(e => e.id === emailId);
          const wasBadged = email && !email.read;
          return {
            emails: state.emails.map(e => e.id === emailId ? { ...e, read: true } : e),
            dockBadges: wasBadged
              ? { ...state.dockBadges, mail: Math.max(0, (state.dockBadges.mail || 0) - 1) }
              : state.dockBadges,
          };
        });
      },

      acceptProject: (levelId) => {
        const level = getLevelById(levelId);
        if (!level) return;
        const existing = get().activeProjects.find(p => p.levelId === levelId);
        if (existing) return;

        const project: ProjectState = {
          levelId,
          status: 'new',
          code: level.templateCode,
          attempts: 0,
          hintsUsed: 0,
        };

        const projectFolder: VirtualFile = {
          name: `${clients[level.clientId]?.name || 'Client'}_${level.title.split('—')[0].trim()}`,
          type: 'folder',
          children: [
            { name: 'index.html', type: 'file', content: level.templateCode },
          ],
        };

        const newDownloads = level.assets?.map(a => ({
          name: a.name,
          type: 'file' as const,
          content: a.content,
        })) || [];

        audioEngine.playClick();

        set(state => ({
          activeProjects: [...state.activeProjects, project],
          fileSystem: [...state.fileSystem, projectFolder],
          downloads: [...state.downloads, ...newDownloads],
        }));

        get().advanceTime(15);
      },

      startEditing: (levelId) => {
        const project = get().activeProjects.find(p => p.levelId === levelId);
        if (!project) return;
        const lvl = getLevelById(levelId);
        const zone = lvl?.zone || 'harbor-row';

        set(state => ({
          currentEditingLevel: levelId,
          editorCode: project.code,
          currentZone: zone,
          activeProjects: state.activeProjects.map(p =>
            p.levelId === levelId ? { ...p, status: 'in_progress' as const } : p
          ),
        }));

        get().openApp('editor');
      },

      updateCode: (code) => {
        set(state => ({
          editorCode: code,
          activeProjects: state.activeProjects.map(p =>
            p.levelId === state.currentEditingLevel ? { ...p, code } : p
          ),
        }));
      },

      submitProject: () => {
        const state = get();
        if (!state.currentEditingLevel) return;
        const level = getLevelById(state.currentEditingLevel);
        if (!level) return;

        const godmode = state.overrideCodes['dev-godmode'];
        const score = evaluateSubmission(state.editorCode, level);
        const feedback = getFeedbackMessage(score, level);
        const isPass = godmode || score.tier !== 'needs_revision';
        const client = clients[level.clientId];

        if (isPass) audioEngine.playSuccess();
        else audioEngine.playError();

        if (client) {
          const chatMsg: ChatMessage = {
            id: `feedback-${Date.now()}`,
            from: client.name,
            avatar: client.avatar,
            message: feedback,
            timestamp: `${state.gameTime.hour}:${state.gameTime.minute.toString().padStart(2, '0')}`,
          };
          const currentChat = state.chatMessages[level.clientId] || [];
          set(state => ({
            chatMessages: {
              ...state.chatMessages,
              [level.clientId]: [...currentChat, chatMsg],
            },
            dockBadges: { ...state.dockBadges, chat: (state.dockBadges.chat || 0) + 1 },
          }));
          if (!state.unlockedApps.includes('chat')) {
            set(s => ({ unlockedApps: [...s.unlockedApps, 'chat' as AppId] }));
          }
        }

        set(state => ({
          activeProjects: state.activeProjects.map(p =>
            p.levelId === state.currentEditingLevel
              ? {
                  ...p,
                  score,
                  feedbackMessage: feedback,
                  status: isPass ? 'completed' as const : 'needs_revision' as const,
                  attempts: p.attempts + 1,
                }
              : p
          ),
          completedLevels: isPass && !state.completedLevels.includes(state.currentEditingLevel!)
            ? [...state.completedLevels, state.currentEditingLevel!]
            : state.completedLevels,
          totalPrecision: isPass ? state.totalPrecision + score.precision : state.totalPrecision,
          totalCreativity: isPass ? state.totalCreativity + score.creativity : state.totalCreativity,
          totalProfessionalism: isPass ? state.totalProfessionalism + score.professionalism : state.totalProfessionalism,
          projectsCompleted: isPass ? state.projectsCompleted + 1 : state.projectsCompleted,
        }));

        get().advanceTime(30);

        if (isPass) {
          get().updateTownAfterCompletion(state.currentEditingLevel!);
          setTimeout(() => get().generateInitialEmails(), 500);
          setTimeout(() => get().openApp('impact'), 800);

          if (get().projectsCompleted >= 3 && !get().unlockedApps.includes('forum')) {
            set(s => ({ unlockedApps: [...s.unlockedApps, 'forum' as AppId] }));
          }
          if (get().projectsCompleted >= 2 && !get().unlockedApps.includes('files')) {
            set(s => ({ unlockedApps: [...s.unlockedApps, 'files' as AppId] }));
          }
          if (get().projectsCompleted >= 4 && !get().unlockedApps.includes('music')) {
            set(s => ({ unlockedApps: [...s.unlockedApps, 'music' as AppId] }));
          }
        }
      },

      updateTownAfterCompletion: (levelId) => {
        const buildingMap: Record<string, string> = {
          'elena-1': 'bakery', 'elena-2': 'bakery', 'elena-3': 'bakery', 'elena-4': 'bakery', 'elena-5': 'bakery',
          'iqbal-1': 'bookstore', 'iqbal-2': 'bookstore', 'iqbal-3': 'bookstore', 'iqbal-4': 'bookstore', 'iqbal-5': 'bookstore',
          'theo-1': 'cafe', 'theo-2': 'cafe', 'theo-3': 'cafe', 'theo-4': 'cafe', 'theo-5': 'cafe',
          'maya-1': 'florist', 'maya-2': 'florist', 'maya-3': 'florist',
          'mira-1': 'boutique', 'mira-2': 'boutique', 'mira-3': 'boutique', 'mira-4': 'boutique',
          'lucas-1': 'surfschool', 'lucas-2': 'surfschool', 'lucas-3': 'surfschool', 'lucas-4': 'surfschool',
          'gelato-1': 'gelato', 'arcade-1': 'arcade', 'hotel-1': 'hotel', 'gallery-1': 'gallery',
          'dean-1': 'architect', 'dean-2': 'architect', 'dean-3': 'architect', 'dean-4': 'architect',
          'nora-1': 'startup', 'nora-2': 'startup', 'nora-3': 'startup', 'nora-4': 'startup',
          'matcha-1': 'matcha', 'climb-1': 'gym', 'tower-1': 'tower', 'transit-1': 'transit',
        };
        const building = buildingMap[levelId];
        if (!building) return;
        const clientId = levelId.split('-')[0];
        const clientLevels = allLevels.filter(l => l.clientId === clientId);
        const allComplete = clientLevels.every(l => get().completedLevels.includes(l.id));
        const lvl = allLevels.find(l => l.id === levelId);
        const zoneOf = lvl?.zone || 'harbor-row';

        set(state => ({
          currentZone: zoneOf,
          townBuildings: {
            ...state.townBuildings,
            [building]: { completed: allComplete, glowing: true },
          },
        }));
      },

      addChatMessage: (clientId, msg) => {
        set(state => ({
          chatMessages: {
            ...state.chatMessages,
            [clientId]: [...(state.chatMessages[clientId] || []), msg],
          },
        }));
      },

      toggleConsole: () => set(s => ({ consoleVisible: !s.consoleVisible })),
      addConsoleEntry: (entry) => set(s => ({ consoleHistory: [...s.consoleHistory, entry] })),
      clearConsole: () => set({ consoleHistory: [] }),

      applyOverride: (effect) => {
        const state = get();
        const setOC = (extra?: Record<string, any>) => set({ overrideCodes: { ...state.overrideCodes, [effect]: true }, ...extra });

        if (effect.startsWith('editor-level-')) {
          const level = parseInt(effect.split('-')[2]) as EditorLevel;
          setOC({ editorLevel: level });
        } else if (effect.startsWith('editor-')) {
          const levelMap: Record<string, EditorLevel> = {
            'editor-autoclose': 2, 'editor-indent': 2, 'editor-lint': 3,
            'editor-emmet': 4, 'editor-autocomplete': 4,
          };
          const newLevel = levelMap[effect];
          if (newLevel && newLevel > state.editorLevel) setOC({ editorLevel: newLevel });
          else setOC();
        } else if (effect === 'studio-canvas' || effect === 'creative-freeplay') {
          setOC({
            studioCanvasDiscovered: true,
            unlockedApps: state.unlockedApps.includes('canvas') ? state.unlockedApps : [...state.unlockedApps, 'canvas' as AppId],
          });
        } else if (effect.startsWith('wallpaper-')) {
          setOC({ unlockedWallpaper: effect });
        } else if (effect.startsWith('theme-')) {
          const themeName = effect.replace('theme-', '');
          const validThemes = ['light', 'dark', 'neon', 'nightshift', 'frost'];
          if (validThemes.includes(themeName)) setOC({ themeMode: themeName as ThemeMode });
          else setOC();
        } else if (effect.startsWith('cursor-')) {
          const cursor = effect.replace('cursor-', '') as CursorEffect;
          setOC({ cursorEffect: cursor });
        } else if (effect === 'fun-arcade' || effect === 'fun-puzzle') {
          setOC({ unlockedApps: state.unlockedApps.includes('miniGame') ? state.unlockedApps : [...state.unlockedApps, 'miniGame' as AppId] });
        } else if (effect === 'dev-instantpass' || effect === 'dev-skip') {
          if (state.currentEditingLevel) {
            const levelId = state.currentEditingLevel;
            set({
              overrideCodes: { ...state.overrideCodes, [effect]: true },
              completedLevels: state.completedLevels.includes(levelId) ? state.completedLevels : [...state.completedLevels, levelId],
              activeProjects: state.activeProjects.map(p =>
                p.levelId === levelId ? { ...p, status: 'completed' as const, score: { precision: 100, creativity: 100, professionalism: 100, tier: 'outstanding' as const } } : p
              ),
              projectsCompleted: state.projectsCompleted + 1,
            });
            get().updateTownAfterCompletion(levelId);
            get().addConsoleEntry(`✓ Level "${levelId}" marked complete.`);
            setTimeout(() => get().generateInitialEmails(), 300);
          } else {
            get().addConsoleEntry('No active level to skip. Open a project in the editor first.');
            setOC();
          }
        } else if (effect === 'dev-skipall') {
          const available = allLevels.map(l => l.id);
          const newCompleted = [...new Set([...state.completedLevels, ...available])];
          set({
            overrideCodes: { ...state.overrideCodes, [effect]: true },
            completedLevels: newCompleted,
            projectsCompleted: newCompleted.length,
          });
          get().addConsoleEntry(`✓ All ${available.length} levels marked complete.`);
          setTimeout(() => get().generateInitialEmails(), 300);
        } else if (effect === 'dev-unlockall') {
          const allApps: AppId[] = ['mail', 'editor', 'projectBoard', 'townMap', 'chat', 'files', 'forum', 'canvas', 'settings', 'music', 'miniGame', 'impact', 'studioRoom'];
          set({
            overrideCodes: { ...state.overrideCodes, [effect]: true },
            unlockedApps: allApps,
            studioCanvasDiscovered: true,
            editorLevel: 4 as EditorLevel,
          });
          get().addConsoleEntry('✓ All apps, editor level 4, and canvas unlocked.');
        } else if (effect === 'dev-levelup') {
          const next = Math.min(4, state.editorLevel + 1) as EditorLevel;
          setOC({ editorLevel: next });
          get().addConsoleEntry(`✓ Editor level → ${next}`);
        } else if (effect === 'dev-stateview') {
          const s = get();
          const stateStr = JSON.stringify({
            zone: s.currentZone, completed: s.completedLevels.length,
            projects: s.activeProjects.length, editorLevel: s.editorLevel,
            overrides: Object.keys(s.overrideCodes).length,
            unlockedApps: s.unlockedApps,
            theme: s.themeMode, cursor: s.cursorEffect,
            time: `Day ${s.gameTime.dayCount} ${s.gameTime.hour}:${s.gameTime.minute.toString().padStart(2, '0')}`,
            season: s.gameTime.season, weather: s.gameTime.weather,
          }, null, 2);
          get().addConsoleEntry(stateStr);
        } else if (effect === 'dev-godmode') {
          setOC();
          get().addConsoleEntry('✓ God Mode active — penalties disabled.');
        } else if (effect === 'fun-byte') {
          get().addConsoleEntry('// stress module active :)');
          setOC();
        } else if (effect === 'fun-logicfolk') {
          get().addConsoleEntry('Loading logicfolk.exe...\n...\n// Not found. But you looked. That counts.');
          setOC();
        } else {
          setOC();
        }
      },

      discoverStudioCanvas: () => set(s => ({
        studioCanvasDiscovered: true,
        unlockedApps: s.unlockedApps.includes('canvas') ? s.unlockedApps : [...s.unlockedApps, 'canvas' as AppId],
      })),

      markMapControlsUsed: () => set({ mapControlsShown: false }),

      setTheme: (theme) => {
        set({ themeMode: theme });
        if (theme === 'dark' || theme === 'neon' || theme === 'nightshift') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setCursorEffect: (effect) => set({ cursorEffect: effect }),

      setMasterVolume: (v) => {
        audioEngine.setMasterVolume(v);
        set(s => ({ audio: { ...s.audio, masterVolume: v } }));
      },

      setAmbientEnabled: (e) => {
        audioEngine.setAmbientEnabled(e);
        set(s => ({ audio: { ...s.audio, ambientEnabled: e } }));
      },

      setSfxEnabled: (e) => {
        audioEngine.setSfxEnabled(e);
        set(s => ({ audio: { ...s.audio, sfxEnabled: e } }));
      },

      addCanvasElement: (el) => set(s => ({ canvasElements: [...s.canvasElements, el] })),
      updateCanvasElement: (id, updates) => set(s => ({
        canvasElements: s.canvasElements.map(el => el.id === id ? { ...el, ...updates } : el),
      })),
      removeCanvasElement: (id) => set(s => ({
        canvasElements: s.canvasElements.filter(el => el.id !== id),
      })),

      addStudioItem: (item) => set(s => ({
        studioItems: [...s.studioItems, item],
      })),

      updateStudioItem: (id, updates) => set(s => ({
        studioItems: s.studioItems.map(it => it.id === id ? { ...it, ...updates } : it),
      })),

      removeStudioItem: (id) => set(s => ({
        studioItems: s.studioItems.filter(it => it.id !== id),
      })),

      pinCanvasToStudio: (name, wall) => set(s => {
        const html = s.canvasElements.find(e => e.id === 'canvas-html')?.content || '';
        const css = s.canvasElements.find(e => e.id === 'canvas-css')?.content || '';
        const js = s.canvasElements.find(e => e.id === 'canvas-js')?.content || '';
        const newItem: StudioItem = {
          id: `canvas-${Date.now()}`,
          name: name || 'Canvas Piece',
          type: 'canvas',
          x: 25 + Math.random() * 50,
          y: 30 + Math.random() * 30,
          wall,
          unlocked: true,
          emoji: '🖼️',
          preview: { html, css, js },
          width: 70,
          height: 50,
        };
        return { studioItems: [...s.studioItems, newItem] };
      }),

      addCustomTrack: (t) => set(s => ({ customTracks: [...s.customTracks, t] })),
      removeCustomTrack: (id) => set(s => ({
        customTracks: s.customTracks.filter(t => t.id !== id),
        zoneMusic: Object.fromEntries(Object.entries(s.zoneMusic).map(([z, ids]) => [z, ids.filter(i => i !== id)])),
      })),
      renameTrack: (id, name) => set(s => ({ trackRenames: { ...s.trackRenames, [id]: name } })),
      assignTrackToZone: (zoneId, trackId) => set(s => ({
        zoneMusic: { ...s.zoneMusic, [zoneId]: Array.from(new Set([...(s.zoneMusic[zoneId] || []), trackId])) },
      })),
      unassignTrackFromZone: (zoneId, trackId) => set(s => ({
        zoneMusic: { ...s.zoneMusic, [zoneId]: (s.zoneMusic[zoneId] || []).filter(i => i !== trackId) },
      })),
      setWeather: (w) => set(s => ({ gameTime: { ...s.gameTime, weather: w } })),

      advanceTime: (minutes) => {
        set(s => {
          let newMin = s.gameTime.minute + minutes;
          let newHour = s.gameTime.hour;
          let newDay = s.gameTime.dayCount;
          let newSeason = s.gameTime.season;
          let newWeather = s.gameTime.weather;
          while (newMin >= 60) { newMin -= 60; newHour++; }
          while (newHour >= 24) {
            newHour -= 24;
            newDay++;
            newSeason = getSeasonFromDay(newDay);
            newWeather = rollWeather(newSeason, newWeather);
          }
          return { gameTime: { hour: newHour, minute: newMin, dayCount: newDay, season: newSeason, weather: newWeather } };
        });
      },

      setMenuOpen: (menu) => set({ menuOpen: menu }),
      setCurrentZone: (zone) => set({ currentZone: zone }),
      setStudioWall: (w) => set({ currentStudioWall: w }),
      setSubdistrict: (s) => set({ currentSubdistrict: s }),

      resetGame: () => set(defaultState),
    }),
    { name: 'harbor-studio-save' }
  )
);
