import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { FREQ_MAX, FREQ_MIN } from '@/utils/constants'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TrainingRange {
  min: number
  max: number
}

interface ConfigState {
  difficulty: Difficulty
  trainingRange: TrainingRange
}

interface ConfigActions {
  setDifficulty: (difficulty: Difficulty) => void
  setTrainingRange: (trainingRange: TrainingRange) => void
}

const initialState: ConfigState = {
  difficulty: 'easy',
  trainingRange: { min: FREQ_MIN, max: FREQ_MAX },
}

export const useConfigStore = create<ConfigState & ConfigActions>()(
  persist(
    (set) => ({
      ...initialState,

      setDifficulty: (difficulty) => set({ difficulty }),
      // TODO: Partial update
      setTrainingRange: (trainingRange) => set({ trainingRange }),
    }),
    { name: 'eq-gym-config' },
  ),
)
