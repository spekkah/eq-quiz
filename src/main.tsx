import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app'
import { AudioContextCtx } from '@/context/audio-context'

import '@/index.css'

const rootEl = document.getElementById('root')
if (rootEl === null) throw new Error("Can't mount the app")

const audioCtx = new AudioContext()

createRoot(rootEl).render(
  <StrictMode>
    <AudioContextCtx.Provider value={audioCtx}>
      <App />
    </AudioContextCtx.Provider>
  </StrictMode>,
)
