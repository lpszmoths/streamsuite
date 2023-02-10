import { TwitchBackendOptions } from "./twitch/twitch-backend.ts";

export interface BotOptions {
  twitchOptions?: TwitchBackendOptions
}

export interface BotOutgoingMessage {
  channel: string
  message: string
}

export interface BotIncomingMessage extends BotOutgoingMessage {
  userId: string
  username: string
}

export type IncomingMessageHandler = (message: BotIncomingMessage) => Promise<any>

export interface IBot {
  onIncomingMessage: (
    listener: (message: BotIncomingMessage) => Promise<void>
  ) => void

  sendMessage: (
    channel: string,
    message: string
  ) => void
}
