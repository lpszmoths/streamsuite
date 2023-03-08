import { assertEquals } from "std/testing/asserts"
import { BotIncomingMessage, BotOutgoingMessage, IBot, IncomingMessageHandler } from "../bot-types.ts"
import CommandsPlugin from "./commands-plugin.ts"
import commandsPlugin from './commands-plugin.ts' 

class MockBot implements IBot {
  incomingMessageHandler: IncomingMessageHandler | undefined
  messagesSent: BotOutgoingMessage[]

  constructor() {
    this.messagesSent = []
  }

  async simulateMessage(incomingMessage: BotIncomingMessage) {
    await this.incomingMessageHandler!(incomingMessage)
  }

  onIncomingMessage(listener: (message: BotIncomingMessage) => Promise<void>) {
    this.incomingMessageHandler = listener
  }

  sendMessage(channel: string, message: string) {
    this.messagesSent.push({
      channel,
      message,
    })
  }
}

Deno.test(
  'commandsPlugin: basic',
  async () => {
    const mockbot = new MockBot()
    const cp = new CommandsPlugin()
    const commandDefs = `
[!about]
About what?`
    cp.attachToBot(mockbot)
    await cp.loadCommandDefinitionsFromString(commandDefs)
    await mockbot.simulateMessage({
      userId: 'mothbob',
      username: 'mothbob',
      channel: 'mothbob_plays',
      message: '!about'
    })
    assertEquals(mockbot.messagesSent, [])
  }
)


