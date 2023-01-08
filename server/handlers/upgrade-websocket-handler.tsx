import ServerState from "../singletons/server-state.ts"
import { generateId } from "../util/id-generation.ts"

export async function handleUpgradeWebsocketRequest(req: Request, serverState: ServerState) {
  const { socket: ws, response } = Deno.upgradeWebSocket(req)
  let clientId: string = generateId()

  ws.addEventListener('open', (ev: Event) => {
    serverState.addClient(clientId, ws)
    console.log(`WS: new connection`)
  })

  ws.addEventListener('close', (ev: Event) => {
    serverState.removeClient(clientId)
    console.log(`WS: connection closed`)
  })

  ws.addEventListener('message', (ev: MessageEvent) => {
    console.log(`WS: message: ${JSON.stringify(ev.data)}`)
  })

  ws.addEventListener('error', (ev: Event | ErrorEvent) => {
    console.error(
      ev instanceof ErrorEvent ?
      ev.message :
      ev.type
    )
  })

  return response
}
