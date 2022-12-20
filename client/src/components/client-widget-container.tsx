import { MutableRef, useEffect, useRef } from 'preact/hooks'
import Widget from '../../../common/widget.tsx'

export interface ClientWidgetContainerProps {
  widget: Widget
}

export default function WidgetContainer(
  {widget}: ClientWidgetContainerProps
) {

  const container = useRef<HTMLDivElement>(null)
  //const clientWidget = widget.createClientWidget()

  useEffect(() => {
    widget.createClientWidget()
  }, [])

  return (
    <div
      ref={container}
    >
      {
        // keys.map((key: string, i: number) => {
        //   const widget: Widget = widgets[key]
          
        // })
      }
    </div>
  )
}
