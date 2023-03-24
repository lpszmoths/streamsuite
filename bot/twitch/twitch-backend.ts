import Backend from '../common/backend.ts'
import tmi, { Client as TMIClient } from 'tmi.js'

export interface TwitchOutgoingMessageType {
  channel: string
  message: string
}

export interface TwitchIncomingMessageType
extends TwitchOutgoingMessageType {
  userId: string
  username: string
}

export interface TwitchBackendOptions{
  twitchUsername: string
  twitchOauthToken: string
  channels: string[]
}

export default class TwitchBackend
extends Backend<
  TwitchIncomingMessageType,
  TwitchOutgoingMessageType
> {
  client: TMIClient

  constructor({
    twitchUsername,
    twitchOauthToken,
    channels
  }: TwitchBackendOptions) {
    super()
    this.client = new TMIClient({
      connection: {
        secure: true,
        reconnect: true,
      },
      options: {
        debug: true,
      },
      identity: {
        username: twitchUsername,
        password: twitchOauthToken,
      },
      channels,
    })
    console.log(`Initializing Twitch with credentials:`)
    console.log(`Username:`, twitchUsername)
    console.log(`Password:`, twitchOauthToken.replaceAll(/\w/g, '*'))
    console.log(`Channels:`, channels)
  }

  async connect() {
    await this.client.connect()

    this.client.on('join', (
      channel: string,
      username: string,
      self: boolean
    ) => {
      if (self) {
        return
      }

      console.log(`${username} has joined ${channel}`)
    })
    this.client.on('part', (
      channel: string,
      username: string,
      self: boolean
    ) => {
      if (self) {
        return
      }

      console.log(`${username} has left ${channel}`)
    })
  }

  async sendMessage({
    channel,
    message
  }: TwitchOutgoingMessageType): Promise<void> {
    await this.client.say(
      channel,
      message
    )
  }

  onMessageReceived(
    listener: (
      msg: TwitchIncomingMessageType
    ) => any
  ): void {
    this.client.on(
      'message',
      (
        channel,
        userstate,
        message,
        self
      ) => {
        channel = channel.replace(
          /^#/,
          ''
        )
        if (!self) {
          listener({
            channel,
            userId: userstate['user-id'] || 'nobody',
            username: userstate.username || 'nobody',
            message
          })
        }
      }
    )
  }

}