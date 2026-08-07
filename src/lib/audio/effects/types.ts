export interface AudioEffect<TOptions = unknown> {
  readonly inputNode: AudioNode;
  configure(options: Partial<TOptions>): void;
  connect(destination: AudioNode): void;
  toggle(isEnabled: boolean): void;
  dispose(): void;
}
