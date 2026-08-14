import { useState } from 'react'

import { Slider } from '@/components/slider'
import type { TrainingRange } from '@/store/config-store'
import { FREQ_MAX, FREQ_MIN } from '@/utils/constants'
import { formatFreq } from '@/utils/display'
import { linearToLog, logToLinear } from '@/utils/math'

const freqFormatFn = (linearFreq: number) => {
  const logFreq = linearToLog(linearFreq, FREQ_MIN, FREQ_MAX)
  return formatFreq(logFreq)
}

const getUserFreqInitialValue = (trainingRange: TrainingRange) => {
  const minLinear = logToLinear(trainingRange.min, FREQ_MIN, FREQ_MAX)
  const maxLinear = logToLinear(trainingRange.max, FREQ_MIN, FREQ_MAX)
  return linearToLog(
    minLinear + (maxLinear - minLinear) / 2,
    FREQ_MIN,
    FREQ_MAX,
  )
}

interface FreqInputProps {
  trainingRange: TrainingRange
  onSubmit: (freq: number) => void
}

export const FreqInput = (props: FreqInputProps) => {
  const { trainingRange, onSubmit } = props

  const [userFreq, setUserFreq] = useState(() =>
    getUserFreqInitialValue(trainingRange),
  )
  const userFreqLinear = logToLinear(userFreq, FREQ_MIN, FREQ_MAX)
  const minLinear = logToLinear(trainingRange.min, FREQ_MIN, FREQ_MAX)
  const maxLinear = logToLinear(trainingRange.max, FREQ_MIN, FREQ_MAX)

  const handleChangeFreq = (newValue: number) => {
    const freqLog = linearToLog(newValue, FREQ_MIN, FREQ_MAX)
    if (freqLog < trainingRange.min || freqLog > trainingRange.max) return

    setUserFreq(Math.round(freqLog))
  }

  const handleSubmit = () => {
    onSubmit(userFreq)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 640,
      }}
    >
      <Slider
        label='Freq:'
        value={userFreqLinear}
        onChange={handleChangeFreq}
        formatFn={freqFormatFn}
        min={minLinear}
        max={maxLinear}
      />
      <button
        style={{ width: 256, height: 32, margin: '0 auto' }}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}
