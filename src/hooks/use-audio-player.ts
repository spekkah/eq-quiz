import { useCallback, useEffect, useMemo, useRef } from 'react'

import { AudioPlayer } from '@/lib/audio/audio-player'
import type { ConfigurableAudioEffect } from '@/lib/audio/effects/types'

export const useAudioPlayer = <
  TEffect extends ConfigurableAudioEffect<unknown>,
>(
  audioCtx: AudioContext,
  EffectConstructor: new (ctx: AudioContext) => TEffect,
) => {
  const effectRef = useRef<TEffect>(null)
  const playerRef = useRef<AudioPlayer>(null)

  useEffect(() => {
    const effect = new EffectConstructor(audioCtx)
    const player = new AudioPlayer(audioCtx, effect)

    effectRef.current = effect
    playerRef.current = player

    return () => {
      player.dispose()
      effect.dispose()

      playerRef.current = null
      effectRef.current = null
    }
  }, [audioCtx, EffectConstructor])

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

  const setEnabled = useCallback((isEnabled: boolean) => {
    effectRef.current?.setEnabled(isEnabled)
  }, [])

  return useMemo(
    () => ({
      play,
      stop,
      configureEffect,
      setEnabled,
    }),
    [play, stop, configureEffect, setEnabled],
  )
}
