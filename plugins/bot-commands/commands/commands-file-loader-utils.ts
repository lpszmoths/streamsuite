import { parseIniFileContents } from "../../common/ini-file-parser.ts"
import { CommandDefinition, CommandDefinitionDictionary } from "./commands-types.ts"

const COMMAND_REGEX_PATTERN = /^[^\w]/
const COMMAND_RESPONSE_NAME = 'response'
const COMMAND_ROLE_NAME = 'role'

export async function loadCommandDefinitionsFromFile(filename: string) {
  const decoder = new TextDecoder('utf-8')
  const fileContentsRaw: Uint8Array = await Deno.readFile(filename)
  const fileContentsStr: string = decoder.decode(fileContentsRaw)
  return loadCommandDefinitionsFromString(fileContentsStr)
}

export function loadCommandDefinitionsFromString(
  definitionsStr: string
): CommandDefinitionDictionary {
  const parseResults = parseIniFileContents(definitionsStr)
  const parsedDict: CommandDefinitionDictionary = {}
  
  for (let commandName in parseResults) {
    if (!commandName.match(COMMAND_REGEX_PATTERN)) {
      throw new Error(
        `Invalid command name: ${commandName}. ` +
        `Commands must begin with a special ` +
        `character such as !$@. Try !${commandName}`
      )
    }

    const parseResultsCommand = parseResults[commandName]
    const commandCode = parseResultsCommand[COMMAND_RESPONSE_NAME]
    const commandRole = parseResultsCommand[COMMAND_ROLE_NAME]

    const commandDefinition: CommandDefinition = {
      command: commandName,
      response: commandCode,
      modOnly: commandRole === 'Moderator'
    }
    parsedDict[commandName] = commandDefinition
  }

  return parsedDict
}