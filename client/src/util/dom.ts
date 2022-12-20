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
