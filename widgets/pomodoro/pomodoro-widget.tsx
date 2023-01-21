import { useState, useEffect } from 'preact/hooks'
import { Subject } from "rxjs"
import { PomodoroState } from './pomodoro-common.tsx'

export interface PomodoroWidgetComponentProps {
  initialState: PomodoroState,
  stateObserver: Subject<Partial<PomodoroState>>
}

export function PomodoroWidgetComponent(
  {initialState, stateObserver}: PomodoroWidgetComponentProps
) {
  const [state, setState] = useState(initialState.state)
  const [timeRemaining, setTimeRemaining] = useState(initialState.timeRemaining)
  const [timeTotal, setTimeTotal] = useState(initialState.timeTotal)

  useEffect(() => {
    stateObserver.subscribe(
      (newState: Partial<PomodoroState>) => {
        if (typeof newState.state !== 'undefined') {
          setState(newState.state)
        }
        if (typeof newState.timeRemaining !== 'undefined') {
          setTimeRemaining(newState.timeRemaining)
        }
        if (typeof newState.timeTotal !== 'undefined') {
          setTimeTotal(newState.timeTotal)
        }
      }
    )
  }, [])

  const timeRemainingStr = `${Math.floor(timeRemaining / 60)}`
  const timeTotalStr = `${Math.floor(timeTotal / 60)}`
  const timeRemainingPct = (
    100 *
    timeRemaining /
    timeTotal
  ).toString()

  return (
    <div className='pomodoro' data-state={state}>
      <div className='pomodoro-progress-indicator horizontal'>
        <div
          className='pomodoro-progress-indicator-bar horizontal'
          style={{
            width: `${timeRemainingPct}%`
          }}
        >
        </div>
      </div>
      <div className='pomodoro-progress-indicator vertical'>
        <div
          className='pomodoro-progress-indicator-bar vertical'
          style={{
            height: `${timeRemainingPct}%`
          }}
        >
        </div>
      </div>
      <span className='pomodoro-time-remaining'>
        {timeRemainingStr}
      </span>
      <span className='pomodoro-time-total'>
        {timeTotalStr}
      </span>
    </div>
  )
}