import { config } from "dotenv";

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 8007

const envData = await config()

export function getHost(): string {
  if (Deno.env.get('HOST')) {
    return Deno.env.get('HOST')!
  } else if('HOST' in envData) {
    return envData['HOST']!
  }
  return DEFAULT_HOST
}

export function getPort(): number {
  if (Deno.env.get('PORT')) {
    const maybePort = parseInt(Deno.env.get('PORT')!)
    if (maybePort) { // is not NaN
      return maybePort as number
    }
  }

  if('PORT' in envData) {
    const maybePort = parseInt(envData['PORT'])
    if (maybePort) { // is not NaN
      return maybePort as number
    }
  }

  return DEFAULT_PORT
}