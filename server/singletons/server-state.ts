import MessageBroker, { IAllChannelsMessage } from "../../common/message-broker.ts";
import WIDGETS from "../../widgets/index.ts";
import { ClientManager } from "./client-manager.ts";
import { WidgetManager } from "./widget-manager.ts";
import { generateId } from "../util/id-generation.ts";

export default class ServerState {
  protected clientManager: ClientManager
  protected messageBroker: MessageBroker
  protected widgetManager: WidgetManager

  constructor() {
    this.clientManager = new ClientManager()
    this.messageBroker = new MessageBroker()
    this.widgetManager = new WidgetManager()

    this.messageBroker.subscribeToAllChannels(
      (payload: IAllChannelsMessage) => {
        console.log(`Broadcasting to all clients`)
        this.clientManager.forEachClient(
          (socket: WebSocket, id: string) => {
            socket.send(JSON.stringify(payload))
            console.log(`Broadcasted to ${id}`)
          }
        )
      }
    )

    console.log('Initialized server state')
  }

  addClient(id: string, client: WebSocket) {
    this.clientManager.addClient(id, client)
  }

  initWidget(widgetId: string) {
    this.assertWidgetIsDefined(widgetId)
    this.messageBroker.createChannel(
      widgetId
    )
    this.widgetManager.initWidget(
      widgetId,
      this.messageBroker
    )
    console.log(`Widget ${widgetId} initialized`)
  }

  isWidgetInitialized(widgetId: string): boolean {
    return this.widgetManager.isWidgetInitialized(widgetId)
  }

  removeClient(id: string) {
    this.clientManager.removeClient(id)
  }

  private assertWidgetIsDefined(widgetId: string) {
    if (
      !(widgetId in WIDGETS)
    ) {
      throw new Error(`Undefined widget: ${widgetId}`)
    }
  }
}
