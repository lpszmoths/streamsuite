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

  const html = renderToString(<WidgetPage widgetId={widgetId} />);
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
  
  //return new Response(null, { status: 501 });
}
