import { useCallback, useEffect, useState } from 'react'

import { useAudioContext } from '@/context/audio-context'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { AudioLoader } from '@/lib/audio/audio-loader'
import { EqualizerEffect } from '@/lib/audio/effects/equalizer'
import { db } from '@/lib/db'
import { RESULT_TIMEOUT } from '@/utils/constants'
import { QuizView } from '@/views/quiz-view'
import { ResultView } from '@/views/result-view'
import { StartView } from '@/views/start-view'

import { DIFFICULTY_MAP } from './utils/difficulty'
import { useAppStore, useConfigStore } from './store'

const createEqualizerEffect = (ctx: AudioContext): EqualizerEffect => {
  return new EqualizerEffect(ctx)
}

export const App = () => {
  const { phase, targetFreq, userFreq, startRound, submitGuess, reset } =
    useAppStore()
  const { difficulty, trainingRange } = useConfigStore()
  const config = DIFFICULTY_MAP[difficulty]

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

    const frequency = config.getRandomFreq(trainingRange)
    audioPlayer.configureEffect({ frequency })

    const bufferIdx = Math.floor(Math.random() * currentBuffers.length)
    audioPlayer.play(currentBuffers[bufferIdx])

    startRound(frequency)
  }, [audioBuffers, audioCtx, audioPlayer, startRound, config, trainingRange])

  const handleSubmit = (freq: number) => {
    audioPlayer.stop()
    submitGuess(freq)
  }

  const handleReset = () => {
    audioPlayer.stop()
    reset()
  }

  useEffect(() => {
    if (phase !== 'result') return

    const timerId = setTimeout(() => {
      void handleStartRound()
    }, RESULT_TIMEOUT)

    return () => {
      clearTimeout(timerId)
    }
  }, [phase, handleStartRound])

  return (
    <div className='app'>
      {phase === 'init' && (
        <StartView onStart={() => void handleStartRound()} />
      )}
      {phase === 'quiz' && (
        <QuizView
          onEqToggle={audioPlayer.toggleEffect}
          onSubmit={handleSubmit}
          onReset={handleReset}
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
