export interface AudioEffect {
  readonly inputNode: AudioNode
  connect(destination: AudioNode): AudioNode
  setEnabled(isEnabled: boolean): void
  dispose(): void
}

export interface ConfigurableAudioEffect<TOptions> extends AudioEffect {
  configure(options: Partial<TOptions>): void
}
