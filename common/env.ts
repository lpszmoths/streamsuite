import { config } from "dotenv";

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 8007

const envData = await config()

export function getEnvString(
  key: string,
  defaultValue?: string
): string | undefined {
  if (Deno.env.get(key)) {
    return Deno.env.get(key)!
  } else if(key in envData) {
    return envData[key]!
  }
  return defaultValue
}

export function getEnvInt(
  key: string,
  defaultValue?: number
): number | undefined {
  if (Deno.env.get(key)) {
    const maybeNumber = parseInt(Deno.env.get(key)!)
    if (maybeNumber) { // is not NaN
      return maybeNumber as number
    }
  }

  if(key in envData) {
    const maybeNumber = parseInt(key)
    if (maybeNumber) { // is not NaN
      return maybeNumber as number
    }
  }

  return defaultValue 
}

export function getHost(): string {
  return getEnvString(
    'HOST',
    DEFAULT_HOST
  )!
}

export function getPort(): number {
  return getEnvInt(
    'PORT',
    DEFAULT_PORT
  )!
}
