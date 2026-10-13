/**
 * Real-time Web Audio API sound synthesis engine for Satori.
 * Generates true binaural beats, harmonic singing bowls, acoustic nature textures,
 * and singing bowl bell chimes entirely in-browser with 100% offline support.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;

  // Master Gain
  private masterGain: GainNode | null = null;

  // Binaural nodes
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private leftPanner: StereoPannerNode | null = null;
  private rightPanner: StereoPannerNode | null = null;

  // Singing bowl drone nodes
  private bowlOsc1: OscillatorNode | null = null;
  private bowlOsc2: OscillatorNode | null = null;
  private bowlGain: GainNode | null = null;
  private bowlLfo: OscillatorNode | null = null;
  private bowlLfoGain: GainNode | null = null;

  // Nature noise nodes
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private riverNode: AudioNode | null = null;
  private riverGain: GainNode | null = null;
  private surfNode: AudioNode | null = null;
  private surfGain: GainNode | null = null;

  // State cache
  private carrierFreq: number = 216;
  private beatFreq: number = 8.0; // Alpha
  private masterVolume: number = 0.7;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create a looped pink/brown noise buffer for natural rain/river/surf
  private createNoiseBuffer(type: 'pink' | 'brown'): AudioBuffer {
    if (!this.ctx) this.initContext();
    const ctx = this.ctx!;
    const bufferSize = ctx.sampleRate * 4; // 4 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      } else {
        // Brown noise
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 1.8;
      }
    }
    return buffer;
  }

  /**
   * Play an authentic Tibetan Singing Bowl chime with harmonic overtones and long decay
   */
  public playSingingBowlChime(fundamentalHz: number = 261.63, durationSeconds: number = 7.0) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Inharmonic ratios typical of forged bronze singing bowls
      const overtoneRatios = [1.0, 2.76, 5.4, 8.93];
      const overtoneGains = [0.65, 0.28, 0.12, 0.05];

      const bowlMaster = ctx.createGain();
      bowlMaster.gain.setValueAtTime(0.7 * this.masterVolume, now);
      bowlMaster.connect(ctx.destination);

      overtoneRatios.forEach((ratio, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Slight micro-detune for acoustic shimmer
        const detune = (idx === 0) ? 0 : (Math.random() * 4 - 2);
        osc.frequency.setValueAtTime(fundamentalHz * ratio + detune, now);
        osc.type = idx === 0 ? 'sine' : 'triangle';

        const initGain = overtoneGains[idx] || 0.1;
        gain.gain.setValueAtTime(initGain, now);
        // Realistic struck strike envelope: immediate attack, exponential decay
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

        osc.connect(gain);
        gain.connect(bowlMaster);

        osc.start(now);
        osc.stop(now + durationSeconds);
      });
    } catch {
      // Audio context might need user gesture
    }
  }

  /**
   * Play a gentle soft bell cue for breath pacing
   */
  public playBreathCue(tone: 'inhale' | 'hold' | 'exhale') {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = {
        inhale: 432,
        hold: 528,
        exhale: 324,
      };

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[tone], now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 * this.masterVolume, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.0);
    } catch {
      // Ignored
    }
  }

  /**
   * Synthesize acoustic meditation notes for the offline Song Studio
   */
  public playAcousticNote(
    freq: number,
    instrument: 'singing-bowl' | 'crystal-chime' | 'flute' | 'ambient-pad' = 'crystal-chime',
    durationSec: number = 2.0
  ) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.35 * this.masterVolume, now);
      master.connect(ctx.destination);

      if (instrument === 'singing-bowl') {
        const ratios = [1.0, 2.76, 5.4];
        const gains = [0.6, 0.25, 0.1];
        ratios.forEach((ratio, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq * ratio, now);
          g.gain.setValueAtTime(gains[idx], now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.5);
          osc.connect(g);
          g.connect(master);
          osc.start(now);
          osc.stop(now + durationSec * 1.5);
        });
      } else if (instrument === 'flute') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        lfo.frequency.setValueAtTime(5.2, now);
        lfoGain.gain.setValueAtTime(3.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.5, now + 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        osc.connect(g);
        g.connect(master);

        osc.start(now);
        lfo.start(now);
        osc.stop(now + durationSec);
        lfo.stop(now + durationSec);
      } else if (instrument === 'ambient-pad') {
        [-3, 0, 4].forEach((detuneCents) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime(detuneCents, now);
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(0.2, now + 0.3);
          g.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.8);
          osc.connect(g);
          g.connect(master);
          osc.start(now);
          osc.stop(now + durationSec * 1.8);
        });
      } else {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.6, now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + durationSec);
      }
    } catch {}
  }

  /**
   * Start or update real-time sound mixer (binaural beats + singing bowl drone + nature textures)
   */
  public startMixer({
    carrierFreq = 216,
    beatFreq = 8.0,
    masterVol = 0.7,
    binauralVol = 0.6,
    bowlVol = 0.4,
    rainVol = 0.2,
    riverVol = 0.0,
    surfVol = 0.2,
  }: {
    carrierFreq?: number;
    beatFreq?: number;
    masterVol?: number;
    binauralVol?: number;
    bowlVol?: number;
    rainVol?: number;
    riverVol?: number;
    surfVol?: number;
  }) {
    this.initContext();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    this.carrierFreq = carrierFreq;
    this.beatFreq = beatFreq;
    this.masterVolume = masterVol;

    // Master bus
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.connect(ctx.destination);
    }
    this.masterGain.gain.setValueAtTime(masterVol, now);

    // 1. Binaural Beats Stereo Channels
    if (!this.leftOsc || !this.rightOsc) {
      this.leftOsc = ctx.createOscillator();
      this.rightOsc = ctx.createOscillator();
      this.binauralGain = ctx.createGain();

      this.leftPanner = ctx.createStereoPanner();
      this.rightPanner = ctx.createStereoPanner();

      this.leftPanner.pan.setValueAtTime(-1.0, now); // 100% Left
      this.rightPanner.pan.setValueAtTime(1.0, now);  // 100% Right

      this.leftOsc.type = 'sine';
      this.rightOsc.type = 'sine';

      this.leftOsc.frequency.setValueAtTime(carrierFreq, now);
      this.rightOsc.frequency.setValueAtTime(carrierFreq + beatFreq, now);

      this.leftOsc.connect(this.leftPanner);
      this.rightOsc.connect(this.rightPanner);

      this.leftPanner.connect(this.binauralGain);
      this.rightPanner.connect(this.binauralGain);

      this.binauralGain.connect(this.masterGain);

      this.leftOsc.start(now);
      this.rightOsc.start(now);
    } else {
      this.leftOsc.frequency.setTargetAtTime(carrierFreq, now, 0.1);
      this.rightOsc.frequency.setTargetAtTime(carrierFreq + beatFreq, now, 0.1);
    }
    this.binauralGain?.gain.setTargetAtTime(binauralVol, now, 0.1);

    // 2. Harmonic Singing Bowl Drone
    if (!this.bowlOsc1 || !this.bowlOsc2) {
      this.bowlOsc1 = ctx.createOscillator();
      this.bowlOsc2 = ctx.createOscillator();
      this.bowlGain = ctx.createGain();

      this.bowlOsc1.type = 'sine';
      this.bowlOsc2.type = 'triangle';

      this.bowlOsc1.frequency.setValueAtTime(carrierFreq * 0.5, now);
      this.bowlOsc2.frequency.setValueAtTime(carrierFreq * 1.5, now);

      // Add gentle LFO for breathing drone shimmer
      this.bowlLfo = ctx.createOscillator();
      this.bowlLfoGain = ctx.createGain();
      this.bowlLfo.frequency.setValueAtTime(0.12, now); // slow 8-second cycle
      this.bowlLfoGain.gain.setValueAtTime(0.08, now);
      this.bowlLfo.connect(this.bowlLfoGain);

      const subGain1 = ctx.createGain();
      const subGain2 = ctx.createGain();
      subGain1.gain.setValueAtTime(0.4, now);
      subGain2.gain.setValueAtTime(0.2, now);

      this.bowlOsc1.connect(subGain1);
      this.bowlOsc2.connect(subGain2);

      subGain1.connect(this.bowlGain);
      subGain2.connect(this.bowlGain);

      this.bowlGain.connect(this.masterGain);

      this.bowlOsc1.start(now);
      this.bowlOsc2.start(now);
      this.bowlLfo.start(now);
    } else {
      this.bowlOsc1.frequency.setTargetAtTime(carrierFreq * 0.5, now, 0.2);
      this.bowlOsc2.frequency.setTargetAtTime(carrierFreq * 1.5, now, 0.2);
    }
    this.bowlGain?.gain.setTargetAtTime(bowlVol, now, 0.1);

    // 3. Nature Layers (Rain, River, Ocean Surf)
    if (!this.rainNode) {
      // Rain
      const rainBuffer = this.createNoiseBuffer('pink');
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(1400, now);
      rainFilter.Q.setValueAtTime(0.8, now);

      this.rainGain = ctx.createGain();
      rainSource.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      rainSource.start(now);
      this.rainNode = rainSource;

      // River
      const riverBuffer = this.createNoiseBuffer('brown');
      const riverSource = ctx.createBufferSource();
      riverSource.buffer = riverBuffer;
      riverSource.loop = true;

      const riverFilter = ctx.createBiquadFilter();
      riverFilter.type = 'lowpass';
      riverFilter.frequency.setValueAtTime(650, now);

      this.riverGain = ctx.createGain();
      riverSource.connect(riverFilter);
      riverFilter.connect(this.riverGain);
      this.riverGain.connect(this.masterGain);
      riverSource.start(now);
      this.riverNode = riverSource;

      // Ocean Surf
      const surfBuffer = this.createNoiseBuffer('brown');
      const surfSource = ctx.createBufferSource();
      surfSource.buffer = surfBuffer;
      surfSource.loop = true;

      const surfFilter = ctx.createBiquadFilter();
      surfFilter.type = 'lowpass';
      surfFilter.frequency.setValueAtTime(380, now);

      // Surf swell LFO
      const surfLfo = ctx.createOscillator();
      const surfLfoGain = ctx.createGain();
      surfLfo.frequency.setValueAtTime(0.08, now); // ~12.5s surf surge
      surfLfoGain.gain.setValueAtTime(0.18, now);

      this.surfGain = ctx.createGain();
      surfLfo.connect(surfLfoGain);
      surfLfoGain.connect(this.surfGain.gain);

      surfSource.connect(surfFilter);
      surfFilter.connect(this.surfGain);
      this.surfGain.connect(this.masterGain);

      surfSource.start(now);
      surfLfo.start(now);
      this.surfNode = surfSource;
    }

    this.rainGain?.gain.setTargetAtTime(rainVol, now, 0.1);
    this.riverGain?.gain.setTargetAtTime(riverVol, now, 0.1);
    this.surfGain?.gain.setTargetAtTime(surfVol, now, 0.1);

    this.isRunning = true;
  }

  public updateParameters(params: {
    carrierFreq?: number;
    beatFreq?: number;
    masterVol?: number;
    binauralVol?: number;
    bowlVol?: number;
    rainVol?: number;
    riverVol?: number;
    surfVol?: number;
  }) {
    if (!this.isRunning) return;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (params.masterVol !== undefined && this.masterGain) {
      this.masterVolume = params.masterVol;
      this.masterGain.gain.setTargetAtTime(params.masterVol, now, 0.05);
    }
    if (params.carrierFreq !== undefined && this.leftOsc && this.rightOsc) {
      this.carrierFreq = params.carrierFreq;
      this.leftOsc.frequency.setTargetAtTime(this.carrierFreq, now, 0.05);
      this.rightOsc.frequency.setTargetAtTime(this.carrierFreq + this.beatFreq, now, 0.05);
      if (this.bowlOsc1 && this.bowlOsc2) {
        this.bowlOsc1.frequency.setTargetAtTime(this.carrierFreq * 0.5, now, 0.1);
        this.bowlOsc2.frequency.setTargetAtTime(this.carrierFreq * 1.5, now, 0.1);
      }
    }
    if (params.beatFreq !== undefined && this.rightOsc) {
      this.beatFreq = params.beatFreq;
      this.rightOsc.frequency.setTargetAtTime(this.carrierFreq + this.beatFreq, now, 0.05);
    }
    if (params.binauralVol !== undefined && this.binauralGain) {
      this.binauralGain.gain.setTargetAtTime(params.binauralVol, now, 0.05);
    }
    if (params.bowlVol !== undefined && this.bowlGain) {
      this.bowlGain.gain.setTargetAtTime(params.bowlVol, now, 0.05);
    }
    if (params.rainVol !== undefined && this.rainGain) {
      this.rainGain.gain.setTargetAtTime(params.rainVol, now, 0.05);
    }
    if (params.riverVol !== undefined && this.riverGain) {
      this.riverGain.gain.setTargetAtTime(params.riverVol, now, 0.05);
    }
    if (params.surfVol !== undefined && this.surfGain) {
      this.surfGain.gain.setTargetAtTime(params.surfVol, now, 0.05);
    }
  }

  public stopMixer() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      // Gentle fade out over 0.6s to avoid clicks
      this.masterGain.gain.setTargetAtTime(0, now, 0.2);
      setTimeout(() => {
        try {
          this.leftOsc?.stop();
          this.rightOsc?.stop();
          this.bowlOsc1?.stop();
          this.bowlOsc2?.stop();
          this.bowlLfo?.stop();
          (this.rainNode as AudioBufferSourceNode)?.stop();
          (this.riverNode as AudioBufferSourceNode)?.stop();
          (this.surfNode as AudioBufferSourceNode)?.stop();
        } catch {
          // Ignored
        }
        this.leftOsc = null;
        this.rightOsc = null;
        this.binauralGain = null;
        this.bowlOsc1 = null;
        this.bowlOsc2 = null;
        this.bowlGain = null;
        this.bowlLfo = null;
        this.rainNode = null;
        this.rainGain = null;
        this.riverNode = null;
        this.riverGain = null;
        this.surfNode = null;
        this.surfGain = null;
        this.masterGain = null;
        this.isRunning = false;
      }, 500);
    } else {
      this.isRunning = false;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

export const soundEngine = new AudioEngine();
