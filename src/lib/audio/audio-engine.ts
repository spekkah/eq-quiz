import { EqualizerEffect } from './effects/equalizer'
import { Sampler } from './sources/sampler'

export class AudioEngine {
  private readonly ctx: AudioContext
  private sampler: Sampler
  private effect: EqualizerEffect

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.sampler = new Sampler(ctx)
    this.sampler.configure({ isLooping: true })
    this.effect = new EqualizerEffect(ctx)

    this.sampler.connect(this.effect.inputNode)
    this.effect.connect(ctx.destination)
  }

  async decodeAudioData(blob: Blob): Promise<AudioBuffer> {
    const audioData = await blob.arrayBuffer()
    const audioBuffer = await this.ctx.decodeAudioData(audioData)
    return audioBuffer
  }

  play(buffer: AudioBuffer) {
    this.sampler.configure({ buffer })
    this.sampler.play()
  }

  stop() {
    this.sampler.stop()
  }

  configureEffect(config: Parameters<EqualizerEffect['configure']>[0]) {
    this.effect.configure(config)
  }

  setEffectEnabled(isEnabled: boolean) {
    this.effect.setEnabled(isEnabled)
  }
}
