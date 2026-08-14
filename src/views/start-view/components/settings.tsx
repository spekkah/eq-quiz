import type { ChangeEvent } from 'react'

import { Slider } from '@/components/slider'
import { useConfigStore } from '@/store'
import type { Difficulty } from '@/store/config-store'
import { FREQ_MAX, FREQ_MIN } from '@/utils/constants'
import { formatFreq } from '@/utils/display'
import { linearToLog, logToLinear } from '@/utils/math'

const difficultyOptions: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const isDifficulty = (value: string): value is Difficulty =>
  value in difficultyOptions

const freqFormatFn = (linearFreq: number) => {
  const logFreq = linearToLog(linearFreq, FREQ_MIN, FREQ_MAX)
  return formatFreq(logFreq)
}

export const Settings = () => {
  const { difficulty, trainingRange, setDifficulty, setTrainingRange } =
    useConfigStore()

  const handleChangeDifficulty = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    if (isDifficulty(value)) {
      setDifficulty(value)
    }
  }

  const handleChangeTrainingRangeMin = (newValue: number) => {
    const freq = linearToLog(newValue, FREQ_MIN, FREQ_MAX)
    if (freq >= trainingRange.max) return

    setTrainingRange({ min: Math.round(freq), max: trainingRange.max })
  }

  const handleChangeTrainingRangeMax = (newValue: number) => {
    const freq = linearToLog(newValue, FREQ_MIN, FREQ_MAX)
    if (freq <= trainingRange.min) return

    setTrainingRange({ min: trainingRange.min, max: Math.round(freq) })
  }

  return (
    <div className='settings'>
      <label>
        Difficulty:
        <select
          name='difficulty'
          value={difficulty}
          onChange={handleChangeDifficulty}
        >
          {Object.entries(difficultyOptions).map((d) => (
            <option
              key={d[0]}
              value={d[0]}
            >
              {d[1]}
            </option>
          ))}
        </select>
      </label>
      <Slider
        label='Min Freq:'
        value={logToLinear(trainingRange.min, FREQ_MIN, FREQ_MAX)}
        onChange={handleChangeTrainingRangeMin}
        formatFn={freqFormatFn}
      />
      <Slider
        label='Max Freq:'
        value={logToLinear(trainingRange.max, FREQ_MIN, FREQ_MAX)}
        onChange={handleChangeTrainingRangeMax}
        formatFn={freqFormatFn}
      />
    </div>
  )
}
