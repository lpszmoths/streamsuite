import Backend from '../common/backend.ts'
import TwitchBackend,
{
  TwitchIncomingMessageType,
  TwitchBackendOptions
} from '../twitch/twitch-backend.ts'

export interface MetaBackendOutgoingMessage {
  channel: string
  message: string
}

export interface MetaBackendIncomingMessage
extends MetaBackendOutgoingMessage {
  userId: string
  username: string
}

export interface MetaBackendOptions {
  twitch?: TwitchBackendOptions
}
export default class MetaBackend
extends Backend<
  MetaBackendIncomingMessage,
  MetaBackendOutgoingMessage
> {
  childBackends: {
    [key: string]: Backend<any, any>
  }

  constructor(
    protected options: MetaBackendOptions
  ) {
    super()
    this.childBackends = {}
    if (options.twitch) {
      const {
        twitchUsername,
        twitchOauthToken,
        channels
      } = options.twitch
      this.childBackends.twitch = (
        new TwitchBackend({
          twitchUsername,
          twitchOauthToken,
          channels,
        })
      )
      console.log(`Initialized Twitch backend`)
    }
  }

  async connect(): Promise<void> {
    if (
      this.childBackends.twitch
    ) {
      await this.childBackends.twitch.connect()
    }
  }

  async sendMessage({
    channel,
    message
  }: MetaBackendOutgoingMessage): Promise<void> {
    if (
      this.childBackends.twitch
    ) {
      const twitchBackend: TwitchBackend = (
        this.childBackends.twitch as
        TwitchBackend
      )
      // TODO parallelize sendMessage calls
      await twitchBackend.sendMessage({
        channel,
        message,
      })
    }
  }

  onMessageReceived(
    listener: (
      msg: MetaBackendIncomingMessage
    ) => any
  ): void {
    if(
      this.childBackends.twitch
    ) {
      const twitchBackend: TwitchBackend = (
        this.childBackends.twitch as
        TwitchBackend
      )
      twitchBackend.onMessageReceived(
        ({
          channel,
          userId,
          username,
          message,
        }: TwitchIncomingMessageType) => {
          listener({
            channel,
            userId,
            username,
            message
          })
        }
      )
    }
  }

}