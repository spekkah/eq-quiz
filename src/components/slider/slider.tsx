import type { ChangeEvent } from 'react'

import styles from './slider.module.css'

interface SliderProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  formatFn?: (value: number) => string
}

export const Slider = (props: SliderProps) => {
  const {
    label,
    value,
    onChange,
    formatFn = (v) => v,
    min = 0,
    max = 1,
    step = 0.0001,
  } = props

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onChange(Number(value))
  }

  return (
    <div className={styles.slider}>
      <div className={styles.heading}>
        <span>{label}</span>
        <span>{formatFn(value)}</span>
      </div>
      <input
        type='range'
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChangeValue}
      />
    </div>
  )
}
