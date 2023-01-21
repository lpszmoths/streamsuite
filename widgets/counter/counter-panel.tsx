import { CounterWidgetComponent, CounterWidgetComponentProps } from './counter-widget.tsx'
import { CounterWidgetAction } from './counter-common.ts'

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
  return (
    <div className='counter'>
      <CounterWidgetComponent
        initialCount={initialCount}
        stateObserver={stateObserver}
      />
      <div>
        <button
          onClick={() => {
            sendAction({
              actionId: 'changeCount',
              change: -1,
            })
          }}
        >-</button>
        <button
          onClick={() => {
            sendAction({
              actionId: 'changeCount',
              change: 1,
            })
          }}
        >+</button>
      </div>
    </div>
  )
}
