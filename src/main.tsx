import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'
import { AudioEngine } from '@/lib/audio/audio-engine'

import { AudioEngineCtx } from './context/audio-engine-context'

import '@/index.css'

const rootEl = document.getElementById('root')
if (rootEl === null) throw new Error("Can't mount the app")

const audioCtx = new AudioContext()
const audioEngine = new AudioEngine(audioCtx)

createRoot(rootEl).render(
  <StrictMode>
    <AudioEngineCtx.Provider value={audioEngine}>
      <App />
    </AudioEngineCtx.Provider>
  </StrictMode>,
)
