import { WidgetAction, WidgetConfiguration, WidgetState } from "../../common/widget.tsx"

export const THEME_CSS_KEY = 'Theme CSS'
export const BG_IMG_KEY = 'Background image'
export const FG_POMODORO_IMG_KEY = 'Timer overlay (pomodoro mode)'
export const FG_BREAK_IMG_KEY = 'Timer overlay (break mode)'

export interface PomodoroState extends WidgetState {
  state: 'stopped' | 'pomodoro' | 'break'
  timeRemaining: number
  timeTotal: number
}

export interface PomodoroConfiguration extends WidgetConfiguration {
  cssFiles: {
    [THEME_CSS_KEY]: string,
  },
  imageFiles: {
    [BG_IMG_KEY]: string,
    [FG_POMODORO_IMG_KEY]: string,
    [FG_BREAK_IMG_KEY]: string,
  },
}

export enum PomodoroActionType {
  START_POMODORO = 'start-pomodoro',
  START_BREAK = 'start-break',
  STOP = 'stop',
}

export interface PomodoroAction extends WidgetAction {
  actionId: PomodoroActionType,
  timerLength?: number
}

export const SHORT_BREAK_LENGTH = 5 * 60
export const LONG_BREAK_LENGTH = 30 * 60
export const POMODORO_LENGTH = 60 * 60
