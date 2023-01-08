import { useState, useEffect } from 'preact/hooks'
import { Subject } from "rxjs"
import { CounterWidgetState } from './counter-common.ts'

export interface CounterWidgetComponentProps {
  initialCount: number
  stateObserver: Subject<Partial<CounterWidgetState>>
}

export function CounterWidgetComponent(
  {
    initialCount,
    stateObserver
  }: CounterWidgetComponentProps
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
      <span className='count'>
        {count}
      </span>
    </div>
  )
}