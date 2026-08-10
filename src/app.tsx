import { useCallback, useEffect, useState } from 'react'

import { useAudioContext } from '@/context/audio-context'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { AudioLoader } from '@/lib/audio/audio-loader'
import { EqualizerEffect } from '@/lib/audio/effects/equalizer'
import { db } from '@/lib/db'
import { ISO_FREQS_FULL_OCT, RESULT_TIMEOUT } from '@/utils/constants'
import { QuizView } from '@/views/quiz-view'
import { ResultView } from '@/views/result-view'
import { StartView } from '@/views/start-view'

import { useAppStore } from './store'

const createEqualizerEffect = (ctx: AudioContext): EqualizerEffect => {
  return new EqualizerEffect(ctx)
}

export const App = () => {
  const { phase, targetFreq, userFreq, startRound, submitGuess } = useAppStore()

  const [audioBuffers, setAudioBuffers] = useState<AudioBuffer[]>([])

  const audioCtx = useAudioContext()
  const audioPlayer = useAudioPlayer(audioCtx, createEqualizerEffect)

  const handleStartRound = useCallback(async () => {
    if (audioCtx.state !== 'running') await audioCtx.resume()

    let currentBuffers = audioBuffers

    if (currentBuffers.length < 1) {
      const loader = new AudioLoader(audioCtx)

      const files = await db.audioFiles.toArray()
      const arrayBuffers = await Promise.all(
        files.map((file) => file.blob.arrayBuffer()),
      )

      currentBuffers = await loader.loadAudio(arrayBuffers)
      setAudioBuffers(currentBuffers)
    }

    const freqIdx = Math.floor(Math.random() * ISO_FREQS_FULL_OCT.length)
    const frequency = ISO_FREQS_FULL_OCT[freqIdx]

    audioPlayer.configureEffect({ frequency })

    const bufferIdx = Math.floor(Math.random() * currentBuffers.length)
    audioPlayer.play(currentBuffers[bufferIdx])

    startRound(frequency)
  }, [audioBuffers, audioCtx, audioPlayer, startRound])

  const handleSubmit = (freq: number) => {
    audioPlayer.stop()
    submitGuess(freq)
  }

  useEffect(() => {
    if (phase !== 'result') return

    const timerId = setTimeout(async () => {
      await handleStartRound()
    }, RESULT_TIMEOUT)

    return () => {
      clearTimeout(timerId)
    }
  }, [phase, handleStartRound])

  return (
    <div className='app'>
      {phase === 'init' && <StartView onStart={handleStartRound} />}
      {phase === 'quiz' && (
        <QuizView
          onEqToggle={audioPlayer.toggleEffect}
          onSubmit={handleSubmit}
        />
      )}
      {phase === 'result' && targetFreq !== null && (
        <ResultView
          targetFreq={targetFreq}
          userFreq={userFreq}
        />
      )}
    </div>
  )
}
