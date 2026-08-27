export const getRandomArrayEl = <T>(array: T[]): T => {
  const idx = Math.floor(Math.random() * array.length)
  return array[idx] as T
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const clone = [...array]
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[clone[i], clone[j]] = [clone[j] as T, clone[i] as T]
  }
  return clone
}
