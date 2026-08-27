import { createContext, use } from 'react'

import type { AudioEngine } from '@/lib/audio/audio-engine'

export const AudioEngineCtx = createContext<AudioEngine | null>(null)

export const useAudioEngine = () => {
  const ctx = use(AudioEngineCtx)

  if (!ctx)
    throw new Error('useAudioEngine must be used within an AudioEngineProvider')

  return ctx
}
