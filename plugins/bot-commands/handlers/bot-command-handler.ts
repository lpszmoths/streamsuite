import { BotIncomingMessage, IBot } from '../../../bot/bot-types.ts'
import CommandManager from '../commands/command-manager.ts'
import { extractCommandExecutionRequestFromInput } from '../commands/commands-input-parser.ts'
import { IncomingMessageHandler } from './incoming-message-handler.ts'
import { CommandExecutionContext } from '../commands/commands-types.ts'
import MessageBroker from '../../../common/message-broker.ts'
import { executeCommand } from '../../../bot/commands/command-execution-utils.ts'

export function createBotCommandHandler(
  bot: IBot,
  commandManager: CommandManager,
  messageBroker: MessageBroker
): IncomingMessageHandler {
  return async ({
    channel,
    userId,
    username,
    message,
  }: BotIncomingMessage): Promise<boolean> => {
    const potentialCommandExecutionRequest =
      extractCommandExecutionRequestFromInput(
        message,
      )
    if (!potentialCommandExecutionRequest) {
      return false
    }

    const commandExecutionRequest = potentialCommandExecutionRequest!
    const {
      commandName
    } = commandExecutionRequest
    if (
      !commandManager.hasCommand(
        commandName
      )
    ) {
      return false
    }


    const commandDefinition = commandManager.getCommandDefinition(
      commandName
    )
    const commandExecutionContext: CommandExecutionContext =
      {
        channel,
        userId,
        username,
      }
    await executeCommand(
      bot,
      commandDefinition,
      commandExecutionContext,
      commandExecutionRequest
    )
    return true
  }
}
