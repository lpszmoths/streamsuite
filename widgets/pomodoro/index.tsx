import { ComponentChild, render } from 'preact'
import MessageBroker from '../../common/message-broker.ts'
import Widget, { WidgetMode } from '../../common/widget.tsx'
import { BG_IMG_KEY, FG_BREAK_IMG_KEY, FG_POMODORO_IMG_KEY, PomodoroAction, PomodoroActionType, PomodoroConfiguration, PomodoroState, THEME_CSS_KEY } from './pomodoro-common.tsx'
import { PomodoroControlPanelComponent } from './pomodoro-panel.tsx'
import { PomodoroWidgetComponent } from './pomodoro-widget.tsx'

const INITIAL_STATE: PomodoroState = {
  state: 'stopped',
  timeRemaining: 0,
  timeTotal: 25 * 60,
}

const INITIAL_CONFIGURATION: PomodoroConfiguration = {
  cssFiles: {
    [THEME_CSS_KEY]: '',
  },
  imageFiles: {
    [BG_IMG_KEY]: '',
    [FG_POMODORO_IMG_KEY]: '',
    [FG_BREAK_IMG_KEY]: '',
  }
}

export class PomodoroWidget
extends Widget<
  PomodoroState,
  PomodoroConfiguration,
  PomodoroAction
>
{
  private setTimeoutHandle: number = 0

  constructor(id: string, mode: WidgetMode, messageBroker: MessageBroker) {
    super(
      id,
      'Pomodoro timer',
      mode,
      messageBroker,
      INITIAL_STATE,
      INITIAL_CONFIGURATION
    )
  }

  onAction({actionId, timerLength}: PomodoroAction): void {
    console.log(`pomodoro action ${actionId} received`, timerLength)
    switch(actionId) {
      case PomodoroActionType.START_BREAK:
        if (!timerLength) {
          throw new Error('Invalid timer length')
        }

        this.setState({
          state: 'break',
          timeRemaining: timerLength!,
          timeTotal: timerLength!,
        })
        this.scheduleTimer()
        break
      
      case PomodoroActionType.START_POMODORO:
        if (!timerLength) {
          throw new Error('Invalid timer length')
        }

        this.setState({
          state: 'pomodoro',
          timeRemaining: timerLength!,
          timeTotal: timerLength!,
        })
        this.scheduleTimer()
        break
      
      case PomodoroActionType.STOP:
        this.stopTimer()
        break
    }
  }

  createClientWidget(): ComponentChild {
    return (
      <PomodoroWidgetComponent
        initialState={this.state}
        stateObserver={this.stateObserver}
      />
    )
  }

  createControlWidget(): ComponentChild {
    const sendAction = (msg: PomodoroAction) => {
      this.sendAction(msg)
    }
    return (
      <PomodoroControlPanelComponent
        initialState={this.state}
        stateObserver={this.stateObserver}
        sendAction={sendAction}
      />
    )
  }

  scheduleTimer() {
    this.setTimeoutHandle = setTimeout(
      () => {
        this.setState({
          timeRemaining: this.state.timeRemaining - 60
        })
        if (this.state.timeRemaining > 0) {
          this.scheduleTimer()
        }
        else {
          this.stopTimer()
        }
      },
      60 * 1000
    )
  }

  stopTimer() {
    if (this.setTimeoutHandle) {
      clearTimeout(this.setTimeoutHandle)
    }
    this.setState({
      state: 'stopped',
      timeRemaining: 0,
    })
  }
}

export default PomodoroWidget
