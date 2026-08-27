import { type ChangeEvent } from 'react'

import { formatFreq } from '@/utils/display'

interface QuizViewProps {
  freqs: { freq: number; isActive: boolean }[]
  onEqToggle: (isEnabled: boolean) => void
  onSubmit: (freq: number) => void
  onReset: () => void
}

export const QuizView = (props: QuizViewProps) => {
  const { freqs, onEqToggle, onSubmit, onReset } = props

  const handleEqToggle = (e: ChangeEvent<HTMLInputElement>) => {
    onEqToggle(e.target.checked)
  }

  return (
    <div className='quiz-view'>
      <div className='freq-btn-group'>
        {freqs.map((freq) => (
          <button
            className='freq-btn'
            key={freq.freq}
            disabled={!freq.isActive}
            onClick={() => {
              onSubmit(freq.freq)
            }}
          >
            {formatFreq(freq.freq)}
          </button>
        ))}
      </div>
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
