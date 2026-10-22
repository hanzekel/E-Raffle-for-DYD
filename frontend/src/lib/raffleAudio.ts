// Web Audio API synthesizer for raffle sound effects with zero external files
class RaffleAudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private whooshGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private oscNode: OscillatorNode | null = null;

  constructor() {
    const saved = localStorage.getItem('dyd_raffle_muted');
    this.isMuted = saved === 'true';
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('dyd_raffle_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopDrawStorm();
    }
    return this.isMuted;
  }

  // Play accelerating wind vortex & paper fluttering sound
  public startDrawStorm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopDrawStorm();

    const now = this.ctx.currentTime;

    // Filtered pink-ish noise buffer for rushing wind and paper flutter
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.18;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Resonant bandpass filter sweeping upwards as wind accelerates
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 3.2);
    filter.Q.setValueAtTime(2.5, now);

    // Deep sub-bass hum for drama
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 3.0);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.08, now);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.35, now + 0.6);
    masterGain.gain.setValueAtTime(0.35, now + 2.8);
    masterGain.gain.linearRampToValueAtTime(0.05, now + 3.5);

    noise.connect(filter);
    filter.connect(masterGain);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    masterGain.connect(this.ctx.destination);

    noise.start();
    osc.start();

    this.noiseNode = noise;
    this.oscNode = osc;
    this.whooshGain = masterGain;
  }

  // Gracefully stop the wind storm
  public stopDrawStorm() {
    if (!this.ctx || !this.whooshGain) return;
    try {
      const now = this.ctx.currentTime;
      this.whooshGain.gain.cancelScheduledValues(now);
      this.whooshGain.gain.linearRampToValueAtTime(0.001, now + 0.2);
      setTimeout(() => {
        if (this.noiseNode) {
          (this.noiseNode as any).stop?.();
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        if (this.oscNode) {
          this.oscNode.stop();
          this.oscNode.disconnect();
          this.oscNode = null;
        }
        this.whooshGain = null;
      }, 250);
    } catch {
      // Safe fallback
    }
  }

  // Celebratory victory fanfare chords on ticket landing
  public playCelebrationFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Major chord triumphant arpeggio: C5, E5, G5, C6
    const freqs = [523.25, 659.25, 783.99, 1046.50];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === freqs.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.001, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 1.5);
    });
  }
}

export const raffleAudio = new RaffleAudioController();

