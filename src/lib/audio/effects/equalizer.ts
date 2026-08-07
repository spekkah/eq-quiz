import { dbToGain } from "@/utils/math";
import type { AudioEffect } from "./types";

type EqualizerOptions = Required<
  Pick<BiquadFilterOptions, "type" | "frequency" | "gain" | "Q">
>;

const DEFAULT_OPTIONS: EqualizerOptions = {
  type: "peaking",
  gain: 12,
  Q: 0.4,
  frequency: 1000,
};

export class EqualizerEffect implements AudioEffect<EqualizerOptions> {
  private filterNode: BiquadFilterNode;
  private gainNode: GainNode;

  config: EqualizerOptions;
  private isEnabled = true;

  constructor(audioCtx: AudioContext, options?: Partial<EqualizerOptions>) {
    this.config = { ...DEFAULT_OPTIONS, ...options };

    this.filterNode = audioCtx.createBiquadFilter();
    this.filterNode.type = "peaking";

    this.gainNode = audioCtx.createGain();

    this.filterNode.connect(this.gainNode);
    this.updateNodes();
  }

  private updateNodes(): void {
    const { type, gain, Q, frequency } = this.config;
    const effectiveGain = this.isEnabled ? gain : 0;

    this.filterNode.type = type;
    this.filterNode.frequency.value = frequency;
    this.filterNode.Q.value = Q;
    this.filterNode.gain.value = effectiveGain;

    this.gainNode.gain.value = dbToGain(-gain);
  }

  connect(destination: AudioNode): void {
    this.gainNode.connect(destination);
  }

  toggle(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
    this.updateNodes();
  }

  configure(newOptions: Partial<EqualizerOptions>): void {
    this.config = { ...this.config, ...newOptions };
    this.updateNodes();
  }

  dispose(): void {
    this.gainNode.disconnect();
    this.filterNode.disconnect();
  }

  get inputNode(): AudioNode {
    return this.filterNode;
  }
}
