import { ComponentChild, render } from 'preact'
import MessageBroker from '../../../common/message-broker.ts'
import Widget from '../../../common/widget.tsx'
import WIDGETS from '../../../widgets/index.ts'
import ClientReadyEvent from '../events/client-ready-event.ts'
import { getEnv } from '../util/env.ts'
import { connectToWS } from '../util/ws.ts'

export default class Client extends EventTarget {
  protected port: number
  protected messageBroker: MessageBroker
  protected ws: WebSocket | null
  protected widgets: { [key: string]: Widget}
  protected _isLoading: boolean

  constructor(protected container: HTMLElement) {
    super()
    this.port = getEnv<number>('PORT')
    this.messageBroker = new MessageBroker()
    this.ws = null
    this.widgets = {}
    this._isLoading = true
  }

  async connect() {
    this.ws = await connectToWS(this.port)
    this.ws.addEventListener(
      'message',
      (ev: MessageEvent) => {
        const data: any = ev.data
        if (typeof data != 'object') {
          throw new Error(`Invalid message; expected an object, got a ${typeof data}`)
        }

        if (typeof data.channelId === 'undefined') {
          throw new Error('The server message is missing a channel ID')
        }

        const channelId: string = data.channelId
        delete data.channelId
        const msg = data

        this.messageBroker.emitToChannel(
          data.channelId,
          msg
        )
      }
    )

    this._isLoading = false
    this.dispatchEvent(new ClientReadyEvent())
  }

  get isLoading(): boolean {
    return this._isLoading
  }

  getPort(): number {
    return getEnv<number>('PORT')
  }

  getWidget(widgetId: string): Widget {
    this.assertWidgetIsInitialized(widgetId)
    return this.widgets[widgetId]
  }

  initWidget(widgetId: string) {
    this.assertWidgetIsDefined(widgetId)
    if (this.isWidgetInitialized(widgetId)) {
      return
    }
    
    this.messageBroker.createChannel(
      widgetId
    )
    this.widgets[widgetId] = WIDGETS[widgetId](
      widgetId,
      'client',
      this.messageBroker
    )
  }

  isWidgetInitialized(widgetId: string): boolean {
    return (
      widgetId in this.widgets &&
      (!!this.widgets[widgetId])
    )
  }

  private assertWidgetIsDefined(widgetId: string) {
    if (
      !(widgetId in WIDGETS)
    ) {
      throw new Error(`Undefined widget: ${widgetId}`)
    }
  }

  private assertWidgetIsInitialized(widgetId: string) {
    if (
      !(widgetId in this.widgets) ||
      !this.widgets[widgetId]
    ) {
      throw new Error(`Uninitialized widget: ${widgetId}`)
    }
  }
}
