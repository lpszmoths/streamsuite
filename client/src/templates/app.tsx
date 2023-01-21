import { useEffect, useState } from 'preact/hooks'
import Route, { RouteParams } from '../components/route.tsx'
import { CLIENT_READY_EVENT } from '../events/client-ready-event.ts'
import type Client from '../singletons/client.ts'
import Dashboard from './dashboard.tsx'
import SingleWidget from './single-widget.tsx'

export interface AppProps {
  client: Client
}

export default function App({client}: AppProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(client.isLoading)

    if (client.isLoading) {
      client.addEventListener(
        CLIENT_READY_EVENT,
        () => {
          setIsLoading(client.isLoading)
        }
      )
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>

      <Route
        pattern='/'
        render={(_params: RouteParams) => {
          return (
            <Dashboard
              client={client}
            />
          )
        }}
      />

      <Route
        pattern='/widgets/:widgetId'
        render={(params: RouteParams) => {
          return (
            <SingleWidget
              client={client}
              widgetId={params.widgetId}
            />
          )
        }}
      />

      <link rel='stylesheet' href='/static/client.css'></link>

    </>
  )
}
