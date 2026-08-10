import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/eq-quiz/',
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    tsconfigPaths: true,
  },
})
