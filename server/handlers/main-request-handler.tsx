import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.6"
import Index from '../pages/index.tsx'
import ServerState from "../singletons/server-state.ts"
import { handleStaticContent } from './static-content-handler.tsx'
import { handleUpgradeWebsocketRequest } from "./upgrade-websocket-handler.tsx"
import { handleClientWidgetRequest } from "./widget-handler.tsx"

export async function handleRequest(
  req: Request,
  serverState: ServerState
): Promise<Response> {
  console.log(`${req.method} ${req.url}`)

  if (req.headers.get("upgrade") == "websocket") {
    return await handleUpgradeWebsocketRequest(req)
  }

  const url = new URL(req.url)
  const urlParts = url.pathname.split('/')
  
  //let match
  if (req.method === 'GET') {
    if (
      urlParts[1] === 'static' ||
      urlParts[1] === 'dist'
    ) {
      return await handleStaticContent(req)
    }
    // else if (urlParts[1] === 'widgets') {
    //   return await handleClientWidgetRequest(req, serverState)
    // }
    else {
      const html = renderToString(<Index serverState={serverState} />);
      return new Response(html, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
    // if (url.pathname === '/') {
    //   const html = renderToString(<Index serverState={serverState} />);
    //   return new Response(html, {
    //     headers: {
    //       "content-type": "text/html",
    //     },
    //   });
    // }
    // else if (urlParts[1] === 'widgets') {
    //   return await handleClientWidgetRequest(req, serverState)
    // }
    // else {
    //   return await handleStaticContent(req)
    // }
  }
  
  return new Response(null, { status: 501 });
}
