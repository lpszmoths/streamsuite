import { config } from 'dotenv'
import MetaBackend,
{
  MetaBackendIncomingMessage,
  MetaBackendOutgoingMessage,
  MetaBackendOptions
} from './meta/meta-backend.ts'
import MessageBroker from '../common/message-broker.ts'
import { TwitchBackendOptions } from './twitch/twitch-backend.ts'

export interface BotOptions {
  twitchOptions?: TwitchBackendOptions
}

export interface BotMessage {
  userId: string
  username: string
  message: string
}

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
          BotMessage
        >(
          `bot:${channel}`,
          {
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
        msg
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
        this.metaBackend.sendMessage({
          channel,
          message: msg,
        })
      }
    )
  }

  async connect() {
    await this.metaBackend.connect()
  }

  private async sendMessage(
    channel: string,
    message: string
  ): Promise<void> {
    await this.metaBackend.sendMessage({
      channel,
      message
    })
  }
}