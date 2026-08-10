// import { calculateDifferenceInCents } from "@/utils/math";

interface ResultViewProps {
  targetFreq: number
  userFreq: number
}

export const ResultView = (props: ResultViewProps) => {
  const { targetFreq, userFreq } = props

  // const cents = calculateDifferenceInCents(targetFreq, userFreq);
  // const semitones = cents / 100;
  // const errorValue = !isNaN(semitones) ? semitones.toFixed(1) : "N/A";

  const color = targetFreq === userFreq ? '#55ff00' : '#ff0033'

  return (
    <div
      className='result-view'
      style={{ color }}
    >
      <div>Target Freq: {targetFreq} Hz</div>
      <div>Your Guess: {userFreq} Hz</div>
    </div>
  )
}
