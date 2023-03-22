import { BotIncomingMessage, IBot, IncomingMessageHandler } from "../bot-types.ts";
import CommandManager from "./command-manager.ts";
import { extractCommandExecutionRequestFromBotMessage } from "./commands-input-parser.ts";
import {
  CommandDefinition,
  CommandDefinitionDictionary,
  CommandExecutionRequest,
ICommandsPlugin
} from "./commands-types.ts";
import { render } from 'mustache'
import { createTemplateFunctions, MustacheFunction } from "./commands-template-functions-factory.ts";

export const COMMAND_DEFINITIONS_FILE = 'bot-commands.txt'

export default class CommandsPlugin
implements ICommandsPlugin {
  protected commandManager: CommandManager
  protected templateFunctions: {
    [key: string]: (() => MustacheFunction) | Function
  }

  constructor() {
    this.commandManager = new CommandManager()
    this.templateFunctions = createTemplateFunctions(this)
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

  getCommandDefinitions(): CommandDefinitionDictionary {
    return this.commandManager.getAllCommandDefinitions()
  }

  async loadCommandDefinitionsFromString(str: String) {
    this.commandManager.loadCommandDefinitionsFromFile
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
    console.log(`Running command ${commandName}`)
    const {response}: CommandDefinition = (
      this.commandManager.getCommandDefinition(
        commandName
      )
    )
    const view = {
      username,
      ...this.templateFunctions,
    }
    const renderedResponse = render(
      response,
      view
    )

    // TODO parse command using mustache
    bot.sendMessage(
      channel,
      renderedResponse
    )
  }

}