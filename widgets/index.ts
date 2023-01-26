import { IWidgetDictionary, makeWidgetFactory } from '../common/widget-dictionary.ts'
import { CounterWidget } from './counter/index.tsx'
import PomodoroWidget from './pomodoro/index.tsx'

export enum WidgetId {
  // COUNTER = 'counter',
  POMODORO = 'pomodoro',
}

export const WIDGETS: IWidgetDictionary = {
  // [WidgetId.COUNTER]: makeWidgetFactory(CounterWidget),
  [WidgetId.POMODORO]: makeWidgetFactory(PomodoroWidget),
}

export default WIDGETS
