import { useState } from "preact/hooks";
import ClientScripts from "../components/client-scripts.tsx";
import { generateId } from '../util/id-generation.ts'

export interface WidgetPageProps {
  widgetId: string
}

export default function WidgetPage({widgetId}: WidgetPageProps) {
  return (
    <div>
      <main id='main'>
      </main>
      <ClientScripts/>
      <script>
        client.initWidget('{widgetId}');
        client.mountClientWidget('{widgetId}');
      </script>
    </div>
  )
}
