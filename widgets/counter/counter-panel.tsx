import { useState, useEffect } from 'preact/hooks'
import { CounterWidgetComponentProps } from './counter-widget.tsx'
import { CounterWidgetAction, CounterWidgetState } from './counter-common.ts'

export interface CounterWidgetControlPanelProps extends CounterWidgetComponentProps {
  sendAction: (msg: CounterWidgetAction) => void
}

export function CounterWidgetControlPanel(
  {
    initialCount,
    stateObserver,
    sendAction
  }: CounterWidgetControlPanelProps
) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    stateObserver.subscribe(
      (newState: Partial<CounterWidgetState>) => {
        if (typeof newState.count !== 'undefined') {
          setCount(newState.count)
        }
      }
    )
  }, [])

  return (
    <div className='counter'>
      <button
        onClick={() => {
          sendAction({
            actionId: 'changeCount',
            change: -1,
          })
        }}
      >-</button>
      <span className='count'>
        {count}
      </span>
      <button
        onClick={() => {
          sendAction({
            actionId: 'changeCount',
            change: 1,
          })
        }}
      >+</button>
    </div>
  )
}
