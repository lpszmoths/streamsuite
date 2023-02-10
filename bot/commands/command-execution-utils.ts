import { IBot } from "../bot-types.ts";
import { CommandDefinition, CommandExecutionContext, CommandExecutionRequest } from "./commands-types.ts";

export async function executeCommand(
  bot: IBot,
  commandDefinition: CommandDefinition,
  commandExecutionContext: CommandExecutionContext,
  commandExecutionRequest: CommandExecutionRequest
): Promise<void> {
  const {
    modOnly,
    response
  } = commandDefinition
  const {
    channel,
    userId,
    username
  } = commandExecutionContext
  const {
    commandName,
    commandArgs
  } = commandExecutionRequest
  const commandOutput = commandDefinition.response // TODO parse this with mustache
  bot.sendMessage(
    channel,
    response
  )
}
