import { loadCommandDefinitionsFromFile } from "./commands-file-loader-utils.ts";
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

  async loadCommandDefinitionsFromFile(filename: string) {
    this.commandDefinitions = await loadCommandDefinitionsFromFile(filename)
    for (let key in this.commandDefinitions) {
      console.log(`Loaded command ${key}`)
    }
  }

  hasCommand(commandName: string): boolean {
    return commandName in this.commandDefinitions
  }
}