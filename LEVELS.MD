# Implementing Quiz Difficulty Levels and Adjustable Training Range

This document outlines the proposed architecture to introduce difficulty levels and an adjustable training range to the EQ Gym quiz, while adhering to best practices, avoiding code smells, and ensuring the application remains maintainable and scalable.

## 1. Overview of Requirements

**Difficulty Levels:**
1. **Easy:** 1 oct ISO bands, 12dB boost, 1.41 Q
2. **Medium:** 1/3 oct ISO bands, 9dB boost, 4.4 Q
3. **Hard:** Random frequency (continuous), 6dB boost, variable Q

**Adjustable Training Range:**
- Ability to restrict frequency generation and guessing to a specific range (e.g., 250Hz - 2500Hz).

---

## 2. Architecture & State Management

Currently, the app uses a simple `useReducer` in `app.tsx` (`appReducer`). To accommodate global configurations like difficulty and frequency range, we should introduce a dedicated **Settings Context**. 

### **Why Context?**
Passing settings (difficulty, min/max frequency) from `App` down to `StartView`, `QuizView`, and `ResultView` will quickly lead to **prop drilling**. A `SettingsContext` allows any component to access or update the settings directly. We should also back this context with `localStorage` so user preferences persist between sessions.

```typescript
// src/context/settings-context.tsx
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface TrainingRange {
  min: number
  max: number
}

export interface SettingsState {
  difficulty: Difficulty
  range: TrainingRange
}
```

---

## 3. Difficulty Strategy Pattern (Avoiding `switch` smells)

**Anti-pattern to avoid:** Placing large `switch (difficulty)` statements inside your game logic (`app.tsx`) or UI components. This violates the Open-Closed Principle.

**Best Practice:** Use a configuration map (Strategy Pattern) to define how each difficulty behaves. 

```typescript
// src/utils/difficulty.ts
import { ISO_FREQS_FULL_OCT, ISO_FREQS_THIRD_OCT } from './constants'
import { getRandomFloat } from './math' // utility to create

export interface DifficultyConfig {
  label: string
  gain: number
  getQ: () => number
  // Returns discrete frequencies or 'continuous' for a slider
  getFrequencies: (range: TrainingRange) => number[] | 'continuous'
}

export const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    gain: 12,
    getQ: () => 1.41,
    getFrequencies: (range) => 
      ISO_FREQS_FULL_OCT.filter(f => f >= range.min && f <= range.max),
  },
  medium: {
    label: 'Medium',
    gain: 9,
    getQ: () => 4.4,
    getFrequencies: (range) => 
      ISO_FREQS_THIRD_OCT.filter(f => f >= range.min && f <= range.max),
  },
  hard: {
    label: 'Hard',
    gain: 6,
    // Variable Q (e.g., between 1.41 and 4.4)
    getQ: () => getRandomFloat(1.41, 4.4), 
    getFrequencies: () => 'continuous',
  }
}
```

---

## 4. Game Logic Integration (`app.tsx`)

When `handleStartRound` is invoked, we read from the current difficulty configuration to configure the EQ and determine the target frequency.

```typescript
const { difficulty, range } = useSettings()
const config = DIFFICULTY_MAP[difficulty]

const handleStartRound = useCallback(async () => {
  // ... audio loading logic ...

  const freqs = config.getFrequencies(range)
  let frequency: number

  if (freqs === 'continuous') {
    // Hard mode: Random continuous frequency in range
    frequency = getRandomFloat(range.min, range.max)
  } else {
    // Easy/Medium mode: Random from filtered ISO array
    const freqIdx = Math.floor(Math.random() * freqs.length)
    frequency = freqs[freqIdx]
  }

  // Update EQ parameters
  audioPlayer.configureEffect({ 
    frequency,
    gain: config.gain,
    Q: config.getQ()
  })

  // ... dispatch start round ...
}, [/* dependencies */])
```

---

## 5. UI Updates & Considerations

### **StartView (or Settings Modal)**
Add controls to select the `Difficulty` (Radio buttons or Select dropdown) and the `Training Range` (a double-ended slider or two number inputs). 

### **QuizView Adaptation**
Currently, `QuizView` maps over a hardcoded array of buttons. This needs to be dynamic based on the difficulty.

- **Easy:** Renders a small set of buttons (e.g., 10 buttons if full range).
- **Medium:** Renders up to 31 buttons. 
  - *UI Consideration:* 31 buttons in a single row will overflow. You will need to implement a CSS Grid or wrap them neatly, possibly styling them like a keyboard or a clean flex grid to maintain a good UX.
- **Hard:** Because the target frequency is continuous, discrete buttons cannot be used.
  - *UI Consideration:* You must render a **Logarithmic Slider** (range input) or a text input field, along with a "Submit Guess" button, since users can't just click a pre-defined frequency.

```tsx
// Inside QuizView
const { difficulty, range } = useSettings()
const config = DIFFICULTY_MAP[difficulty]
const freqs = config.getFrequencies(range)

if (freqs === 'continuous') {
  return <ContinuousInput range={range} onSubmit={onSubmit} />
}

return (
  <div className='freq-btn-grid'>
    {freqs.map(f => (
      <button key={f} onClick={() => onSubmit(f)}>{f}Hz</button>
    ))}
  </div>
)
```

---

## 6. Anti-patterns & Code Smells to Avoid

1. **Magic Numbers in Components:**
   Do not put `12`, `9`, `1.41`, `4.4` directly inside the React components or audio effect files. They should be strictly contained within the `DIFFICULTY_MAP`.
2. **Prop Drilling:**
   Do not pass `difficulty` as a prop all the way from `App` -> `StartView`, `QuizView`, etc. Use the Context API.
3. **Over-complicating Reducer:**
   Keep `appReducer` strictly for the flow of the game (phases). Do not put settings state inside `appReducer`, as settings and game phase have different lifecycles and persistence requirements.
4. **Ignoring Logarithmic Scaling:**
   If implementing a slider for the **Hard** mode or for the adjustable training range, ensure the slider visually maps to a logarithmic scale, as human hearing is logarithmic (octaves). A linear slider from 20Hz to 20kHz will make the low frequencies impossible to select.
