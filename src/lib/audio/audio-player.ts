import type { AudioEffect } from './effects/types'

export class AudioPlayer {
  private audioCtx: AudioContext
  private effect: AudioEffect
  private currentSource: AudioBufferSourceNode | null = null
  private splitter: ChannelSplitterNode
  private merger: ChannelMergerNode

  constructor(audioCtx: AudioContext, effect: AudioEffect) {
    this.audioCtx = audioCtx
    this.effect = effect
    this.splitter = audioCtx.createChannelSplitter(2)
    this.merger = audioCtx.createChannelMerger(1)
    this.effect.connect(this.splitter)
    this.splitter.connect(this.merger)
    this.merger.connect(this.audioCtx.destination)
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

  dispose() {
    this.stop()
  }
}
