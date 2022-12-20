import { join, resolve } from "https://deno.land/std@0.166.0/path/mod.ts"

export function getBasePath(): string {
  return resolve('.')
}

export function pathToClientDist(path: string = ''): string {
  return resolve(
    join(
      getBasePath(),
      'client',
      path
    )
  )
}

export function pathToStatic(path: string = ''): string {
  return resolve(
    join(
      getBasePath(),
      'client',
      path
    )
  )
}

export function pathToClient(path: string = ''): string {
  return resolve(
    join(
      getBasePath(),
      'client',
      path
    )
  )
}