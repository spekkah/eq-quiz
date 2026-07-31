import { EQ_GAIN, FREQ_MAX, FREQ_MIN } from "@/utils/constants";
import { dbToGain, randomLogFrequency } from "@/utils/math";

export class AudioEngine {
  private audioCtx: AudioContext;
  private audioBuffers: AudioBuffer[] = [];
  private currentSource: AudioBufferSourceNode | null = null;
  private audioFilterNode: BiquadFilterNode;
  private audioGainNode: GainNode;

  constructor() {
    this.audioCtx = new AudioContext();
    this.audioFilterNode = this.createFilter();

    this.audioGainNode = this.audioCtx.createGain();
    this.audioGainNode.gain.value = dbToGain(-EQ_GAIN);
  }

  private createFilter(): BiquadFilterNode {
    const audioFilter = this.audioCtx.createBiquadFilter();
    audioFilter.type = "peaking";
    audioFilter.Q.value = 1;

    return audioFilter;
  }

  private playAudio(): void {
    this.currentSource = this.audioCtx.createBufferSource();
    this.currentSource.loop = true;

    // TODO: Prevent loading corrupted audio
    if (this.audioBuffers.length < 1) {
      console.error("No audio stems to play");
      return;
    }

    const bufferIdx = Math.floor(this.audioBuffers.length * Math.random());
    this.currentSource.buffer = this.audioBuffers[bufferIdx];

    this.currentSource
      .connect(this.audioFilterNode)
      .connect(this.audioGainNode)
      .connect(this.audioCtx.destination);

    this.currentSource.start();
  }

  // TODO: Prevent loading corrupted audio
  async loadAudio(arrayBuffers: ArrayBuffer[]): Promise<void> {
    const loadPromises = arrayBuffers.map(async (arrayBuffer) => {
      try {
        return await this.audioCtx.decodeAudioData(arrayBuffer);
      } catch (e) {
        return null;
      }
    });

    const results = await Promise.all(loadPromises);

    this.audioBuffers = results.filter(
      (buffer): buffer is AudioBuffer => buffer !== null,
    );
  }

  startRound(): number {
    const targetFreq = Math.round(randomLogFrequency(FREQ_MIN, FREQ_MAX));
    this.audioFilterNode.frequency.value = targetFreq;

    this.audioFilterNode.gain.value = EQ_GAIN;

    if (this.audioCtx.state !== "running") this.audioCtx.resume();
    this.playAudio();

    return targetFreq;
  }

  stopAudio(): void {
    if (!this.currentSource) return;

    this.currentSource.stop();
    this.currentSource.disconnect();

    this.currentSource = null;
  }

  toggleEQ(isEnabled: boolean): void {
    const gain = isEnabled ? EQ_GAIN : 0;
    this.audioFilterNode.gain.value = gain;
  }
}
