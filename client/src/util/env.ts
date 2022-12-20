export function getEnv<T>(key: string): T {
  const value = (window as any)[key] as T
  if (typeof value === 'undefined') {
    throw new Error(
      `Environment variable ${key} ` +
      `not found. Make sure you are ` +
      `accessing the stream client from ` +
      `the stream server and that the ` +
      `page is not cached.`
    )
  }
  return value
}