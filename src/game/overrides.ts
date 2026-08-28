// Override codes system — full specification

export interface OverrideResult {
  success: boolean;
  message: string;
  effect?: string;
}

export const OVERRIDE_CODES: Record<string, { description: string; effect: string; category: string; hidden?: boolean }> = {
  // === Editor Overrides ===
  'autoclose': { description: 'Auto-close — Tags close automatically', effect: 'editor-autoclose', category: 'editor' },
  'indent': { description: 'Auto-indent — Smart indentation', effect: 'editor-indent', category: 'editor' },
  'lint': { description: 'Linter — Error highlighting enabled', effect: 'editor-lint', category: 'editor' },
  'emmet': { description: 'Emmet Engine — Shorthand expansion', effect: 'editor-emmet', category: 'editor' },
  'autocomplete': { description: 'Autocomplete — Tag suggestions', effect: 'editor-autocomplete', category: 'editor' },
  'assist': { description: 'Structure Assist — Auto-closing tags', effect: 'editor-level-2', category: 'editor' },

  // === Debug Overrides ===
  'devtools': { description: 'DevTools — Diagnostics panel', effect: 'debug-devtools', category: 'debug' },
  'inspect': { description: 'Inspector — Issue inspection without penalty', effect: 'debug-inspect', category: 'debug' },
  'diff': { description: 'Diff View — Code comparison enabled', effect: 'debug-diff', category: 'debug' },
  'score': { description: 'Score Display — Raw scoring visible', effect: 'debug-score', category: 'debug' },
  'parser': { description: 'Parser — Parsed output JSON visible', effect: 'debug-parser', category: 'debug' },
  'rules': { description: 'Rules — Evaluation rules displayed', effect: 'debug-rules', category: 'debug' },

  // === Workflow Overrides ===
  'autosave': { description: 'Autosave — Progress saved automatically', effect: 'workflow-autosave', category: 'workflow' },
  'multitab': { description: 'Multi-tab — All editor tabs unlocked', effect: 'workflow-multitab', category: 'workflow' },
  'preview-sync': { description: 'Preview Sync — Instant preview updates', effect: 'workflow-preview-sync', category: 'workflow' },
  'assets': { description: 'Asset Helper — Path suggestions enabled', effect: 'workflow-assets', category: 'workflow' },
  'fastreload': { description: 'Fast Reload — Instant preview refresh', effect: 'workflow-fastreload', category: 'workflow' },

  // === Creative / Sandbox ===
  'canvas': { description: 'Studio Canvas — Unlocked', effect: 'studio-canvas', category: 'creative' },
  'freeplay': { description: 'Freeplay — Blank project workspace', effect: 'creative-freeplay', category: 'creative' },
  'theme': { description: 'Theme Selector — All themes unlocked', effect: 'creative-theme-unlock', category: 'creative' },
  'preview-mode': { description: 'Preview Modes — Light/Dark/Test unlocked', effect: 'creative-preview-mode', category: 'creative' },

  // === Experimental ===
  'chaos': { description: '// c̵̛̜h̷̳̆a̷̩̐o̸̱̓s̷̤̈.̴̱̈́e̵̤̔x̵̰̓e̵̙̕', effect: 'visual-chaos', category: 'experimental' },
  'minimal': { description: 'Minimal UI — Ultra-clean mode', effect: 'visual-minimal', category: 'experimental' },
  'byte': { description: '// stress module active :)', effect: 'fun-byte', category: 'experimental' },
  'ghost': { description: 'Ghost Mode — Subtle visual effects', effect: 'visual-ghost', category: 'experimental' },
  'legacy': { description: 'Legacy UI — Retro theme loaded', effect: 'theme-legacy', category: 'experimental' },
  'wireframe': { description: 'Wireframe — Preview styling removed', effect: 'visual-wireframe', category: 'experimental' },
  'slowmo': { description: 'Slow Motion — UI transitions slowed', effect: 'visual-slowmo', category: 'experimental' },
  'logicfolk': { description: 'Logicfolk.exe — ???', effect: 'fun-logicfolk', category: 'experimental' },

  // === Dev (HIDDEN - never shown in sys.list or help) ===
  'godmode': { description: 'God Mode — Penalties disabled', effect: 'dev-godmode', category: 'dev', hidden: true },
  'instantpass': { description: 'Instant Pass — Force-completes current level', effect: 'dev-instantpass', category: 'dev', hidden: true },
  'skip': { description: 'Skip — Marks current level complete', effect: 'dev-skip', category: 'dev', hidden: true },
  'skipall': { description: 'Skip All — Completes all available levels', effect: 'dev-skipall', category: 'dev', hidden: true },
  'unlockall': { description: 'Unlock All — Unlocks all apps and features', effect: 'dev-unlockall', category: 'dev', hidden: true },
  'log': { description: 'Event Log — All events logged', effect: 'dev-log', category: 'dev', hidden: true },
  'stateview': { description: 'State View — Full state object', effect: 'dev-stateview', category: 'dev', hidden: true },
  'levelup': { description: 'Level Up — Advance editor level', effect: 'dev-levelup', category: 'dev', hidden: true },
  'maxeditor': { description: 'Max Editor — Editor level 4', effect: 'editor-level-4', category: 'dev', hidden: true },

  // === Theme Overrides ===
  'neon': { description: 'Theme: Neon — Cyberpunk glow', effect: 'theme-neon', category: 'theme' },
  'nightshift': { description: 'Theme: Night Shift — Warm low-light', effect: 'theme-nightshift', category: 'theme' },
  'frost': { description: 'Theme: Frost — Glassmorphism', effect: 'theme-frost', category: 'theme' },

  // === Animation Overrides ===
  'turbo': { description: 'Turbo — Interactions sped up', effect: 'anim-turbo', category: 'animation' },
  'drift': { description: 'Drift — Subtle UI movement', effect: 'anim-drift', category: 'animation' },
  'palette-shift': { description: 'Palette Shift — Gradual color cycling', effect: 'anim-palette-shift', category: 'animation' },

  // === Visual Tools ===
  'mirror': { description: 'Mirror — Preview flipped horizontally', effect: 'visual-mirror', category: 'visual' },
  'xray': { description: 'X-Ray — Layout boundaries revealed', effect: 'visual-xray', category: 'visual' },
  'wireframe+': { description: 'Wireframe+ — Full box model outlines', effect: 'visual-wireframe-plus', category: 'visual' },

  // === Fun ===
  'rng': { description: 'RNG — Random UI variations active', effect: 'fun-rng', category: 'fun' },
  'focus': { description: 'Focus Mode — Active line highlighted', effect: 'fun-focus', category: 'fun' },
  'arcade': { description: 'Arcade Mode — Mini-games unlocked', effect: 'fun-arcade', category: 'fun' },
  'puzzle': { description: 'Puzzle Mode — Challenges unlocked', effect: 'fun-puzzle', category: 'fun' },

  // === Wallpapers ===
  'wallpaper-lighthouse': { description: 'Wallpaper: Seabrook Lighthouse', effect: 'wallpaper-lighthouse', category: 'wallpaper' },
  'wallpaper-coffee': { description: 'Wallpaper: Harbor Coffee', effect: 'wallpaper-coffee', category: 'wallpaper' },
  'wallpaper-neon': { description: 'Wallpaper: Neon Harbor', effect: 'wallpaper-neon', category: 'wallpaper' },

  // === Cursor Effects ===
  'cursor-neon': { description: 'Cursor: Neon Trail', effect: 'cursor-neon', category: 'cursor' },
  'cursor-ghost': { description: 'Cursor: Fading Duplicates', effect: 'cursor-ghost', category: 'cursor' },
  'cursor-stars': { description: 'Cursor: Particle Sparkle', effect: 'cursor-stars', category: 'cursor' },
  'cursor-cyber': { description: 'Cursor: Digital Trail', effect: 'cursor-cyber', category: 'cursor' },

  // === System ===
  'reset-editor': { description: 'Editor reset to Level 1', effect: 'editor-level-1', category: 'system' },
  'reset-theme': { description: 'Theme reset to default', effect: 'theme-default', category: 'system' },
};

