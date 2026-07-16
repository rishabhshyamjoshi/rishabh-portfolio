export class AudioController {
  private static instance: AudioController;
  public context: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  
  public isInitialized = false;
  public isMuted = true; // Start muted — user must opt-in

  private constructor() {}

  public static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  public async init() {
    if (this.isInitialized) return;
    
    try {
      // 1. Create Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContextClass();
      
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }
      
      // 2. Setup Analyser, Filter & Master Gain
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      this.filterNode = this.context.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 20000; // Wide open by default
      
      this.pannerNode = this.context.createStereoPanner();
      this.pannerNode.pan.value = 0;
      
      this.gainNode = this.context.createGain();
      this.gainNode.gain.value = 0; // Start silent since isMuted = true
      
      this.analyser.connect(this.filterNode);
      this.filterNode.connect(this.pannerNode);
      this.pannerNode.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);

      // 3. Fetch and Decode Audio Data
      const response = await fetch('/ambient.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      
      this.isInitialized = true;

      // 4. Start playback immediately (gain is 0 so it's silent)
      this.startSource();

    } catch (e) {
      console.error("Critical Audio Engine Error:", e);
    }
  }

  private startSource() {
    if (!this.context || !this.audioBuffer || !this.analyser) return;
    
    // Stop existing source if any
    if (this.sourceNode) {
      try { this.sourceNode.stop(); } catch(e) {}
    }

    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.loop = true;
    this.sourceNode.connect(this.analyser);
    this.sourceNode.start(0);
  }

  public async toggleMute() {
    // If not initialized yet, do it now (user gesture guarantees context will work)
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (!this.context || !this.gainNode) return this.isMuted;
    
    // Resume context if suspended (needs user gesture)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    
    this.isMuted = !this.isMuted;
    
    const now = this.context.currentTime;
    if (this.isMuted) {
      // Smooth fade out
      this.gainNode.gain.setTargetAtTime(0, now, 0.1);
    } else {
      // Smooth fade in
      this.gainNode.gain.setTargetAtTime(1.0, now, 0.1);
      
      // Make sure source is running
      if (!this.sourceNode) {
        this.startSource();
      }
    }
    
    return this.isMuted;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser || this.isMuted) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public applyMovementEffect(intensity: number) {
    if (!this.context || !this.filterNode || this.isMuted) return;
    
    const targetFreq = 20000 - (19500 * intensity);
    this.filterNode.frequency.setTargetAtTime(targetFreq, this.context.currentTime, 0.1);
  }

  public setPan(panValue: number) {
    if (!this.context || !this.pannerNode || this.isMuted) return;
    
    // Clamp between -1 (full left) and 1 (full right)
    const clampedPan = Math.max(-1, Math.min(1, panValue));
    
    // Smooth transition
    this.pannerNode.pan.setTargetAtTime(clampedPan, this.context.currentTime, 0.1);
  }

  public playHoverSound() {
    if (!this.context || this.isMuted) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  public playClickSound() {
    if (!this.context || this.isMuted) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }
}
