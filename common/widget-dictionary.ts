import MessageBroker from './message-broker.ts'
import Widget, { WidgetMode } from './widget.tsx'

export type IWidgetClass = typeof Widget
//export type IWidgetClass = () => any
//export interface IWidgetClass { new: (...args: any[]) => Widget }
export type WidgetFactory = (
  id: string,
  mode: WidgetMode,
  messageBroker: MessageBroker,
  ...args: any[]
) => Widget

//export type IWidgetDictionary = Record<string, IWidgetClass>
export type IWidgetDictionary = Record<string, WidgetFactory>

export function makeWidgetFactory(
  baseClass: any
): WidgetFactory {
  return (
    (
      id: string,
      mode: WidgetMode,
      messageBroker: MessageBroker,
      ...args: any[]
    ): Widget => (
      new baseClass(
        id,
        mode,
        messageBroker,
        ...args
      )
    )
  )
}
