import { MutableRef, useEffect, useRef } from 'preact/hooks'
import Widget from '../../../common/widget.tsx'

export interface ClientWidgetContainerProps {
  widgets: { [key: string]: Widget }
}

export function ClientWidgetWrapper(
  {widget}: {widget: Widget}
) {
  return (
    <div>
      { widget.createClientWidget() }
    </div>
  )
}

export default function WidgetContainer(
  {widgets}: ClientWidgetContainerProps
) {
  const keys = Object.keys(widgets)

  return (
    <div
    >
      {
        keys.map((key: string, i: number) => {
          const widget: Widget = widgets[key]
          return (
            <div
              key={i}
            >
              <ClientWidgetWrapper
                widget={widget}
              />
            </div>
          )
        })
      }
    </div>
  )
}
