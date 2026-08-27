import { useCallback, useEffect, useState } from 'react'

import pinkNoise from '@/assets/audio/pink-noise.wav'
import { useAudioEngine } from '@/context/audio-engine-context'
import { useQuizFSM } from '@/hooks/use-quiz-fsm'
import { ISO_FREQS_FULL_OCT, RESULT_TIMEOUT } from '@/utils/constants'
import { formatFreq } from '@/utils/display'
import { getRandomArrayEl, shuffleArray } from '@/utils/helpers'
import { QuizView } from '@/views/quiz-view'
import { ResultView } from '@/views/result-view'

const ATTEMPT_HISTORY_LENGTH = 10

interface Freq {
  freq: number
  isActive: boolean
  lastAttempts: boolean[]
}

const calculateSuccessRate = (arr: boolean[]) => {
  return arr.length
    ? arr.reduce((sum, value) => sum + (value ? 1 : 0), 0) / arr.length
    : 0
}

export const App = () => {
  const [freqs, setFreqs] = useState<Freq[]>(
    ISO_FREQS_FULL_OCT.map((freq) => ({
      freq,
      isActive: true,
      lastAttempts: [],
    })),
  )
  const { state, startRound, submitGuess, reset } = useQuizFSM<{
    frequency: number
  }>()

  const audioEngine = useAudioEngine()

  useEffect(() => {
    audioEngine.configureEffect({
      type: 'peaking',
      Q: 1.41,
      gain: 15,
      outGain: -15,
    })
  }, [audioEngine])

  const handleSubmit = useCallback(
    (frequency: number) => {
      if (state.phase !== 'quiz') return

      const isCorrect = frequency === state.targetParams.frequency

      setFreqs((prev) =>
        prev.map((stat) =>
          stat.freq === state.targetParams.frequency
            ? {
                ...stat,
                lastAttempts: [...stat.lastAttempts, isCorrect].slice(
                  -ATTEMPT_HISTORY_LENGTH,
                ),
              }
            : stat,
        ),
      )

      audioEngine.stop()
      submitGuess({ frequency })
    },
    [audioEngine, submitGuess, state],
  )

  const handleReset = useCallback(() => {
    audioEngine.stop()
    reset()
  }, [audioEngine, reset])

  const handleStartRound = useCallback(async () => {
    const freqsShuffled = shuffleArray(freqs)

    const freqSet = freqsShuffled.filter(
      (f) => f.lastAttempts.length !== ATTEMPT_HISTORY_LENGTH,
    )

    if (!freqSet.length) {
      const worstSuccess = freqsShuffled
        .sort(
          (a, b) =>
            calculateSuccessRate(a.lastAttempts) -
            calculateSuccessRate(b.lastAttempts),
        )
        .slice(0, 3)

      console.log(
        'Worst success: ',
        worstSuccess.map((f) => formatFreq(f.freq)).join(', '),
      )
      freqSet.push(...worstSuccess)
    }
    const randomFreq = getRandomArrayEl(freqs)
    console.log('Random freq: ', formatFreq(randomFreq.freq))
    freqSet.push(randomFreq)

    const frequency = getRandomArrayEl(freqSet).freq

    console.log(frequency)

    audioEngine.setEffectEnabled(true)
    audioEngine.configureEffect({ frequency })
    const audio = await fetch(pinkNoise)
    const audioBlob = await audio.blob()
    const audioBuffer = await audioEngine.decodeAudioData(audioBlob)
    audioEngine.play(audioBuffer)

    startRound({ frequency })
  }, [audioEngine, startRound, freqs])

  useEffect(() => {
    if (state.phase !== 'result') return

    const id = setTimeout(handleStartRound, RESULT_TIMEOUT)

    return () => {
      clearTimeout(id)
    }
  }, [state.phase, handleStartRound])

  const handleEqToggle = (isEnabled: boolean) => {
    audioEngine.setEffectEnabled(isEnabled)
  }

  return (
    <div className='app'>
      {state.phase === 'init' && (
        <button onClick={() => void handleStartRound()}>Start Round</button>
        // <StartView onStart={() => void handleStartRound()} />
      )}
      {state.phase === 'quiz' && (
        <>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <h4>STATS</h4>
            {freqs.map((f) => (
              <div
                key={f.freq}
                style={{
                  width: '12rem',
                  borderBottom: '1px solid white',
                  marginRight: '3rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{formatFreq(f.freq)}:</span>
                <span
                  style={{
                    color:
                      f.lastAttempts.length < ATTEMPT_HISTORY_LENGTH
                        ? 'gray'
                        : `hsl(${(calculateSuccessRate(f.lastAttempts) * 120).toString()}, 100%, 50%)`,
                  }}
                >
                  {f.lastAttempts.length
                    ? `${(calculateSuccessRate(f.lastAttempts) * 100).toFixed(1)}%`
                    : 'NO_DATA'}
                </span>
              </div>
            ))}
          </div>
          <QuizView
            freqs={freqs}
            onEqToggle={handleEqToggle}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </>
      )}
      {state.phase === 'result' && (
        <ResultView
          targetFreq={state.targetParams.frequency}
          userFreq={state.userParams.frequency}
        />
      )}
    </div>
  )
}
