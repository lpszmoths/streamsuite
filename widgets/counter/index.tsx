import { ComponentChild, render } from 'preact'
import MessageBroker from '../../common/message-broker.ts'
import Widget, { WidgetMode } from '../../common/widget.tsx'
import { CounterWidgetControlPanel } from './counter-panel.tsx'
import { CounterWidgetComponent } from './counter-widget.tsx'
import { CounterWidgetAction, CounterWidgetState, CounterWidgetConfiguration } from './counter-common.ts'

export class CounterWidget
extends Widget<
  CounterWidgetState,
  CounterWidgetConfiguration,
  CounterWidgetAction
>
{
  constructor(id: string, mode: WidgetMode, messageBroker: MessageBroker) {
    super(
      id,
      'Counter',
      mode,
      messageBroker,
      { count: 0 },
      {
        cssFiles: {},
        imageFiles: {},
      }
    )
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
