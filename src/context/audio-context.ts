import { createContext, useContext } from 'react'

export const AudioContextCtx = createContext<AudioContext | null>(null)

export const useAudioContext = () => {
  const ctx = useContext(AudioContextCtx)

  if (!ctx)
    throw new Error(
      'useAudioContext must be used within an AudioContextProvider',
    )

  return ctx
}
