import { loadFileSync } from "./commands-file-loader-utils.ts";
import { CommandDefinitionDictionary, ICommandsPlugin } from "./commands-types.ts";
import { render } from 'mustache'

export type MustacheFunction = (
  val: string,
  mustacheRender: typeof render
) => string

export function createTemplateFunctions(
  commandsPlugin: ICommandsPlugin
) {
  const listCommands: MustacheFunction = (
    val,
    _render
  ): string => {
    console.log('listing commands')
    const commandDefinitions: CommandDefinitionDictionary = commandsPlugin.getCommandDefinitions()
    const commandsList = Object.keys(commandDefinitions)
    const commandsListString = commandsList.join(', ')
    return `Commands: ${commandsListString}`
  }
  
  const pickRandomLine: MustacheFunction = (
    filename,
    _render
  ): string => {
    console.log(`picking random line from ${filename}`)
    const fileContents = loadFileSync(filename)
    const lines = fileContents
      .split(`\n`)
      .map((s: string) => s.trim())
      .filter((s: string) => !!s)
    const idx = Math.floor(lines.length * Math.random())
    return lines[idx]
  }

  return {
    'list-commands': listCommands,
    'pick-random-line': () => {
      return pickRandomLine
    }
  }
}
