import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts"
import { pathToClientDist } from './paths.ts'

Deno.test(
  'pathToClientDist: default',
  () => {
    const path = pathToClientDist()
    assertEquals(path, `${Deno.cwd()}/client/dist`)
  }
)

Deno.test(
  'pathToClientDist: /asset.js',
  () => {
    const path = pathToClientDist('/asset.js')
    assertEquals(path, `${Deno.cwd()}/client/dist/asset.js`)
  }
)
