import { ComponentChild, render } from 'preact'
import { useEffect, useState } from "preact/hooks"
import { Subject } from "rxjs"
import MessageBroker from '../../common/message-broker.ts'
import Widget, { WidgetMode } from '../../common/widget.tsx'
import { CounterWidgetControlPanel } from './counter-panel.tsx'
import { CounterWidgetComponent } from './counter-widget.tsx'
import { CounterWidgetAction, CounterWidgetState } from './counter-common.ts'

export class CounterWidget
extends Widget<
  CounterWidgetState,
  CounterWidgetAction
>
{
  constructor(id: string, mode: WidgetMode, messageBroker: MessageBroker) {
    super(id, mode, messageBroker, { count: 0 })

    // ask the server to send an updated count
    // this.sendMessage({})

    // debug
    // if (mode === 'server') {
    //   setInterval(() => {
    //     console.log('tick')
    //     this.setState({
    //       count: this.state.count + 1
    //     })
    //   }, 5000)
    // }
  }

  onAction({actionId, change}: CounterWidgetAction): void {
    console.log(`counter action ${actionId} received`, change)
    if (typeof change === 'number') {
      this.setState({
        count: this.state.count + change
      })
    }
  }

  createClientWidget(): ComponentChild {
    return (
      <CounterWidgetComponent
        initialCount={this.state.count}
        stateObserver={this.stateObserver}
      />
    )
  }

  createControlWidget(): ComponentChild {
    const sendAction = (msg: CounterWidgetAction) => {
      this.sendAction(msg)
    }
    return (
      <CounterWidgetControlPanel
        initialCount={this.state.count}
        stateObserver={this.stateObserver}
        sendAction={sendAction}
      />
    )
  }
}

export default CounterWidget
