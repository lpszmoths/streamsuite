import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.6"
import Index from '../pages/index.tsx'
import ServerState from "../singletons/server-state.ts"
import { handleStaticContent } from './static-content-handler.tsx'
import { handleUpgradeWebsocketRequest } from "./upgrade-websocket-handler.tsx"
import { handleClientWidgetRequest } from "./widget-handler.tsx"
import { buildHtmlDoc } from '../util/html-builder.ts'
import { APP_NAME } from "../../common/constants.ts"

export async function handleRequest(
  req: Request,
  serverState: ServerState
): Promise<Response> {
  console.log(`${req.method} ${req.url}`)

  if (req.headers.get("upgrade") == "websocket") {
    return await handleUpgradeWebsocketRequest(req, serverState)
  }

  const url = new URL(req.url)
  const urlParts = url.pathname.split('/')
  
  //let match
  if (req.method === 'GET') {
    if (
      urlParts[1] === 'static' ||
      urlParts[1] === 'theme-overrides' ||
      urlParts[1] === 'dist'
    ) {
      return await handleStaticContent(req)
    }
    else if (
      urlParts[1] === 'widgets'
    ) {
      return await handleClientWidgetRequest(req, serverState)
    }
    else {
      const htmlString = renderToString(<Index serverState={serverState} />);
      const html = buildHtmlDoc(APP_NAME, htmlString)
      return new Response(html, {
        headers: {
          "content-type": "text/html",
        },
      })
    }
  }
  
  return new Response(null, { status: 501 });
}
