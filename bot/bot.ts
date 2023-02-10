import MetaBackend,
{
  MetaBackendIncomingMessage,
  MetaBackendOptions
} from './meta/meta-backend.ts'
import MessageBroker, { IAllChannelsMessage } from '../common/message-broker.ts'
import { BotIncomingMessage, BotOptions, BotOutgoingMessage, IncomingMessageHandler } from './bot-types.ts'

export default class Bot {
  metaBackend: MetaBackend
  messageBroker: MessageBroker

  constructor(
    {
      twitchOptions
    }: BotOptions
  ) {
    const opts: MetaBackendOptions = {}
    this.messageBroker = new MessageBroker()

    if (twitchOptions) {
      opts.twitch = twitchOptions
      twitchOptions.channels.forEach(
        channel => {
          this.messageBroker.createChannel(
            `bot:${channel}`
          )
        }
      )
    }

    this.metaBackend = new MetaBackend(
      opts
    )
    this.metaBackend.onMessageReceived(
      ({
        channel,
        userId,
        username,
        message
      }: MetaBackendIncomingMessage) => {
        this.messageBroker.receiveOnChannel<
          BotIncomingMessage
        >(
          `bot:${channel}`,
          {
            channel,
            userId,
            username,
            message
          }
        )
      }
    )

    this.messageBroker.onMessageSent(
      ({
        channelId,
        msg: botOutgoingMessage
      }) => {
        if (
          !channelId.startsWith('bot:')
        ) {
          return
        }

        const channel = channelId.replace(
          /^bot:/,
          ''
        )
        const {
          message
        } = botOutgoingMessage
        this.metaBackend.sendMessage({
          channel,
          message,
        })
      }
    )
  }

  onIncomingMessage(
    handler: IncomingMessageHandler
  ) {
    this.messageBroker.onMessageReceived(
      async ({
        channelId,
        msg
      }: IAllChannelsMessage) => {
        if (channelId.match(/^bot:/)) {
          const botMessage = msg as BotIncomingMessage
          await handler(botMessage)
        }
      }
    )
  }

  async connect() {
    await this.metaBackend.connect()
  }

  sendMessage(
    channel: string,
    message: string
  ): void {
    const botOutgoingMessage: BotOutgoingMessage = {
      channel,
      message
    }
    this.messageBroker.sendToChannel(
      `bot:${channel}`,
      botOutgoingMessage
    )
  }
}