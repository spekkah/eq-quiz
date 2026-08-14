import { formatFreq } from '@/utils/display'

interface FreqButtonsProps {
  freqs: number[]
  onSubmit: (freq: number) => void
}

export const FreqButtons = (props: FreqButtonsProps) => {
  const { freqs, onSubmit } = props

  return (
    <div className='freq-btn-group'>
      {freqs.map((freq) => (
        <button
          className='freq-btn'
          key={freq}
          onClick={() => {
            onSubmit(freq)
          }}
        >
          {formatFreq(freq)}
        </button>
      ))}
    </div>
  )
}
