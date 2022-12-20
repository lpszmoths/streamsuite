export async function handleUpgradeWebsocketRequest(req: Request) {
  const { socket: ws, response } = Deno.upgradeWebSocket(req);

  ws.addEventListener('open', (ev: Event) => {
    console.log(`WS: new connection`)
  })

  ws.addEventListener('close', (ev: Event) => {
    console.log(`WS: connection closed`)
  })

  ws.addEventListener('message', (ev: MessageEvent) => {
    console.log(`WS: message:`, ev.data)
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
