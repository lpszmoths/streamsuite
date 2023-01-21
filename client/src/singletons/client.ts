import { ComponentChild, render } from 'preact'
import MessageBroker, { IAllChannelsMessage } from '../../../common/message-broker.ts'
import Widget from '../../../common/widget.tsx'
import WIDGETS from '../../../widgets/index.ts'
import ClientReadyEvent from '../events/client-ready-event.ts'
import { loadCssFile } from '../util/dom.ts'
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
        let data: any

        try {
          data = JSON.parse(ev.data)
        } catch(e) {
          throw new Error(`Unable to parse remote payload`, ev.data)
        }

        if (typeof data != 'object') {
          throw new Error(`Invalid message; expected an object, got a ${typeof data}`)
        }

        if (typeof data.channelId === 'undefined') {
          throw new Error('The server message is missing a channel ID')
        }

        const channelId: string = data.channelId
        const msg = data.msg
        console.log(`Received message of type ${typeof msg}:`, msg)

        this.messageBroker.receiveOnChannel(
          channelId,
          msg
        )
      }
    )

    this.messageBroker.onMessageSent(
      (msg: IAllChannelsMessage) => {
        this.ws!.send(JSON.stringify(msg))
      }
    )

    this._isLoading = false
    this.dispatchEvent(new ClientReadyEvent())
  }

  getEnabledWidgets(): string[] {
    return Object.keys(WIDGETS)
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
    
    loadCssFile(`/static/widget-assets/${widgetId}.css`)
  }

  get isLoading(): boolean {
    return this._isLoading
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
