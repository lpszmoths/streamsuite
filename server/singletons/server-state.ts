import MessageBroker from "../../common/message-broker.ts";
import WIDGETS from "../../widgets/index.ts";
import { WidgetManager } from "./widget-manager.ts";

export default class ServerState {
  messageBroker: MessageBroker
  widgetManager: WidgetManager

  constructor() {
    this.messageBroker = new MessageBroker()
    this.widgetManager = new WidgetManager()
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

  private assertWidgetIsDefined(widgetId: string) {
    if (
      !(widgetId in WIDGETS)
    ) {
      throw new Error(`Undefined widget: ${widgetId}`)
    }
  }
}
