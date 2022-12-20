import { docReady } from './util/dom.ts'
import { render } from 'preact'
import App from './templates/app.tsx'
import Client from './singletons/client.ts'

// function exportClient(theClient: Client) {
//   (window as any).client = theClient
// }

function mount(theClient: Client) {
  const mainContainer: HTMLElement = document.getElementById('main')!
  render(<App client={theClient}/>, mainContainer)
  console.log('mounted')
}

docReady(async () => {
  try {
    const client: Client = new Client(document.getElementById('main')!)
    //exportClient(client)
    mount(client)
    await client.connect()
  } catch(e) {
    throw e
  }
})
