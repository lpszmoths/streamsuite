import { useState } from "preact/hooks";
import ClientScripts from "../components/client-scripts.tsx";
import { generateId } from '../util/id-generation.ts'

export interface WidgetPageProps {
  widgetId: string
  customCssFiles: string[]
}

export default function WidgetPage({widgetId, customCssFiles}: WidgetPageProps) {
  return (
    <div>
      <main id='main'>
      </main>
      <ClientScripts/>
      {
        customCssFiles.map((href: string) => (
          <link
            rel='stylesheet'
            href={href}
          />
        ))
      }
      <script>
        client.initWidget('{widgetId}');
        client.mountClientWidget('{widgetId}');
      </script>
    </div>
  )
}
