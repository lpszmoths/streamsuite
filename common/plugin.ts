import { ComponentChild } from 'preact'
import { Subject } from 'rxjs'
import { IBot } from '../bot/bot-types.ts'
import MessageBroker, { IAllChannelsMessage } from './message-broker.ts'

export type PluginMode = 'client' | 'server'

export interface PluginMessage {
  type: string
}

export interface PluginAction {
  actionId: string
}

export const PLUGIN_ACTION_TYPE = '_action'
export interface PluginActionMessage
extends PluginMessage, PluginAction {
  type: '_action'
}

export const PLUGIN_UPDATE_TYPE = '_update'
export interface PluginUpdateMessage<
  StateType extends PluginState = PluginState
>
extends PluginMessage {
  type: '_update'
  newState: Partial<StateType>
}

export const PLUGIN_STATE_REQUEST_TYPE = '_staterequest'
export interface PluginStateRequestMessage
extends PluginMessage {
  type: '_staterequest'
}

export interface PluginState {}

export interface PluginConfiguration {
  cssFiles: { [key: string]: string }
  imageFiles: { [key: string]: string }
}

export default abstract class Plugin {
  protected bot: IBot

  constructor(
    public readonly id: string,
    public readonly name: string,
    private mode: PluginMode,
    private messageBroker: MessageBroker,
  ) {
    this.messageBroker.onChannelMessageReceived(
      this.id,
      (msg: any) => {
        this.handleRawMessage(msg)
      }
    )
  }

  public attachToBot() {
  }

  protected getMode(): PluginMode {
    return this.mode
  }

  protected isClient() {
    return this.mode !== 'server'
  }

  protected isServer() {
    return this.mode === 'server'
  }

  private handleRawMessage(msg: any) {
    if ('type' in msg) {
      const pluginMessage = msg as PluginMessage
      
      // state update?
      if (
        pluginMessage.type == PLUGIN_UPDATE_TYPE &&
        'newState' in msg
      ) {
        const pluginUpdateMessage = msg as PluginUpdateMessage<StateType>
        const { newState } = pluginUpdateMessage
        console.log(`New state update:`, newState)
        Object.assign(
          this.internalState,
          newState
        )
        this.internalStateObserver.next(newState)
      }
      
      // state update request?
      else if (
        pluginMessage.type == PLUGIN_STATE_REQUEST_TYPE
      ) {
        console.log('State update requested. Broadcasting')
        this.broadcastStateUpdate({
          ...this.state,
        })
      }

      // custom action?
      else if (
        pluginMessage.type === PLUGIN_ACTION_TYPE &&
        'actionId' in pluginMessage
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
}
