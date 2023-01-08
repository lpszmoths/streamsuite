export function connectToWS(port: number): Promise<WebSocket> {
  return new Promise(
    (
      resolve: (ws: WebSocket) => void,
      reject: (e: Error) => void
    ) => {
      const wsUrl: string = (
        `ws://localhost:${port}`
      )
      const ws = new WebSocket(wsUrl)
      let isOpen: boolean = false
      ws.addEventListener('close', (ev: Event) => {
        console.log('WS connection closed')
      })
      ws.addEventListener('error', (ev: Event) => {
        console.error(
          ev instanceof ErrorEvent ?
          ev.message :
          ev.type
        )
        if (!isOpen) {
          reject(
            new Error('Unable to establish a Websocket connection: ' + ev.toString())
          )
        }
      })
      ws.addEventListener('open', (ev: Event) => {
        console.log('WS connected')
        isOpen = true
        resolve(ws)
      })
    }
  )
}