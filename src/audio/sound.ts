/**
 * OFFHAND OS — synthesized sound.
 *
 * 100% Web Audio (no asset files). Muted by default: nothing is created or
 * played until the user enables sound via the HUD (a real user gesture, so no
 * autoplay-policy issues). Every cue is a tiny synth voice.
 */

class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = false;

  /** Create/resume the audio graph (called on a user gesture). */
  private ensure() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setEnabled(b: boolean) {
    this.enabled = b;
    if (b) this.ensure();
  }

  private get ok() {
    return this.enabled && this.ctx && this.master;
  }

  /** One synth voice with an exponential decay envelope. */
  private voice(
    freq: number,
    dur: number,
    type: OscillatorType = "square",
    peak = 0.2,
    slideTo?: number
  ) {
    if (!this.ok || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, peak = 0.15) {
    if (!this.ok || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.value = peak;
    const filt = this.ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 900;
    src.connect(filt);
    filt.connect(g);
    g.connect(this.master);
    src.start(t);
  }

  /* --- Cues --- */
  tick() {
    this.voice(1320, 0.03, "square", 0.05);
  }
  thunk() {
    this.voice(150, 0.16, "sine", 0.28, 70);
    this.noise(0.1, 0.12);
  }
  dive() {
    this.voice(600, 0.4, "sawtooth", 0.16, 90);
    this.voice(70, 0.5, "sine", 0.18);
  }
  hover() {
    this.voice(2000, 0.02, "square", 0.03);
  }
  beep() {
    this.voice(880, 0.05, "square", 0.08);
  }
  powerOn() {
    this.voice(180, 0.5, "sawtooth", 0.16, 900);
    setTimeout(() => this.beep(), 220);
    setTimeout(() => this.voice(1320, 0.08, "square", 0.1), 360);
  }
  chord() {
    [262, 330, 392, 523].forEach((f, i) =>
      setTimeout(() => this.voice(f, 0.6, "sawtooth", 0.1), i * 40)
    );
  }
}

export const sound = new Sound();
