// Three-layer audio engine: Ambient, Music, SFX

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: 'lo-fi' | 'ambient' | 'classical' | 'chill-electronic' | 'minimal-piano';
  src: string;
}

export const MUSIC_LIBRARY: MusicTrack[] = [
  // Ambient
  { id: 'calm-5', title: 'Harbor Mist', artist: 'Harbor Radio', category: 'ambient', src: '/audio/calm-ambient-5.mp3' },
  { id: 'calm-6', title: 'Coastal Drift', artist: 'Harbor Radio', category: 'ambient', src: '/audio/calm-ambient-6.mp3' },
  // Chill Electronic
  { id: 'chill-1', title: 'Neon Shores', artist: 'Harbor Radio', category: 'chill-electronic', src: '/audio/chill-electronic-1.mp3' },
  { id: 'chill-2', title: 'Digital Tide', artist: 'Harbor Radio', category: 'chill-electronic', src: '/audio/chill-electronic-2.mp3' },
  // Lo-Fi
  { id: 'lofi-1', title: 'Morning Code', artist: 'Harbor Radio', category: 'lo-fi', src: '/audio/lo-fi-1.mp3' },
  { id: 'lofi-3', title: 'Late Night Debug', artist: 'Harbor Radio', category: 'lo-fi', src: '/audio/lo-fi-3.mp3' },
  // Minimal Piano
  { id: 'piano-2', title: 'Studio Keys', artist: 'Harbor Radio', category: 'minimal-piano', src: '/audio/minimal-piano-2.mp3' },
  // Classical (Tchaikovsky - The Seasons)
  { id: 'tchaikovsky-jan', title: 'The Seasons — January', artist: 'P.I. Tchaikovsky', category: 'classical', src: '/audio/tchaikovsky-the-seasons-01-january.mp3' },
  { id: 'tchaikovsky-feb', title: 'The Seasons — February', artist: 'P.I. Tchaikovsky', category: 'classical', src: '/audio/tchaikovsky-the-seasons-02-february.mp3' },
  { id: 'tchaikovsky-mar', title: 'The Seasons — March', artist: 'P.I. Tchaikovsky', category: 'classical', src: '/audio/tchaikovsky-the-seasons-03-march.mp3' },
];

class AudioEngine {
  // === LAYER 1: Ambient ===
  private ambientAudio: HTMLAudioElement | null = null;
  private _ambientVolume = 0.15;
  private _ambientEnabled = false;

  // === LAYER 2: Music ===
  private musicAudio: HTMLAudioElement | null = null;
  private _musicVolume = 0.3;
  private _musicEnabled = true;
  private _currentTrack: MusicTrack | null = null;
  private _onTrackChange: (() => void) | null = null;
  private _onPlayStateChange: (() => void) | null = null;

  // === LAYER 3: SFX ===
  private sfxCtx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private _sfxVolume = 0.4;
  private _sfxEnabled = true;

  // Master
  private _masterVolume = 0.3;

  // Ambient procedural
  private ambientOscNodes: OscillatorNode[] = [];
  private ambientCtx: AudioContext | null = null;
  private ambientMasterGain: GainNode | null = null;

  // === Listeners ===
  onTrackChange(cb: () => void) { this._onTrackChange = cb; }
  onPlayStateChange(cb: () => void) { this._onPlayStateChange = cb; }

  get currentTrack() { return this._currentTrack; }
  get isPlaying() { return this.musicAudio ? !this.musicAudio.paused : false; }
  get musicCurrentTime() { return this.musicAudio?.currentTime || 0; }
  get musicDuration() { return this.musicAudio?.duration || 0; }

  // === Master ===
  setMasterVolume(v: number) {
    this._masterVolume = v;
    this.updateVolumes();
  }

  private updateVolumes() {
    if (this.ambientMasterGain) this.ambientMasterGain.gain.value = this._ambientVolume * this._masterVolume;
    if (this.musicAudio) this.musicAudio.volume = this._musicVolume * this._masterVolume;
    if (this.sfxGain) this.sfxGain.gain.value = this._sfxVolume * this._masterVolume;
  }

  // === LAYER 1: Ambient ===
  setAmbientEnabled(e: boolean) {
    this._ambientEnabled = e;
    if (e) this.startAmbient();
    else this.stopAmbient();
  }

