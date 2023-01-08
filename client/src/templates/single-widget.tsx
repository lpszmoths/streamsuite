import { useEffect, useState } from 'preact/hooks'
import { ComponentChild } from 'preact'
import Widget from '../../../common/widget.tsx'
import type Client from '../singletons/client.ts'

export interface SingleWidgetProps {
  client: Client
  widgetId: string
  controlPanelMode?: boolean
}

export default function SingleWidget({client, widgetId, controlPanelMode}: SingleWidgetProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [widget, setWidget] = useState<Widget | null>(null)

  useEffect(() => {
    client.initWidget(widgetId)
    const theWidget: Widget = client.getWidget(widgetId)
    setWidget(theWidget)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div />
  } else if(!widget) {
    return <div>Error loading widget</div>
  } else {
    const clientWidget: ComponentChild = (
      controlPanelMode ?
      widget.createControlWidget() :
      widget.createClientWidget()
    )
    return (
      <div>{clientWidget}</div>
    )
  }
}
