import { DEFAULT_USER_FREQ, PARAM_SMOOTHING_TIME } from '@/utils/constants'
import { dbToGain } from '@/utils/math'

import type { ConfigurableAudioEffect } from './types'

type EqualizerOptions = Required<
  Pick<BiquadFilterOptions, 'type' | 'frequency' | 'gain' | 'Q'>
> & { outGain: number }

const DEFAULT_OPTIONS: EqualizerOptions = {
  type: 'peaking',
  gain: 0,
  outGain: 0,
  Q: 1,
  frequency: DEFAULT_USER_FREQ,
}

export class EqualizerEffect
  implements ConfigurableAudioEffect<EqualizerOptions>
{
  private readonly audioCtx: AudioContext

  private readonly filterNode: BiquadFilterNode
  private readonly gainNode: GainNode

  private config: EqualizerOptions
  private isEnabled = true

  constructor(audioCtx: AudioContext, options?: Partial<EqualizerOptions>) {
    this.audioCtx = audioCtx
    this.config = { ...DEFAULT_OPTIONS, ...options }

    this.filterNode = audioCtx.createBiquadFilter()
    this.gainNode = audioCtx.createGain()
    this.filterNode.connect(this.gainNode)

    this.updateNodes()
  }

  private smoothParam(param: AudioParam, value: number): void {
    if (Math.abs(param.value - value) < 1e-6) return

    const now = this.audioCtx.currentTime
    param.linearRampToValueAtTime(value, now + PARAM_SMOOTHING_TIME)
  }

  private updateNodes(): void {
    const { type, gain, outGain, Q, frequency } = this.config
    const effectiveGain = this.isEnabled ? gain : 0

    this.filterNode.type = type
    this.smoothParam(this.filterNode.frequency, frequency)
    this.smoothParam(this.filterNode.Q, Q)
    this.smoothParam(this.filterNode.gain, effectiveGain)
    this.smoothParam(this.gainNode.gain, dbToGain(outGain))
  }

  connect(destination: AudioNode): AudioNode {
    this.gainNode.connect(destination)
    return destination
  }

  setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled
    this.updateNodes()
  }

  configure(newOptions: Partial<EqualizerOptions>): void {
    this.config = { ...this.config, ...newOptions }
    this.updateNodes()
  }

  dispose(): void {
    this.gainNode.disconnect()
    this.filterNode.disconnect()
  }

  get inputNode(): AudioNode {
    return this.filterNode
  }
}
