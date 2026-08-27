export const DB_NAME = 'freq-quiz-db'

export const PARAM_SMOOTHING_TIME = 0.025

/** Minimum frequency in Hz (Human hearing lower bound) */
export const FREQ_MIN = 20
/** Maximum frequency in Hz (Human hearing upper bound) */
export const FREQ_MAX = 20000
/** EQ boost/cut in Decibels (dB) */
export const EQ_GAIN = 12
export const EQ_Q = 1

export const ISO_FREQS_FULL_OCT = [
  31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000,
] as const

export const ISO_FREQS_THIRD_OCT = [
  20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630,
  800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500,
  16000, 20000,
] as const

/** Initial user frequency guess in Hz */
export const DEFAULT_USER_FREQ = 1000
/** Duration to display the result screen in milliseconds */
export const RESULT_TIMEOUT = 500
