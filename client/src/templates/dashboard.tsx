import { useEffect, useState } from 'preact/hooks'
import { ComponentChild } from 'preact'
import Widget from '../../../common/widget.tsx'
import type Client from '../singletons/client.ts'
import SingleWidget from './single-widget.tsx'
import WIDGETS from '../../../widgets/index.ts'

export interface DashboardProps {
  client: Client
}

export default function Dashboard({client}: DashboardProps) {
  const widgets = client.getEnabledWidgets()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    widgets.forEach((widgetId: string) => {
      client.initWidget(widgetId)
    })
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container" style={{'marginTop': '4rem'}}>
      <div className="row">
        <div className="column">
          <h4>Widget dashboard</h4>
          <p>Control your widgets from here.</p>
        </div>
      </div>
      {
        widgets.map((widgetId: string, i: number) => {
          const widget: Widget = client.getWidget(widgetId)
          return (
            <div
              key={i}
              className='row'
            >
              <div className='column'>
                <div className='row'>
                  <div className='one-half column'>
                    <h3>{widgetId}</h3>
                    <div>
                      <SingleWidget
                        client={client}
                        widgetId={widgetId}
                        controlPanelMode={true}
                      />
                    </div>
                  </div>
                  <div className='one-half column'>
                    <section className='card'>
                      <header>
                        <strong>Live preview</strong>
                      </header>
                      <div>
                        <SingleWidget
                          client={client}
                          widgetId={widgetId}
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
