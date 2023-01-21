export function docReady(fn: () => any) {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(fn, 1)
  } else {
    document.addEventListener(
      'DOMContentLoaded',
      fn
    )
  }
}

export function loadCssFile(uri: string): void {
  const links = document.getElementsByTagName('link')
  for (let i = 0; i < links.length; i++) {
    const link: HTMLLinkElement = links[i]
    if (link.href === uri) {
      return
    }
  }

  const newLink: HTMLLinkElement = document.createElement('link')
  newLink.rel = 'stylesheet'
  newLink.href = uri
  document.body.appendChild(newLink)
}
