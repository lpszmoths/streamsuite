import { ComponentChild } from 'preact'
import MessageBroker from './message-broker.ts'

export type WidgetMode = 'client' | 'server'

export default abstract class Widget<
  MessageType extends object = object
> {

  constructor(private id: string, private mode: WidgetMode, private messageBroker: MessageBroker) {
    this.messageBroker.subscribeToChannel(
      this.id,
      (msg: any) => {
        this.onMessage(msg as MessageType)
      }
    )
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

  protected addMessageListener(listener: (msg: MessageType) => void) {
    this.messageBroker.subscribeToChannel(
      this.id,
      (msg: any) => {
        listener(msg as MessageType)
      }
    )
  }

  protected emitMessage(message: MessageType): void {
    this.messageBroker.emitToChannel(this.id, message)
  }

  abstract onMessage(message: MessageType): void

  abstract createClientWidget(): ComponentChild

  abstract createControlWidget(): ComponentChild
}
