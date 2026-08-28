import React from 'react';
import { useGameStore } from '@/game/store';
import { ThemeMode, CursorEffect } from '@/game/types';
import { Sun, Moon, Zap, Snowflake, Sunset, Volume2, VolumeX, Music, Waves } from 'lucide-react';
import { audioEngine } from '@/game/audio';

const themes: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'light', label: 'Light', icon: <Sun size={16} />, desc: 'Coastal daylight' },
  { id: 'dark', label: 'Dark', icon: <Moon size={16} />, desc: 'Night mode' },
  { id: 'neon', label: 'Neon', icon: <Zap size={16} />, desc: 'Cyberpunk glow' },
  { id: 'frost', label: 'Frost', icon: <Snowflake size={16} />, desc: 'Glassmorphism' },
  { id: 'nightshift', label: 'Night Shift', icon: <Sunset size={16} />, desc: 'Warm low-light' },
];

const cursors: { id: CursorEffect; label: string; desc: string }[] = [
  { id: 'none', label: 'Default', desc: 'Standard cursor' },
  { id: 'neon', label: 'Neon Trail', desc: 'Glowing trail' },
  { id: 'ghost', label: 'Ghost', desc: 'Fading duplicates' },
  { id: 'stars', label: 'Stars', desc: 'Particle sparkle' },
];

const Toggle: React.FC<{ enabled: boolean; onChange: () => void; label: string; sublabel?: string }> = ({ enabled, onChange, label, sublabel }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <span className="text-sm text-foreground w-20">{label}</span>
    <button onClick={onChange}
      className={`w-9 h-5 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-border'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform ${enabled ? 'left-4' : 'left-0.5'}`} />
    </button>
    {sublabel && <span className="text-[10px] text-muted-foreground">{sublabel}</span>}
  </label>
);

const VolumeSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void; icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <label className="flex items-center gap-3">
    <span className="text-sm text-foreground w-20 flex items-center gap-1.5">{icon}{label}</span>
    <input type="range" min="0" max="1" step="0.05" value={value} onChange={e => onChange(parseFloat(e.target.value))}
      className="flex-1 accent-primary h-1" />
    <span className="text-[10px] text-muted-foreground w-8 text-right">{Math.round(value * 100)}%</span>
  </label>
);

const SettingsApp: React.FC = () => {
  const themeMode = useGameStore(s => s.themeMode);
  const cursorEffect = useGameStore(s => s.cursorEffect);
  const audio = useGameStore(s => s.audio);
  const setTheme = useGameStore(s => s.setTheme);
  const setCursorEffect = useGameStore(s => s.setCursorEffect);
  const setMasterVolume = useGameStore(s => s.setMasterVolume);
  const setAmbientEnabled = useGameStore(s => s.setAmbientEnabled);
  const setSfxEnabled = useGameStore(s => s.setSfxEnabled);
  const overrideCodes = useGameStore(s => s.overrideCodes);
  const resetGame = useGameStore(s => s.resetGame);
  const editorLevel = useGameStore(s => s.editorLevel);
  const projectsCompleted = useGameStore(s => s.projectsCompleted);
  const completedLevels = useGameStore(s => s.completedLevels);

  const [ambientVol, setAmbientVol] = React.useState(0.15);
  const [musicVol, setMusicVol] = React.useState(0.3);
  const [sfxVol, setSfxVol] = React.useState(0.4);

  const activeOverrides = Object.keys(overrideCodes).filter(k => overrideCodes[k]);

  return (
    <div className="h-full overflow-auto harbor-scrollbar p-6 space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>

      {/* Theme */}
      <section>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Theme</h3>
        <div className="grid grid-cols-5 gap-2">
          {themes.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`p-3 rounded-lg border text-center transition-all ${
                themeMode === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
              }`}>
              <div className="flex justify-center mb-1.5">{t.icon}</div>
              <p className="text-[11px] font-medium">{t.label}</p>
              <p className="text-[9px] text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Cursor Effects */}
      <section>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cursor Effect</h3>
        <div className="flex gap-2">
          {cursors.map(c => (
            <button key={c.id} onClick={() => setCursorEffect(c.id)}
              className={`px-3 py-2 rounded-lg border text-[11px] transition-all ${
                cursorEffect === c.id ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border text-muted-foreground hover:text-foreground'
              }`}>{c.label}</button>
          ))}
        </div>
      </section>

      {/* Audio — 3 Layers */}
      <section>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Audio — 3-Layer System</h3>
        <div className="space-y-3">
          <VolumeSlider label="Master" value={audio.masterVolume} onChange={v => setMasterVolume(v)} icon={<Volume2 size={12} />} />
          <div className="h-px bg-border/50 my-1" />
          <div className="pl-2 space-y-3 border-l-2 border-primary/20">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Layer 1 — Ambient</p>
              <VolumeSlider label="Volume" value={ambientVol} onChange={v => { setAmbientVol(v); audioEngine.setAmbientVolume(v); }} icon={<Waves size={11} />} />
              <div className="mt-1.5">
                <Toggle enabled={audio.ambientEnabled} onChange={() => setAmbientEnabled(!audio.ambientEnabled)}
                  label="Enabled" sublabel={audio.ambientEnabled ? 'Ocean waves' : 'Off'} />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Layer 2 — Music</p>
              <VolumeSlider label="Volume" value={musicVol} onChange={v => { setMusicVol(v); audioEngine.setMusicVolume(v); }} icon={<Music size={11} />} />
              <div className="mt-1.5">
                <Toggle enabled={audio.musicEnabled} onChange={() => {
                  const next = !audio.musicEnabled;
                  audioEngine.setMusicEnabled(next);
                  useGameStore.setState(s => ({ audio: { ...s.audio, musicEnabled: next } }));
                }} label="Enabled" sublabel={audio.musicEnabled ? 'Music on' : 'Silent mode'} />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Layer 3 — Sound Effects</p>
              <VolumeSlider label="Volume" value={sfxVol} onChange={v => { setSfxVol(v); audioEngine.setSfxVolume(v); }} icon={<Zap size={11} />} />
              <div className="mt-1.5">
                <Toggle enabled={audio.sfxEnabled} onChange={() => setSfxEnabled(!audio.sfxEnabled)}
                  label="Enabled" sublabel={audio.sfxEnabled ? 'Click, chime, feedback' : 'Off'} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Progress</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{projectsCompleted}</p>
            <p className="text-[10px] text-muted-foreground">Projects Done</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">L{editorLevel}</p>
            <p className="text-[10px] text-muted-foreground">Editor Level</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{activeOverrides.length}</p>
            <p className="text-[10px] text-muted-foreground">Overrides</p>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-muted-foreground">
          Completed levels: {completedLevels.length > 0 ? completedLevels.join(', ') : 'None yet'}
        </div>
      </section>

      {/* Active Overrides */}
      {activeOverrides.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Overrides</h3>
          <div className="flex flex-wrap gap-1.5">
            {activeOverrides.map(code => (
              <span key={code} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-mono">{code}</span>
            ))}
          </div>
        </section>
      )}

      {/* Danger Zone */}
      <section className="pt-4 border-t border-border">
        <button onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) resetGame(); }}
          className="px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-xs hover:bg-destructive/10 transition-colors">
          Reset All Progress
        </button>
      </section>
    </div>
  );
};

export default SettingsApp;
