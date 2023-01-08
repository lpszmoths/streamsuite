export class ClientManager {
  clients: { [key: string]: WebSocket }

  constructor() {
    this.clients = {}
  }

  addClient(id: string, socket: WebSocket) {
    console.log(`Adding client ${id}`)
    this.clients[id] = socket
  }

  forEachClient(cb: (socket: WebSocket, id: string) => any) {
    for (let k in this.clients) {
      const client: WebSocket = this.clients[k]
      cb(client, k)
    }
  }

  removeClient(id: string) {
    console.log(`Adding client ${id}`)
    delete this.clients[id]
  }
}
