import { WidgetAction, WidgetConfiguration } from "../../common/widget.tsx"

export interface CounterWidgetState {
  count: number
}

export interface CounterWidgetConfiguration extends WidgetConfiguration {}

export interface CounterWidgetAction
extends WidgetAction {
  actionId: 'changeCount'
  change: number
}
