import { useEffect, useState } from 'preact/hooks'
import { ComponentChild } from 'preact'
import Widget from '../../../common/widget.tsx'
import type Client from '../singletons/client.ts'
import SingleWidget from './single-widget.tsx'
import WIDGETS from '../../../widgets/index.ts'
import { copyURL } from '../util/clipboard.ts'
import { getWidgetPermalink } from '../util/path.ts'
import { WithClient } from '../common/with-client.ts'
import TOC, { TOCItem } from '../components/toc.tsx'

export function DashboardTOC({client}: WithClient) {
  const widgets = client.getEnabledWidgets()
  const items: TOCItem[] = widgets.map((widgetId: string): TOCItem => {
    const widgetName = client.getWidget(widgetId).name
    const widgetHref = `#${widgetId}`
    return {
      href: widgetHref,
      label: widgetName,
    }
  })
  return (
    <TOC items={items} />
  )
}

function copyWidgetURL(url: string) {
  copyURL(url).then(() => {
    alert('Copied!')
  })
}

export interface DashboardProps extends WithClient {}

export default function Dashboard({client}: WithClient) {
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
    <div className="dashboard">
      <div className="dashboard-nav-container">
        <h4>Widget dashboard</h4>
        <p>Control your widgets from here.</p>
        <DashboardTOC
          client={client}
        />
      </div>
      <div className="dashboard-widgets">
        {
          widgets.map((widgetId: string, i: number) => {
            const widget: Widget = client.getWidget(widgetId)
            const widgetPermalink: string = getWidgetPermalink(widgetId)
            return (
              <section
                key={i}
                className='dashboard-widget-section'
              >
                <div className='dashboard-widget-control-panel-container'>
                  <h3>{widget.name}</h3>
                  <div>
                    <SingleWidget
                      client={client}
                      widgetId={widgetId}
                      controlPanelMode={true}
                    />
                  </div>
                </div>
                <div className='dashboard-widget-client-container card'>
                  <header>
                    <strong>Client widget</strong>
                  </header>
                  <div>
                    <iframe
                      width={120}
                      height={120}
                      src={widgetPermalink}
                    />
                  </div>
                  <footer>
                    <div className='flex-stretch-list horizontal'>
                      <input
                        className='flex-stretch-list-full'
                        readOnly
                        value={widgetPermalink}
                      />
                      <button
                        onClick={
                          () => copyWidgetURL(widgetPermalink)
                        }
                      >⧉ Copy</button>
                    </div>
                  </footer>
                </div>
              </section>
            )
          })
        }
      </div>
    </div>
  )
}
