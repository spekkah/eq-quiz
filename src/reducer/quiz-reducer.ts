type QuizState<TParams> =
  | { phase: 'init' }
  | { phase: 'quiz'; targetParams: TParams }
  | { phase: 'result'; targetParams: TParams; userParams: TParams }

type QuizAction<TParams> =
  | { type: 'START_ROUND'; targetParams: TParams }
  | { type: 'SUBMIT_GUESS'; userParams: TParams }
  | { type: 'RESET' }

export const quizReducer = <T>(
  state: QuizState<T>,
  action: QuizAction<T>,
): QuizState<T> => {
  switch (action.type) {
    case 'START_ROUND':
      return { phase: 'quiz', targetParams: action.targetParams }
    case 'SUBMIT_GUESS':
      if (state.phase !== 'quiz') return state

      return {
        phase: 'result',
        targetParams: state.targetParams,
        userParams: action.userParams,
      }
    case 'RESET':
      return { phase: 'init' }
    default:
      return state
  }
}
