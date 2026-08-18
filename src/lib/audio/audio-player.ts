import type { AudioEffect } from './effects/types'

export class AudioPlayer {
  private readonly audioCtx: AudioContext

  private readonly effect: AudioEffect
  private currentSource: AudioBufferSourceNode | null = null

  // Down-mix to mono (0.5·L + 0.5·R under the 'speakers' interpretation) so
  // training focuses on frequency content rather than the stereo image.
  private readonly downmix: GainNode

  constructor(audioCtx: AudioContext, effect: AudioEffect) {
    this.audioCtx = audioCtx
    this.effect = effect

    this.downmix = new GainNode(audioCtx, {
      channelCount: 1,
      channelCountMode: 'explicit',
      channelInterpretation: 'speakers',
    })

    this.effect.connect(this.downmix).connect(this.audioCtx.destination)
  }

  play(buffer: AudioBuffer): void {
    this.stop()

    this.currentSource = this.audioCtx.createBufferSource()
    this.currentSource.loop = true
    this.currentSource.buffer = buffer

    this.currentSource.connect(this.effect.inputNode)
    this.currentSource.start()
  }

  stop(): void {
    if (!this.currentSource) return

    this.currentSource.stop()
    this.currentSource.disconnect()

    this.currentSource = null
  }

  dispose(): void {
    this.stop()
    this.downmix.disconnect()
  }
}
