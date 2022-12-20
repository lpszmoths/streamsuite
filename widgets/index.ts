import { IWidgetDictionary, makeWidgetFactory } from '../common/widget-dictionary.ts'
import { CounterWidget } from './counter/index.tsx'

export enum WidgetId {
  COUNTER = 'counter'
}

export const WIDGETS: IWidgetDictionary = {
  [WidgetId.COUNTER]: makeWidgetFactory(CounterWidget)
}

export default WIDGETS
