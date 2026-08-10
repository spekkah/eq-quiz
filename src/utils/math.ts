export const linearToLog = (value: number, min: number, max: number) => {
  const minLog = Math.log(min)
  const maxLog = Math.log(max)

  return Math.exp(minLog + value * (maxLog - minLog))
}

export const logToLinear = (value: number, min: number, max: number) => {
  return (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))
}

export const randomLogFrequency = (minFreq: number, maxFreq: number) => {
  return linearToLog(Math.random(), minFreq, maxFreq)
}

export const dbToGain = (db: number) => {
  return Math.pow(10, db / 20)
}

export const calculateDifferenceInCents = (
  freq1: number,
  freq2: number,
): number => {
  if (freq1 === 0 || freq2 === 0) return NaN
  return 1200 * Math.abs(Math.log2(freq2 / freq1))
}
