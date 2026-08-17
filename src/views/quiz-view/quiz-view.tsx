import { type ChangeEvent } from 'react'

import { useConfigStore } from '@/store'
import { DIFFICULTY_MAP } from '@/utils/difficulty'

import { FreqButtons } from './components/freq-buttons'
import { FreqInput } from './components/freq-input'

interface QuizViewProps {
  onEqToggle: (isEnabled: boolean) => void
  onSubmit: (freq: number) => void
  onReset: () => void
}

export const QuizView = (props: QuizViewProps) => {
  const { onEqToggle, onSubmit, onReset } = props
  const { difficulty, trainingRange } = useConfigStore()
  const config = DIFFICULTY_MAP[difficulty]

  const handleEqToggle = (e: ChangeEvent<HTMLInputElement>) => {
    onEqToggle(e.target.checked)
  }

  return (
    <div className='quiz-view'>
      {config.mode === 'continuous' && (
        <FreqInput
          trainingRange={trainingRange}
          onSubmit={onSubmit}
        />
      )}
      {config.mode === 'discrete' && (
        <FreqButtons
          freqs={config.getFreqs(trainingRange)}
          onSubmit={onSubmit}
        />
      )}
      <label>
        EQ On/Off
        <input
          type='checkbox'
          onChange={handleEqToggle}
          defaultChecked
        />
      </label>
      <button onClick={onReset}>Stop</button>
    </div>
  )
}