export function processConsoleCommand(input: string): OverrideResult {
  const trimmed = input.trim().toLowerCase();

  if (trimmed === 'help') {
    return {
      success: true,
      message: `Harbor OS Console v1.0
━━━━━━━━━━━━━━━━━━━━━━
  help                    — Show this message
  sys.override("code")    — Apply override
  sys.list()              — Show override categories
  sys.list("category")    — Show overrides in category
  sys.help("code")        — Show override description
  unlock --flag           — Apply unlock
  theme("name")           — Apply theme
  cursor("name")          — Apply cursor effect
  status                  — Show system status
  clear                   — Clear console
  whoami                  — ???`,
    };
  }

  if (trimmed === 'clear') return { success: true, message: '__CLEAR__' };
  if (trimmed === 'whoami') return { success: true, message: 'harbor-studio-dev // You.' };

  if (trimmed === 'status') {
    return {
      success: true,
      message: `Harbor OS v1.0.3\nSystem: Online\nEditor Module: Active\nCanvas: Standby\nAudio Engine: 3-Layer Active\nOverrides: Available\nTheme: Default`,
    };
  }

  // sys.list() or sys.list("category")
  const listMatch = trimmed.match(/sys\.list\(\s*(?:["'](\w+)["'])?\s*\)/);
  if (listMatch) {
    const cat = listMatch[1];
    if (cat) {
      // Never show hidden (dev) overrides
      const codes = Object.entries(OVERRIDE_CODES).filter(([, v]) => v.category === cat && !v.hidden);
      if (codes.length === 0) return { success: false, message: `Unknown category: "${cat}"` };
      return {
        success: true,
        message: `${cat} overrides:\n${codes.map(([k, v]) => `  ${k.padEnd(18)} — ${v.description}`).join('\n')}`,
      };
    }
    // Show categories but exclude dev
    return {
      success: true,
      message: `Override Categories:
  editor      — autoclose, indent, lint, emmet, autocomplete
  debug       — devtools, inspect, diff, score, parser, rules
  workflow    — autosave, multitab, preview-sync, assets, fastreload
  creative    — canvas, freeplay, theme, preview-mode
  visual      — mirror, xray, wireframe+
  theme       — neon, nightshift, frost
  animation   — turbo, drift, palette-shift
  cursor      — cursor-neon, cursor-ghost, cursor-stars, cursor-cyber
  fun         — rng, focus, arcade, puzzle
  
Use sys.list("category") for details.`,
    };
  }

  // sys.help("code")
  const helpMatch = trimmed.match(/sys\.help\(["']([\w+-]+)["']\)/);
  if (helpMatch) {
    const code = helpMatch[1];
    const override = OVERRIDE_CODES[code];
    if (override && !override.hidden) return { success: true, message: `${code}: ${override.description}\nCategory: ${override.category}\nEffect: ${override.effect}` };
    if (override && override.hidden) return { success: true, message: `${code}: ${override.description}` };
    return { success: false, message: `Unknown code: "${code}"` };
  }

  // theme("name")
  const themeMatch = trimmed.match(/theme\(["'](\w+)["']\)/);
  if (themeMatch) {
    const name = themeMatch[1];
    if (['neon', 'nightshift', 'frost', 'dark', 'light', 'minimal', 'legacy'].includes(name)) {
      return { success: true, message: `Theme Applied: ${name}`, effect: `theme-${name}` };
    }
    return { success: false, message: `Unknown theme: "${name}"` };
  }

  // cursor("name")
  const cursorMatch = trimmed.match(/cursor\(["'](\w+)["']\)/);
  if (cursorMatch) {
    return { success: true, message: `Cursor Effect: ${cursorMatch[1]}`, effect: `cursor-${cursorMatch[1]}` };
  }

  // sys.override("code")
  const overrideMatch = trimmed.match(/sys\.override\(["']([\w+-]+)["']\)/);
  if (overrideMatch) {
    const code = overrideMatch[1];
    const override = OVERRIDE_CODES[code];
    if (override) return { success: true, message: `Override Accepted: ${override.description}`, effect: override.effect };
    return { success: false, message: `Unknown override: "${code}"` };
  }

  // unlock --flag
  const unlockMatch = trimmed.match(/unlock\s+--([\w+-]+)/);
  if (unlockMatch) {
    const flag = unlockMatch[1];
    const override = OVERRIDE_CODES[flag];
    if (override) return { success: true, message: `Override Accepted: ${override.description}`, effect: override.effect };
    return { success: false, message: `Unknown flag: "${flag}"` };
  }

  // Direct code name (still works for dev codes - you just have to know them)
  if (OVERRIDE_CODES[trimmed]) {
    return { success: true, message: `Override Accepted: ${OVERRIDE_CODES[trimmed].description}`, effect: OVERRIDE_CODES[trimmed].effect };
  }

  return { success: false, message: `Command not recognized: "${trimmed}"` };
}