  setAmbientVolume(v: number) {
    this._ambientVolume = v;
    if (this.ambientMasterGain) this.ambientMasterGain.gain.value = v * this._masterVolume;
  }

  startAmbient() {
    if (!this._ambientEnabled || this.ambientCtx) return;
    this.ambientCtx = new AudioContext();
    this.ambientMasterGain = this.ambientCtx.createGain();
    this.ambientMasterGain.gain.value = this._ambientVolume * this._masterVolume;
    this.ambientMasterGain.connect(this.ambientCtx.destination);

    // Deep ocean rumble
    const osc1 = this.ambientCtx.createOscillator();
    osc1.type = 'sine'; osc1.frequency.value = 55;
    const f1 = this.ambientCtx.createBiquadFilter();
    f1.type = 'lowpass'; f1.frequency.value = 100;
    const g1 = this.ambientCtx.createGain(); g1.gain.value = 0.25;
    osc1.connect(f1).connect(g1).connect(this.ambientMasterGain);

    const lfo1 = this.ambientCtx.createOscillator();
    lfo1.type = 'sine'; lfo1.frequency.value = 0.06;
    const lg1 = this.ambientCtx.createGain(); lg1.gain.value = 10;
    lfo1.connect(lg1).connect(osc1.frequency);

    // Mid wash
    const osc2 = this.ambientCtx.createOscillator();
    osc2.type = 'sine'; osc2.frequency.value = 110;
    const f2 = this.ambientCtx.createBiquadFilter();
    f2.type = 'lowpass'; f2.frequency.value = 160;
    const g2 = this.ambientCtx.createGain(); g2.gain.value = 0.08;
    osc2.connect(f2).connect(g2).connect(this.ambientMasterGain);

    const lfo2 = this.ambientCtx.createOscillator();
    lfo2.type = 'sine'; lfo2.frequency.value = 0.1;
    const lg2 = this.ambientCtx.createGain(); lg2.gain.value = 15;
    lfo2.connect(lg2).connect(osc2.frequency);

    // High shimmer
    const osc3 = this.ambientCtx.createOscillator();
    osc3.type = 'sine'; osc3.frequency.value = 880;
    const f3 = this.ambientCtx.createBiquadFilter();
    f3.type = 'bandpass'; f3.frequency.value = 900; f3.Q.value = 5;
    const g3 = this.ambientCtx.createGain(); g3.gain.value = 0.015;
    osc3.connect(f3).connect(g3).connect(this.ambientMasterGain);

    const lfo3 = this.ambientCtx.createOscillator();
    lfo3.type = 'sine'; lfo3.frequency.value = 0.15;
    const lg3 = this.ambientCtx.createGain(); lg3.gain.value = 80;
    lfo3.connect(lg3).connect(osc3.frequency);

    [osc1, osc2, osc3, lfo1, lfo2, lfo3].forEach(o => o.start());
    this.ambientOscNodes = [osc1, osc2, osc3, lfo1, lfo2, lfo3];
  }

  stopAmbient() {
    this.ambientOscNodes.forEach(o => { try { o.stop(); } catch {} });
    this.ambientOscNodes = [];
    if (this.ambientCtx) {
      this.ambientCtx.close().catch(() => {});
      this.ambientCtx = null;
      this.ambientMasterGain = null;
    }
  }

  // === LAYER 2: Music ===
  setMusicEnabled(e: boolean) {
    this._musicEnabled = e;
    if (!e) this.pauseMusic();
  }

  setMusicVolume(v: number) {
    this._musicVolume = v;
    if (this.musicAudio) this.musicAudio.volume = v * this._masterVolume;
  }

  playTrack(track: MusicTrack) {
    if (!this._musicEnabled) return;
    this._currentTrack = track;
    if (!this.musicAudio) {
      this.musicAudio = new Audio();
      this.musicAudio.addEventListener('ended', () => this._onPlayStateChange?.());
      this.musicAudio.addEventListener('error', () => console.warn(`Audio not found: ${track.src}`));
    }
    this.musicAudio.src = track.src;
    this.musicAudio.volume = this._musicVolume * this._masterVolume;
    this.musicAudio.loop = true;
    this.musicAudio.play().catch(() => {});
    this._onTrackChange?.();
    this._onPlayStateChange?.();
  }

  pauseMusic() {
    this.musicAudio?.pause();
    this._onPlayStateChange?.();
  }

