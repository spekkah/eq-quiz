// import { calculateDifferenceInCents } from "@/utils/math";

import { useConfigStore } from '@/store'
import { formatFreq } from '@/utils/display'
import { calculateDifferenceInCents } from '@/utils/math'

interface ResultViewProps {
  targetFreq: number
  userFreq: number
}

export const ResultView = (props: ResultViewProps) => {
  const { targetFreq, userFreq } = props
  const { difficulty } = useConfigStore()

  const cents = calculateDifferenceInCents(targetFreq, userFreq)
  const semitones = cents / 100
  const errorValue = !isNaN(semitones) ? semitones.toFixed(1) : 'N/A'

  const color = semitones < 5 ? '#55ff00' : '#ff0033'

  return (
    <div
      className='result-view'
      style={{ color }}
    >
      <div>Target Freq: {formatFreq(targetFreq)}</div>
      <div>Your Guess: {formatFreq(userFreq)}</div>
      {difficulty === 'hard' && <div>Error: {errorValue} st</div>}
    </div>
  )
}
