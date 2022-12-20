import { serve } from "https://deno.land/std@0.166.0/http/mod.ts"
import WIDGETS from "../widgets/index.ts"
import { createMainRequestHandler } from "./handlers/handler-factory.ts"
import { handleRequest } from './handlers/main-request-handler.tsx'
import ServerState from "./singletons/server-state.ts"

const PORT: number = (
    Deno.env.get('PORT') &&
    parseInt(Deno.env.get('PORT')!)
  ) || 8000

const serverState: ServerState = new ServerState()
for (let k in WIDGETS) {
  serverState.initWidget(k)
}

const mainRequestHandler = createMainRequestHandler(serverState)

serve(
  mainRequestHandler,
  {
    port: PORT,
    onListen(params: {hostname: string, port: number}) {
      const { hostname, port } = params
      console.log('Listening on:')
      console.log(`http://${hostname}:${port}`)
    }
  }
);
