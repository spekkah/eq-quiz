export interface AudioSource<TConfig = unknown> {
  configure: (config: TConfig) => void
  play: () => void
  stop: () => void
  connect: (destinationNode: AudioNode) => AudioNode
  disconnect: () => void
}
