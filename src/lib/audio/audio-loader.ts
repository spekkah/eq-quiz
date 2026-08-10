export class AudioLoader {
  private audioCtx: AudioContext

  constructor(audioCtx: AudioContext) {
    this.audioCtx = audioCtx
  }

  async loadAudio(arrayBuffers: ArrayBuffer[]): Promise<AudioBuffer[]> {
    const loadPromises = arrayBuffers.map(async (arrayBuffer) => {
      try {
        return await this.audioCtx.decodeAudioData(arrayBuffer)
      } catch (e) {
        console.error(e)
        return null
      }
    })

    const results = await Promise.all(loadPromises)

    return results.filter((buffer): buffer is AudioBuffer => buffer !== null)
  }
}
