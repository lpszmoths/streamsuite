import { useState, useEffect } from 'preact/hooks'
import { Subject } from "rxjs"
import { LONG_BREAK_LENGTH, PomodoroAction, PomodoroActionType, PomodoroState, POMODORO_LENGTH, SHORT_BREAK_LENGTH } from './pomodoro-common.tsx'

export interface PomodoroWidgetComponentProps {
  initialState: PomodoroState,
  stateObserver: Subject<Partial<PomodoroState>>
  sendAction: (action: PomodoroAction) => void
}

export function PomodoroControlPanelComponent(
  {initialState, stateObserver, sendAction}: PomodoroWidgetComponentProps
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

  let stateStr: string = 'Stopped'
  if (state === 'pomodoro') {
    stateStr = 'Working'
  }
  else if (state === 'break') {
    stateStr = 'Break'
  }

  const timerStr: string = (
    Math.floor(timeRemaining / 60) +
    '/' +
    Math.floor(timeTotal / 60)
  )

  return (
    <div>
      <div>
        State: {stateStr} | Timer: {timerStr}
      </div>
      <div className='flex-stretch-list'>
        <button
          className='button-negative'
          disabled={state === 'stopped'}
          onClick={() => {
            sendAction({
              actionId: PomodoroActionType.STOP,
            })
          }}
        >Stop</button>
        <button
          className='button-positive'
          disabled={state !== 'stopped'}
          onClick={() => {
            sendAction({
              actionId: PomodoroActionType.START_BREAK,
              timerLength: SHORT_BREAK_LENGTH,
            })
          }}
        >Start short break</button>
        <button
          className='button-positive'
          disabled={state !== 'stopped'}
          onClick={() => {
            sendAction({
              actionId: PomodoroActionType.START_BREAK,
              timerLength: LONG_BREAK_LENGTH,
            })
          }}
        >Start long break</button>
        <button
          className='button-primary'
          disabled={state !== 'stopped'}
          onClick={() => {
            sendAction({
              actionId: PomodoroActionType.START_POMODORO,
              timerLength: POMODORO_LENGTH,
            })
          }}
        >Start pomodoro</button>
      </div>
    </div>
  )
}