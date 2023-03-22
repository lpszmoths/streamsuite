import { loadFile, loadCommandDefinitionsFromString } from "./commands-file-loader-utils.ts";
import {
  CommandDefinition,
  CommandDefinitionDictionary
} from "./commands-types.ts";

export default class CommandManager {
  protected commandDefinitions: CommandDefinitionDictionary

  constructor() {
    this.commandDefinitions = {}
  }

  getCommandDefinition(
    commandName: string
  ): CommandDefinition {
    return this.commandDefinitions[commandName]
  }

  getAllCommandDefinitions(): CommandDefinitionDictionary {
    return this.commandDefinitions
  }

  async loadCommandDefinitionsFromFile(filename: string) {
    var commandDefinitionsStr = await loadFile(filename)
    await this.loadCommandDefinitionsFromString(commandDefinitionsStr)
  }

  async loadCommandDefinitionsFromString(str: string) {
    this.commandDefinitions = await loadCommandDefinitionsFromString(str)
    for (let key in this.commandDefinitions) {
      console.log(`Loaded command ${key}`)
    }
  }

  hasCommand(commandName: string): boolean {
    return commandName in this.commandDefinitions
  }
}