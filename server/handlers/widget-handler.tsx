import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.6"
import Index from '../pages/index.tsx'
import { handleStaticContent } from './static-content-handler.tsx'
import { handleUpgradeWebsocketRequest } from "./upgrade-websocket-handler.tsx"
import { WIDGETS } from '../../widgets/index.ts'
import { WidgetNotFoundError } from "../errors/index.ts"
import { handleError } from "./error-handler.tsx"
import Widget from "../../common/widget.tsx"
import { IWidgetClass } from "../../common/widget-dictionary.ts"
import ServerState from "../singletons/server-state.ts"
import WidgetPage from "../pages/widget.tsx"
import { buildHtmlDoc } from "../util/html-builder.ts"
import { extname } from "https://deno.land/std@0.166.0/path/mod.ts"
import { pathToClient } from "../util/paths.ts"

export async function handleClientWidgetRequest(
  req: Request,
  serverState: ServerState
): Promise<Response> {
  console.log(`${req.method} ${req.url}`)

  const url = new URL(req.url)
  const urlParts = url.pathname.split('/')
  const widgetId = urlParts[2]

  if (!serverState.isWidgetInitialized(widgetId)) {
    return handleError(
      new WidgetNotFoundError(), {
      widgetId,
    })
  }

  // scan for custom content
  const customCssFiles: string[] = []
  const widgetOverridesDir = pathToClient(`theme-overrides/${widgetId}`)
  console.log(`overrides dir: ${widgetOverridesDir}`)
  try {
    const dir = await Deno.readDir(widgetOverridesDir)
    for await (const dirEntry of dir) {
      console.log('file found fo fum')
      console.log(dirEntry.name)
      if (extname(dirEntry.name)) {
        customCssFiles.push(
          `/theme-overrides/${widgetId}/${dirEntry.name}`
        )
      }
    }
  } catch(e) {
    console.log(`Failed to read ${widgetOverridesDir}`, e)
  }


  const htmlString = renderToString(
    <WidgetPage
      widgetId={widgetId}
      customCssFiles={customCssFiles}
    />
  )
  const html = buildHtmlDoc('Widget', htmlString)
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  })
  
  //return new Response(null, { status: 501 });
}
