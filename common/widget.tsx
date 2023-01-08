import { ComponentChild } from 'preact'
import { Subject } from 'rxjs'
import MessageBroker, { IAllChannelsMessage } from './message-broker.ts'

export type WidgetMode = 'client' | 'server'

export interface WidgetMessage {
  type: string
}

export interface WidgetAction {
  actionId: string
}

export const WIDGET_ACTION_TYPE = '_action'
export interface WidgetActionMessage
extends WidgetMessage, WidgetAction {
  type: '_action'
}

export const WIDGET_UPDATE_TYPE = '_update'
export interface WidgetUpdateMessage<StateType extends object>
extends WidgetMessage {
  type: '_update'
  newState: Partial<StateType>
}

export const WIDGET_STATE_REQUEST_TYPE = '_staterequest'
export interface WidgetStateRequestMessage
extends WidgetMessage {
  type: '_staterequest'
}

export default abstract class Widget<
  StateType extends object = object,
  ActionType extends WidgetAction =
  WidgetAction
> {
  private internalState: StateType
  private internalStateObserver: Subject<Partial<StateType>>

  constructor(
    private id: string,
    private mode: WidgetMode,
    private messageBroker: MessageBroker,
    initialState: StateType
  ) {
    this.internalState = initialState
    this.internalStateObserver = new Subject()
    this.messageBroker.onChannelMessageReceived(
      this.id,
      (msg: any) => {
        console.log(`${this.id} message received:`, msg)
        this.handleRawMessage(msg)
      }
    )
    if (mode === 'client') {
      this.requestStateUpdate()
    }
  }

  protected get state(): Readonly<StateType> {
    return this.internalState
  }

  protected get stateObserver(): Subject<Partial<StateType>> {
    return this.internalStateObserver
  }

  protected setState(newState: Partial<StateType> = {}) {
    if (this.isClient()) {
      throw new Error(`You can't change a widget's state in the client`)
    }
    
    Object.assign(
      this.internalState,
      newState
    )

    this.broadcastStateUpdate(newState)
  }

  protected getMode(): WidgetMode {
    return this.mode
  }

  protected isClient() {
    return this.mode !== 'server'
  }

  protected isServer() {
    return this.mode === 'server'
  }

  protected sendAction(action: ActionType): void {
    const actionMsg: WidgetActionMessage = {
      type: WIDGET_ACTION_TYPE,
      ...action,
    }
    this.messageBroker.sendToChannel(
      this.id,
      actionMsg
    )
  }

  protected requestStateUpdate(): void {
    const requestMsg: WidgetStateRequestMessage = {
      type: WIDGET_STATE_REQUEST_TYPE,
    }
    console.log('Requesting state update')
    this.messageBroker.sendToChannel(
      this.id,
      requestMsg
    )
  }

  abstract onAction(action: ActionType): void

  abstract createClientWidget(): ComponentChild

  abstract createControlWidget(): ComponentChild

  private handleRawMessage(msg: any) {
    if ('type' in msg) {
      const widgetMessage = msg as WidgetMessage
      
      // state update?
      if (
        widgetMessage.type == WIDGET_UPDATE_TYPE &&
        'newState' in msg
      ) {
        const widgetUpdateMessage = msg as WidgetUpdateMessage<StateType>
        const { newState } = widgetUpdateMessage
        console.log(`New state update:`, newState)
        Object.assign(
          this.internalState,
          newState
        )
        this.internalStateObserver.next(newState)
      }
      
      // state update request?
      else if (
        widgetMessage.type == WIDGET_STATE_REQUEST_TYPE
      ) {
        console.log('State update requested. Broadcasting')
        this.broadcastStateUpdate({
          ...this.state,
        })
      }

      // custom action?
      else if (
        widgetMessage.type === WIDGET_ACTION_TYPE &&
        'actionId' in widgetMessage
      ) {
        this.onAction(
          msg as ActionType
        )
      }

      else {
        throw new Error(`Cannot parse message!`)
      }
    }
  }

  private broadcastStateUpdate(newState: Partial<StateType>) {
    const stateUpdateAction: WidgetUpdateMessage<StateType> = {
      type: WIDGET_UPDATE_TYPE,
      newState,
    }
    this.messageBroker.sendToChannel(
      this.id,
      stateUpdateAction
    )
  }
}
