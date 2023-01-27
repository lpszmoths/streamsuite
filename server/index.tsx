import { serve } from "http"
import WIDGETS from "../widgets/index.ts"
import { createMainRequestHandler } from "./handlers/handler-factory.ts"
import { handleRequest } from './handlers/main-request-handler.tsx'
import ServerState from "./singletons/server-state.ts"
import { getHost, getPort } from "./util/env.ts"

const HOST: string = getHost()
const PORT: number = getPort()

const serverState: ServerState = new ServerState()
for (let k in WIDGETS) {
  serverState.initWidget(k)
}

const mainRequestHandler = createMainRequestHandler(serverState)

serve(
  mainRequestHandler,
  {
    hostname: HOST,
    port: PORT,
    onListen(params: {hostname: string, port: number}) {
      const { hostname, port } = params
      console.log('Listening on:')
      console.log(`http://${hostname}:${port}`)
    }
  }
);
