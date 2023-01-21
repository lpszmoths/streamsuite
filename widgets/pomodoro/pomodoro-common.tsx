import { WidgetAction } from "../../common/widget.tsx"

export interface PomodoroState {
  state: 'stopped' | 'pomodoro' | 'break'
  timeRemaining: number
  timeTotal: number
}

export enum PomodoroActionType {
  START_POMODORO = 'start-pomodoro',
  START_BREAK = 'start-pomodoro',
  STOP = 'stop',
}

export interface PomodoroAction extends WidgetAction {
  actionId: PomodoroActionType,
  timerLength?: number
}

export const SHORT_BREAK_LENGTH = 5 * 60
export const LONG_BREAK_LENGTH = 60 * 60
export const POMODORO_LENGTH = 25 * 60
