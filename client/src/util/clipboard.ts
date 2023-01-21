export function copyURL(url: string): Promise<void> {
  return navigator.clipboard.writeText(url)
}