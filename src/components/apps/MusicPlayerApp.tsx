import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat, Shuffle, Upload, Pencil, Trash2, MapPin } from 'lucide-react';
import { audioEngine, MUSIC_LIBRARY, MusicTrack } from '@/game/audio';
import { useGameStore } from '@/game/store';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'lo-fi', label: 'Lo-Fi' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'classical', label: 'Classical' },
  { id: 'chill-electronic', label: 'Electronic' },
  { id: 'minimal-piano', label: 'Piano' },
] as const;

const ZONES = [
  { id: 'harbor-row', label: 'Harbor Row' },
  { id: 'seabrook-promenade', label: 'Seabrook' },
  { id: 'cedar-heights', label: 'Cedar Heights' },
];

const MusicPlayerApp: React.FC = () => {
  const audio = useGameStore(s => s.audio);
  const customTracks = useGameStore(s => s.customTracks);
  const trackRenames = useGameStore(s => s.trackRenames);
  const zoneMusic = useGameStore(s => s.zoneMusic);
  const currentZone = useGameStore(s => s.currentZone);
  const addCustomTrack = useGameStore(s => s.addCustomTrack);
  const removeCustomTrack = useGameStore(s => s.removeCustomTrack);
  const renameTrack = useGameStore(s => s.renameTrack);
  const assignTrackToZone = useGameStore(s => s.assignTrackToZone);
  const unassignTrackFromZone = useGameStore(s => s.unassignTrackFromZone);

  const [category, setCategory] = React.useState<string>('all');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTrackId, setCurrentTrackId] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.3);
  const [isRepeat, setIsRepeat] = React.useState(true);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [zoneFilter, setZoneFilter] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const progressInterval = React.useRef<number>(0);

  // Combine library + custom tracks, apply rename overrides
  const allTracks: MusicTrack[] = [...MUSIC_LIBRARY, ...customTracks].map(t => ({
    ...t,
    title: trackRenames[t.id] || t.title,
  }));
  const zoneTrackIds = zoneFilter ? new Set(zoneMusic[zoneFilter] || []) : null;
  const filteredTracks = allTracks.filter(t =>
    (category === 'all' || t.category === category) &&
    (!zoneTrackIds || zoneTrackIds.has(t.id))
  );
  const currentTrack = allTracks.find(t => t.id === currentTrackId);

  // Sync play state
  React.useEffect(() => {
    const update = () => {
      setIsPlaying(audioEngine.isPlaying);
      setProgress(audioEngine.musicCurrentTime);
      setDuration(audioEngine.musicDuration || 0);
    };
    audioEngine.onPlayStateChange(update);
    audioEngine.onTrackChange(update);
    return () => {
      audioEngine.onPlayStateChange(() => {});
      audioEngine.onTrackChange(() => {});
    };
  }, []);

  // Progress timer
  React.useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setProgress(audioEngine.musicCurrentTime);
        setDuration(audioEngine.musicDuration || 0);
      }, 500);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const playTrack = (track: MusicTrack) => {
    setCurrentTrackId(track.id);
    audioEngine.setMusicVolume(volume);
    audioEngine.playTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentTrack) {
      if (filteredTracks.length > 0) playTrack(filteredTracks[0]);
      return;
    }
    if (isPlaying) { audioEngine.pauseMusic(); setIsPlaying(false); }
    else { audioEngine.resumeMusic(); setIsPlaying(true); }
  };

  const handleNext = () => {
    const tracks = filteredTracks.length > 0 ? filteredTracks : allTracks;
    if (tracks.length === 0) return;
    const idx = tracks.findIndex(t => t.id === currentTrackId);
    const next = isShuffle
      ? tracks[Math.floor(Math.random() * tracks.length)]
      : tracks[(idx + 1) % tracks.length];
    playTrack(next);
  };

  const handlePrev = () => {
    const tracks = filteredTracks.length > 0 ? filteredTracks : allTracks;
    if (tracks.length === 0) return;
    const idx = tracks.findIndex(t => t.id === currentTrackId);
    const prev = tracks[idx <= 0 ? tracks.length - 1 : idx - 1];
    playTrack(prev);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioEngine.seekMusic(pct * duration);
    setProgress(pct * duration);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    audioEngine.setMusicVolume(v);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const name = file.name.replace(/\.[^.]+$/, '');
      const guess: MusicTrack['category'] =
        /lofi|lo-fi/i.test(name) ? 'lo-fi' :
        /piano/i.test(name) ? 'minimal-piano' :
        /classic|symphon|sonata|concerto/i.test(name) ? 'classical' :
        /electro|synth|edm/i.test(name) ? 'chill-electronic' :
        /ambient|drone|atmos/i.test(name) ? 'ambient' : 'lo-fi';
      const newTrack: MusicTrack = {
        id: `custom-${Date.now()}-${idx}`,
        title: name,
        artist: 'My Music',
        category: guess,
        src: url,
      };
      addCustomTrack({ ...newTrack, custom: true });
      if (idx === 0) playTrack(newTrack);
    });
    e.target.value = '';
  };

  const handleRename = (trackId: string, currentTitle: string) => {
    const next = prompt('Rename track:', currentTitle);
    if (next && next.trim()) renameTrack(trackId, next.trim());
  };

  const handleAssignZone = (trackId: string) => {
    const z = prompt(`Assign to zone (harbor-row / seabrook-promenade / cedar-heights):`, currentZone);
    if (z && ZONES.find(zo => zo.id === z)) assignTrackToZone(z, trackId);
  };

  const handleSetCategory = (trackId: string) => {
    const cats = ['lo-fi', 'ambient', 'classical', 'chill-electronic', 'minimal-piano'];
    const next = prompt(`Category (${cats.join(', ')}):`, 'lo-fi');
    if (next && cats.includes(next)) {
      // store as rename of category by toggling: simpler — assign via custom track update
      const existing = customTracks.find(t => t.id === trackId);
      if (existing) {
        // remove + readd with new category
        removeCustomTrack(trackId);
        addCustomTrack({ ...existing, category: next as any });
      }
    }
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Now Playing / Visualization */}
      <div className="relative overflow-hidden" style={{
        height: '140px',
        background: currentTrack
          ? `linear-gradient(135deg, hsl(${(currentTrackId?.charCodeAt(0) || 0) * 3 % 360}, 35%, 18%) 0%, hsl(${((currentTrackId?.charCodeAt(1) || 0) * 5 + 180) % 360}, 30%, 12%) 100%)`
          : 'linear-gradient(135deg, hsl(210, 30%, 15%), hsl(220, 25%, 10%))',
      }}>
        {/* Visualization bars */}
        <div className="absolute inset-0 flex items-end justify-center gap-[3px] pb-10 px-8">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-[3px] rounded-t transition-all duration-300" style={{
              height: isPlaying ? `${12 + Math.sin((progress * 0.8 + i * 0.7) * 0.4) * 25 + Math.sin(i * 0.5) * 15}px` : '3px',
              backgroundColor: `hsla(${200 + i * 6}, 55%, 60%, ${isPlaying ? 0.5 : 0.15})`,
            }} />
          ))}
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white/90 text-sm font-medium truncate">{currentTrack?.title || 'No Track Selected'}</p>
          <p className="text-white/40 text-[11px]">{currentTrack?.artist || 'Select a track to play'} {currentTrack ? `· ${currentTrack.category}` : ''}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2.5">
        <div className="relative h-1 bg-muted rounded-full overflow-hidden cursor-pointer" onClick={handleSeek}>
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{formatTime(progress)}</span>
          <span className="text-[10px] text-muted-foreground">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-2">
        <button onClick={() => setIsShuffle(!isShuffle)} className={`p-1 rounded transition-colors ${isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Shuffle size={13} />
        </button>
        <button onClick={handlePrev} className="p-1 text-foreground hover:text-primary transition-colors">
          <SkipBack size={16} />
        </button>
        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:brightness-110 transition-all">
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <button onClick={handleNext} className="p-1 text-foreground hover:text-primary transition-colors">
          <SkipForward size={16} />
        </button>
        <button onClick={() => setIsRepeat(!isRepeat)} className={`p-1 rounded transition-colors ${isRepeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Repeat size={13} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-4 pb-2">
        <Volume2 size={13} className="text-muted-foreground shrink-0" />
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => handleVolumeChange(parseFloat(e.target.value))} className="flex-1 accent-primary h-1" />
        <button onClick={() => fileInputRef.current?.click()} className="text-muted-foreground hover:text-foreground p-1 transition-colors" title="Upload your own MP3s">
          <Upload size={13} />
        </button>
        <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleFileUpload} className="hidden" />
      </div>

      {/* Zone filter */}
      <div className="flex gap-1 px-3 pb-1.5 items-center">
        <span className="text-[9px] text-muted-foreground">Zone:</span>
        <button onClick={() => setZoneFilter(null)} className={`text-[9px] px-2 py-0.5 rounded-full ${!zoneFilter ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
        {ZONES.map(z => (
          <button key={z.id} onClick={() => setZoneFilter(z.id)}
            className={`text-[9px] px-2 py-0.5 rounded-full ${zoneFilter === z.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {z.label} {(zoneMusic[z.id]?.length || 0) > 0 && `(${zoneMusic[z.id].length})`}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 px-3 py-1.5 border-t border-border overflow-x-auto harbor-scrollbar">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
              category === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
            }`}>{cat.label}</button>
        ))}
      </div>

      {/* Track list */}
      <div className="flex-1 border-t border-border overflow-auto harbor-scrollbar">
        {filteredTracks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            <div className="text-center space-y-1">
              <p className="text-lg opacity-30">🎵</p>
              <p>No tracks in this category</p>
              <p className="text-[10px]">Add MP3 files to /public/audio/</p>
            </div>
          </div>
        ) : (
          filteredTracks.map(t => {
            const isCustom = customTracks.some(c => c.id === t.id);
            const inZone = zoneFilter ? (zoneMusic[zoneFilter] || []).includes(t.id) : false;
            return (
              <div key={t.id}
                className={`group w-full text-left px-4 py-2 flex items-center gap-2 text-xs transition-colors ${
                  t.id === currentTrackId ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'
                }`}>
                <button onClick={() => playTrack(t)} className="w-4 text-center text-muted-foreground hover:text-foreground">
                  {t.id === currentTrackId && isPlaying ? '▶' : '♪'}
                </button>
                <button onClick={() => playTrack(t)} className="flex-1 min-w-0 text-left">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{t.artist} · {t.category}{isCustom && ' · uploaded'}</p>
                </button>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleRename(t.id, t.title)} title="Rename" className="p-1 text-muted-foreground hover:text-foreground"><Pencil size={10} /></button>
                  <button onClick={() => zoneFilter && inZone ? unassignTrackFromZone(zoneFilter, t.id) : handleAssignZone(t.id)}
                    title={zoneFilter && inZone ? 'Remove from zone' : 'Assign to zone'}
                    className={`p-1 ${inZone ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}><MapPin size={10} /></button>
                  {isCustom && (
                    <button onClick={() => removeCustomTrack(t.id)} title="Delete" className="p-1 text-muted-foreground hover:text-destructive"><Trash2 size={10} /></button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MusicPlayerApp;
