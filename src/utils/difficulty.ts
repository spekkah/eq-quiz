import type { Difficulty, TrainingRange } from '@/store/config-store'

import { ISO_FREQS_FULL_OCT, ISO_FREQS_THIRD_OCT } from './constants'
import { getRandomFloat } from './math'

export interface DifficultyConfig {
  label: string
  gain: number
  getQ: () => number
  getFreqs: (range: TrainingRange) => number[] | 'continuous'
}

export const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    gain: 12,
    getQ: () => 1.41,
    getFreqs: (range) =>
      ISO_FREQS_FULL_OCT.filter((f) => f >= range.min && f <= range.max),
  },
  medium: {
    label: 'Medium',
    gain: 9,
    getQ: () => 4.4,
    getFreqs: (range) =>
      ISO_FREQS_THIRD_OCT.filter((f) => f >= range.min && f <= range.max),
  },
  hard: {
    label: 'Hard',
    gain: 6,
    getQ: () => getRandomFloat(1.41, 4.4),
    getFreqs: () => 'continuous',
  },
}
