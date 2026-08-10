import { create } from 'zustand'

import { DEFAULT_USER_FREQ } from '@/utils/constants'

type Phase = 'init' | 'quiz' | 'result'

interface AppState {
  phase: Phase
  targetFreq: number | null
  userFreq: number
}

interface AppActions {
  startRound: (targetFreq: number) => void
  submitGuess: (userFreq: number) => void
  reset: () => void
}

const initialState: AppState = {
  phase: 'init',
  targetFreq: null,
  userFreq: DEFAULT_USER_FREQ,
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  ...initialState,

  startRound: (targetFreq) => {
    set({ phase: 'quiz', targetFreq, userFreq: DEFAULT_USER_FREQ })
  },

  submitGuess: (userFreq) => {
    set({ phase: 'result', userFreq })
  },

  reset: () => {
    set({ ...initialState })
  },
}))
