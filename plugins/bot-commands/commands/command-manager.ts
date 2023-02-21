import { loadCommandDefinitionsFromFile } from "./commands-file-loader-utils.ts";
import { CommandDefinition, CommandDefinitionDictionary, CommandExecutionContext, CommandExecutionRequest } from "./commands-types.ts";

export default class CommandManager {
  protected commandDefinitions: CommandDefinitionDictionary

  constructor() {
    this.commandDefinitions = {}
  }

  async loadCommandDefinitionsFromFile(filename: string) {
    this.commandDefinitions = await loadCommandDefinitionsFromFile(filename)
    for (let key in this.commandDefinitions) {
      console.log(`Loaded command ${key}`)
    }
  }

  async executeCommand(
    {
      commandName,
      commandArgs
    }: CommandExecutionRequest,
    {
      userId,
      username
    }: CommandExecutionContext
  ) {
    console.log(`Executing command ${commandName} requested by ${username}`)
    const definition: CommandDefinition = this.commandDefinitions[commandName]!

  }

  hasCommand(commandName: string): boolean {
    return commandName in this.commandDefinitions
  }
}