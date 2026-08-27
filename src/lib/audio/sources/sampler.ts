import type { AudioSource } from '../types'

export interface SamplerConfig {
  buffer: AudioBuffer
  isLooping: boolean
}

export class Sampler implements AudioSource<SamplerConfig> {
  private readonly ctx: AudioContext
  private readonly outNode: GainNode

  private currentSource: AudioBufferSourceNode | null = null
  private buffer: AudioBuffer | null = null

  private isLooping = false

  constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.outNode = ctx.createGain()
  }

  configure(config: Partial<SamplerConfig>): void {
    const { buffer, isLooping } = config

    if (buffer !== undefined) this.buffer = buffer
    if (isLooping !== undefined) this.isLooping = isLooping
  }

  play(): void {
    this.stop()

    this.currentSource = this.ctx.createBufferSource()
    this.currentSource.loop = this.isLooping
    this.currentSource.buffer = this.buffer

    this.currentSource.connect(this.outNode)
    this.currentSource.start()
  }

  stop(): void {
    if (!this.currentSource) return

    this.currentSource.stop()
    this.currentSource.disconnect()

    this.currentSource = null
  }

  connect(destinationNode: AudioNode): AudioNode {
    return this.outNode.connect(destinationNode)
  }
  disconnect(): void {
    this.outNode.disconnect()
  }
}
