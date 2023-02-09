import { assertEquals } from "std/testing/asserts"
import { parseIniFileContents } from './ini-file-parser.ts'

Deno.test(
  'parseIniFileContents: empty file',
  () => {
    const input = `  
              
          `
    const output = parseIniFileContents(input)
    assertEquals(output, {})
  }
)

Deno.test(
  'parseIniFileContents: assignments without a header',
  () => {
    const input = `type = kitty`
    const output = parseIniFileContents(input)
    assertEquals(output, {})
  }
)

Deno.test(
  'parseIniFileContents: happy path',
  () => {
    const input = `[schubbe]
    type = kitty
    status = OK
    
    [uschwe]
    type = moth
    status = dormant
    `
    const output = parseIniFileContents(input)
    assertEquals(output, {
      schubbe: {
        type: 'kitty',
        status: 'OK',
      },
      uschwe: {
        type: 'moth',
        status: 'dormant',
      },
    })
  }
)

Deno.test(
  'parseIniFileContents: header only',
  () => {
    const input = `[schubbe]`
    const output = parseIniFileContents(input)
    assertEquals(output, { schubbe: {} })
  }
)
