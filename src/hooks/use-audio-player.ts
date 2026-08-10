import { useCallback, useEffect, useRef } from 'react'

import { AudioPlayer } from '@/lib/audio/audio-player'
import type { AudioEffect } from '@/lib/audio/effects/types'

export const useAudioPlayer = <TEffect extends AudioEffect>(
  audioCtx: AudioContext,
  effectFactory: (ctx: AudioContext) => TEffect,
) => {
  const effectRef = useRef<TEffect>(null)
  const playerRef = useRef<AudioPlayer>(null)

  useEffect(() => {
    const effect = effectFactory(audioCtx)
    const player = new AudioPlayer(audioCtx, effect)

    effectRef.current = effect
    playerRef.current = player

    return () => {
      effect.dispose()
      player.dispose()
    }
  }, [audioCtx, effectFactory])

  const play = useCallback((buffer: AudioBuffer) => {
    playerRef.current?.play(buffer)
  }, [])

  const stop = useCallback(() => {
    playerRef.current?.stop()
  }, [])

  type ConfigureOptions = Parameters<TEffect['configure']>[0]

  const configureEffect = useCallback((options: ConfigureOptions) => {
    effectRef.current?.configure(options)
  }, [])

  const toggleEffect = useCallback((isEnabled: boolean) => {
    effectRef.current?.toggle(isEnabled)
  }, [])

  return {
    play,
    stop,
    configureEffect,
    toggleEffect,
  }
}
