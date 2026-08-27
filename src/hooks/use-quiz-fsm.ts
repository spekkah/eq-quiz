import { useCallback, useReducer } from 'react'

import { quizReducer } from '@/reducer/quiz-reducer'

export const useQuizFSM = <T>() => {
  const [state, dispatch] = useReducer(quizReducer<T>, { phase: 'init' })

  const startRound = useCallback((targetParams: T) => {
    dispatch({ type: 'START_ROUND', targetParams })
  }, [])

  const submitGuess = useCallback((userParams: T) => {
    dispatch({ type: 'SUBMIT_GUESS', userParams })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return { state, startRound, submitGuess, reset }
}
