import { useCallback, useMemo, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { type AudioFile, db } from '@/lib/db'
import { shuffleArray } from '@/utils/helpers'

export const useAudioLibrary = (audioCtx: AudioContext) => {
  const audioFiles = useLiveQuery(
    async () => await db.audioFiles.toArray(),
    [],
    [] as AudioFile[],
  )

  const audioFilesShuffled = useMemo(
    () => shuffleArray(audioFiles),
    [audioFiles],
  )

  const audioFileIdxRef = useRef(0)
  const cacheRef = useRef(new Map<number, AudioBuffer>())

  const getNextAudioBuffer =
    useCallback(async (): Promise<AudioBuffer | null> => {
      if (audioFilesShuffled.length < 1) return null
      if (audioFileIdxRef.current >= audioFilesShuffled.length)
        audioFileIdxRef.current = 0

      const audioFile = audioFilesShuffled[audioFileIdxRef.current]
      audioFileIdxRef.current =
        (audioFileIdxRef.current + 1) % audioFilesShuffled.length

      if (!audioFile) return null

      const cachedBuffer = cacheRef.current.get(audioFile.id)
      if (cachedBuffer) return cachedBuffer

      try {
        const audioData = await audioFile.blob.arrayBuffer()
        const audioBuffer = await audioCtx.decodeAudioData(audioData)
        cacheRef.current.set(audioFile.id, audioBuffer)

        return audioBuffer
      } catch (e) {
        throw new Error('Failed to decode audio', { cause: e })
      }
    }, [audioCtx, audioFilesShuffled])

  return { getNextAudioBuffer, hasFiles: audioFilesShuffled.length > 0 }
}
