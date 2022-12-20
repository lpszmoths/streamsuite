import { ComponentChild, render } from 'preact'
import { useEffect, useState } from "preact/hooks"
import { Subject } from "rxjs"
import MessageBroker from '../../common/message-broker.ts'
import Widget, { WidgetMode } from '../../common/widget.tsx'

export interface CounterWidgetMessage {
  increment: 1 | -1
}

export interface CounterWidgetComponentProps {
  initialCount: number
  countSubject: Subject<number>
}

export interface CounterWidgetControlPanelProps extends CounterWidgetComponentProps {
  sendMessage: (msg: CounterWidgetMessage) => void
}

export function CounterWidgetComponent(
  {
    initialCount,
    countSubject
  }: CounterWidgetComponentProps
) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    countSubject.subscribe((newCount: number) => {
      setCount(newCount)
    })
  }, [])

  return (
    <div className='counter'>
      <span className='count'>
        {count}
      </span>
    </div>
  )
}

export function CounterWidgetControlPanel(
  {
    initialCount,
    countSubject,
    sendMessage
  }: CounterWidgetControlPanelProps
) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    countSubject.subscribe((newCount: number) => {
      setCount(newCount)
    })
  }, [])

  return (
    <div className='counter'>
      <button
        onClick={() => {
          sendMessage({
            increment: -1,
          })
        }}
      >-</button>
      <span className='count'>
        {count}
      </span>
      <button
        onClick={() => {
          sendMessage({
            increment: 1,
          })
        }}
      >+</button>
    </div>
  )
}

export class CounterWidget
extends Widget<CounterWidgetMessage>
{
  protected count: number;
  protected countSubject: Subject<number>;

  constructor(id: string, mode: WidgetMode, messageBroker: MessageBroker) {
    super(id, mode, messageBroker)

    this.count = 0
    this.countSubject = new Subject()
    setInterval(() => {
      console.log('tick')
      this.emitMessage({
        increment: 1
      })
    }, 1000)
  }

  onMessage(message: CounterWidgetMessage): void {
    this.count += message.increment
    this.countSubject.next(this.count)
  }

  createClientWidget(): ComponentChild {
    return (
      <CounterWidgetComponent
        initialCount={this.count}
        countSubject={this.countSubject}
      />
    )
  }

  createControlWidget(): ComponentChild {
    const sendMessage = (msg: CounterWidgetMessage) => {
      this.emitMessage(msg)
    }
    return (
      <CounterWidgetControlPanel
        initialCount={this.count}
        countSubject={this.countSubject}
        sendMessage={sendMessage}
      />
    )
  }
}

export default CounterWidget
