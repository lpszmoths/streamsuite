import MessageBroker from "../../common/message-broker.ts"
import Widget from "../../common/widget.tsx"
import WIDGETS from "../../widgets/index.ts"

export class WidgetManager {
  widgets: { [key: string]: Widget }

  constructor() {
    this.widgets = {}
  }

  getWidget(widgetId: string): Widget {
    return this.widgets[widgetId]
  }

  initWidget(widgetId: string, messageBroker: MessageBroker) {
    console.log(`Initializing widget ${widgetId}`)
    this.widgets[widgetId] = WIDGETS[widgetId](
      widgetId,
      'server',
      messageBroker
    )
  }

  isWidgetInitialized(widgetId: string): boolean {
    return (widgetId in this.widgets)
  }
}
