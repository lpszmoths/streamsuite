import { WidgetAction } from "../../common/widget.tsx"

export interface CounterWidgetState {
  count: number
}

export interface CounterWidgetAction
extends WidgetAction {
  actionId: 'changeCount'
  change: number
}
