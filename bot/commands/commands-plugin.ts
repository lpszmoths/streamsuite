import { BotIncomingMessage, IBot, IncomingMessageHandler } from "../bot-types.ts";
import CommandManager from "./command-manager.ts";
import { extractCommandExecutionRequestFromBotMessage } from "./commands-input-parser.ts";
import {
  CommandDefinition,
  CommandExecutionRequest
} from "./commands-types.ts";

export const COMMAND_DEFINITIONS_FILE = 'bot-commands.txt'

export default class CommandsPlugin {
  protected commandManager: CommandManager

  constructor() {
    this.commandManager = new CommandManager()
  }

  attachToBot(
    bot: IBot
  ) {
    const incomingMessageHandler: IncomingMessageHandler = (
      async (botIncomingMessage: BotIncomingMessage) => {
        const potentialCommandExecutionRequest = (
          extractCommandExecutionRequestFromBotMessage(
            botIncomingMessage,
          )
        )
        if (!potentialCommandExecutionRequest) {
          return false
        }

        if (!this.commandManager.hasCommand(
          potentialCommandExecutionRequest!.commandName
        )) {
          return false
        }

        return await this.executeRequest(
          bot,
          potentialCommandExecutionRequest!
        )
      }
    )
    bot.onIncomingMessage(
      incomingMessageHandler
    )
  }

  async readConfiguration() {
    console.log(`Reading configuration from ${COMMAND_DEFINITIONS_FILE}`)
    await this.commandManager.loadCommandDefinitionsFromFile(COMMAND_DEFINITIONS_FILE)
  }

  private async executeRequest(
    bot: IBot,
    {
      channel,
      userId,
      username,
      commandName,
      commandArgs
    }: CommandExecutionRequest
  ): Promise<void> {
    const definition: CommandDefinition = (
      this.commandManager.getCommandDefinition(
        commandName
      )
    )

    // TODO parse command using mustache
    bot.sendMessage(
      channel,
      definition.response
    )
  }

}