  resumeMusic() {
    if (!this._musicEnabled) return;
    this.musicAudio?.play().catch(() => {});
    this._onPlayStateChange?.();
  }

  seekMusic(time: number) {
    if (this.musicAudio) this.musicAudio.currentTime = time;
  }

  // === LAYER 3: SFX ===
  setSfxEnabled(e: boolean) { this._sfxEnabled = e; }
  setSfxVolume(v: number) {
    this._sfxVolume = v;
    if (this.sfxGain) this.sfxGain.gain.value = v * this._masterVolume;
  }

  private ensureSfxCtx() {
    if (!this.sfxCtx) {
      this.sfxCtx = new AudioContext();
      this.sfxGain = this.sfxCtx.createGain();
      this.sfxGain.gain.value = this._sfxVolume * this._masterVolume;
      this.sfxGain.connect(this.sfxCtx.destination);
    }
    if (this.sfxCtx.state === 'suspended') this.sfxCtx.resume();
  }

  private playSfxTone(freq: number, type: OscillatorType, duration: number, volume = 0.2) {
    if (!this._sfxEnabled) return;
    this.ensureSfxCtx();
    if (!this.sfxCtx || !this.sfxGain) return;
    const osc = this.sfxCtx.createOscillator();
    osc.type = type; osc.frequency.value = freq;
    const g = this.sfxCtx.createGain();
    g.gain.setValueAtTime(volume, this.sfxCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.sfxCtx.currentTime + duration);
    osc.connect(g).connect(this.sfxGain);
    osc.start();
    osc.stop(this.sfxCtx.currentTime + duration);
  }

  playChime() { this.playSfxTone(880, 'sine', 0.4, 0.12); }
  playClick() { this.playSfxTone(600, 'square', 0.04, 0.04); }
  playKeystroke() { this.playSfxTone(300 + Math.random() * 200, 'triangle', 0.03, 0.02); }

  playSuccess() {
    if (!this._sfxEnabled) return;
    this.ensureSfxCtx();
    if (!this.sfxCtx || !this.sfxGain) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = this.sfxCtx!.createOscillator();
      osc.type = 'sine'; osc.frequency.value = freq;
      const g = this.sfxCtx!.createGain();
      g.gain.setValueAtTime(0, this.sfxCtx!.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.1, this.sfxCtx!.currentTime + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, this.sfxCtx!.currentTime + i * 0.12 + 0.25);
      osc.connect(g).connect(this.sfxGain!);
      osc.start(this.sfxCtx!.currentTime + i * 0.12);
      osc.stop(this.sfxCtx!.currentTime + i * 0.12 + 0.25);
    });
  }

  playError() { this.playSfxTone(150, 'sawtooth', 0.15, 0.04); }

  playWindowOpen() {
    if (!this._sfxEnabled) return;
    this.ensureSfxCtx();
    if (!this.sfxCtx || !this.sfxGain) return;
    const osc = this.sfxCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.sfxCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.sfxCtx.currentTime + 0.08);
    const g = this.sfxCtx.createGain();
    g.gain.setValueAtTime(0.04, this.sfxCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.sfxCtx.currentTime + 0.12);
    osc.connect(g).connect(this.sfxGain);
    osc.start();
    osc.stop(this.sfxCtx.currentTime + 0.12);
  }

  playLevelComplete() {
    if (!this._sfxEnabled) return;
    this.ensureSfxCtx();
    if (!this.sfxCtx || !this.sfxGain) return;
    [523, 587, 659, 784, 880, 1047].forEach((freq, i) => {
      const osc = this.sfxCtx!.createOscillator();
      osc.type = 'sine'; osc.frequency.value = freq;
      const g = this.sfxCtx!.createGain();
      g.gain.setValueAtTime(0, this.sfxCtx!.currentTime + i * 0.1);
      g.gain.linearRampToValueAtTime(0.08, this.sfxCtx!.currentTime + i * 0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, this.sfxCtx!.currentTime + i * 0.1 + 0.35);
      osc.connect(g).connect(this.sfxGain!);
      osc.start(this.sfxCtx!.currentTime + i * 0.1);
      osc.stop(this.sfxCtx!.currentTime + i * 0.1 + 0.35);
    });
  }

  playChatPing() { this.playSfxTone(1200, 'sine', 0.08, 0.06); }
  playForumTick() { this.playSfxTone(400, 'triangle', 0.05, 0.03); }
}

export const audioEngine = new AudioEngine();
