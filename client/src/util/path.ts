export function getWidgetURI(widgetId: string): string {
  return `/widgets/${widgetId}`
}

export function getWidgetPermalink(widgetId: string): string {
  const serverBaseUrl = window.location.origin
  const widgetUri = getWidgetURI(widgetId)
  return `${serverBaseUrl}${widgetUri}`
}