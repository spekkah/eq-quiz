export const formatFreq = (freq: number, fractionDigits = 1): string => {
  const isKilo = freq >= 1000

  const displayFreq = isKilo ? freq * 0.001 : freq
  const label = isKilo ? 'kHz' : 'Hz'

  return `${displayFreq.toFixed(fractionDigits)} ${label}`
}
