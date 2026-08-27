import type { Difficulty, TrainingRange } from '@/store/config-store'

import {
  FREQ_MAX,
  FREQ_MIN,
  ISO_FREQS_FULL_OCT,
  ISO_FREQS_THIRD_OCT,
} from './constants'
import { getRandomArrayEl } from './helpers'
import { getRandomFloat, linearToLog, logToLinear } from './math'

interface DifficultyConfigBase {
  label: string
  gain: number
  getQ: () => number
  getRandomFreq: (range: TrainingRange) => number
}

interface DifficultyConfigContinuous extends DifficultyConfigBase {
  mode: 'continuous'
}

interface DifficultyConfigDiscrete extends DifficultyConfigBase {
  mode: 'discrete'
  getFreqs: (range: TrainingRange) => number[]
}

export type DifficultyConfig =
  | DifficultyConfigContinuous
  | DifficultyConfigDiscrete

export type DifficultyMode = DifficultyConfig['mode']

const getDiscreteFreqs = (
  range: TrainingRange,
  freqs: readonly number[],
): number[] => {
  const { min, max } = range

  const inRange = freqs.filter((f) => f >= min && f <= max)
  if (inRange.length > 1) return inRange
  if (freqs.length < 2) return [...freqs]

  let lowerIdx = freqs.findLastIndex((f) => f <= max)
  if (lowerIdx === -1) lowerIdx = 0
  if (lowerIdx === freqs.length - 1) lowerIdx--

  const lower = freqs[lowerIdx]
  const upper = freqs[lowerIdx + 1]

  if (lower === undefined || upper === undefined)
    throw new Error('Failed to extract discrete frequencies')

  return [lower, upper]
}

const createDiscreteDifficulty = (
  label: string,
  gain: number,
  Q: number,
  freqSet: readonly number[],
): DifficultyConfig => {
  return {
    label,
    mode: 'discrete',
    gain,
    getQ: () => Q,
    getFreqs: (range) => getDiscreteFreqs(range, freqSet),
    getRandomFreq: (range) => {
      const freqs = getDiscreteFreqs(range, freqSet)
      return getRandomArrayEl(freqs)
    },
  }
}

export const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  easy: createDiscreteDifficulty('Easy', 15, 1.41, ISO_FREQS_FULL_OCT),
  medium: createDiscreteDifficulty('Medium', 9, 4.4, ISO_FREQS_THIRD_OCT),
  hard: {
    label: 'Hard',
    mode: 'continuous',
    gain: 6,
    getQ: () => getRandomFloat(1.41, 4.4),
    getRandomFreq: (range) => {
      const { min, max } = range

      const minLinear = logToLinear(min, FREQ_MIN, FREQ_MAX)
      const maxLinear = logToLinear(max, FREQ_MIN, FREQ_MAX)

      const freqLinear = getRandomFloat(minLinear, maxLinear)
      const freqLog = linearToLog(freqLinear, FREQ_MIN, FREQ_MAX)

      return Math.round(freqLog)
    },
  },
}
