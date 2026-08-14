import { createContext, use } from 'react'

export const AudioContextCtx = createContext<AudioContext | null>(null)

export const useAudioContext = () => {
  const ctx = use(AudioContextCtx)

  if (!ctx)
    throw new Error(
      'useAudioContext must be used within an AudioContextProvider',
    )

  return ctx
}
