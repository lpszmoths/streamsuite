import { BotIncomingMessage } from "../bot-types.ts"

export interface CommandDefinition {
  command: string
  modOnly?: boolean
  response: string
}

export type CommandDefinitionDictionary = { [key: string]: CommandDefinition }

export interface CommandExecutionRequest
extends BotIncomingMessage {
  commandName: string
  commandArgs?: string[]
}

export interface CommandExecutionContext {
  channel: string
  userId: string
  username: string

}

export interface ICommandsPlugin {
  getCommandDefinitions: () => CommandDefinitionDictionary
}
