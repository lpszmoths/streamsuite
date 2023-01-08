import { Subject } from 'rxjs'

export interface IMessageBroker {
  createChannel(channelId: string): void

  receiveOnChannel<T>(
    channelId: string,
    msg: T
  ): void

  sendToChannel<T>(
    channelId: string,
    msg: T
  ): void

  onChannelMessageReceived<T>(
    channelId: string,
    listener: (msg: T) => void
  ): void

  onChannelMessageSent<T>(
    channelId: string,
    listener: (msg: T) => void
  ): void

  onMessageReceived(
    listener: ({channelId, msg}: IAllChannelsMessage) => void
  ): void

  onMessageSent(
    listener: ({channelId, msg}: IAllChannelsMessage) => void
  ): void
}

export interface IAllChannelsMessage {
  channelId: string,
  msg: any,
}

export default class MessageBroker implements IMessageBroker {
  protected allIncomingChannels: Subject<IAllChannelsMessage>
  protected allOutgoingChannels: Subject<IAllChannelsMessage>
  protected incomingChannels: {
    [key: string]: Subject<any>
  }
  protected outgoingChannels: {
    [key: string]: Subject<any>
  }

  constructor() {
    this.incomingChannels = {}
    this.outgoingChannels = {}
    this.allIncomingChannels = new Subject<IAllChannelsMessage>
    this.allOutgoingChannels = new Subject<IAllChannelsMessage>
  }

  private assertValidChannelId(
    channelId: string
  ) {
    if (!(channelId in this.incomingChannels)) {
      throw new Error(
        `Unknown channel ${channelId}`
      )
    }
    if (!(channelId in this.outgoingChannels)) {
      throw new Error(
        `Unknown channel ${channelId}`
      )
    }
  }

  createChannel(channelId: string) {
    this.incomingChannels[channelId] = new Subject<any>
    this.outgoingChannels[channelId] = new Subject<any>
    console.log(`Created channel ${channelId}`)
  }

  receiveOnChannel<T>(
    channelId: string,
    msg: T
  ) {
    this.assertValidChannelId(channelId)
    this.incomingChannels[channelId].next(msg)
    this.allIncomingChannels.next({
      channelId,
      msg,
    })
    console.log(`Message received on channel ${channelId}: ${JSON.stringify(msg)}`)
  }

  sendToChannel<T>(
    channelId: string,
    msg: T
  ) {
    this.assertValidChannelId(channelId)
    this.outgoingChannels[channelId].next(msg)
    this.allOutgoingChannels.next({
      channelId,
      msg,
    })
    console.log(`Message sent to channel ${channelId}: ${JSON.stringify(msg)}`)
  }

  onChannelMessageReceived<T>(
    channelId: string,
    listener: (msg: T) => void
  ) {
    this.assertValidChannelId(channelId)
    this.incomingChannels[channelId].subscribe({
      next: listener as (msg: any) => void
    })
    console.log(`New subscriber on incoming channel ${channelId}`)
  }

  onChannelMessageSent<T>(
    channelId: string,
    listener: (msg: T) => void
  ) {
    this.assertValidChannelId(channelId)
    this.outgoingChannels[channelId].subscribe({
      next: listener as (msg: any) => void
    })
    console.log(`New subscriber on outgoing channel ${channelId}`)
  }

  onMessageReceived(
    listener: ({channelId, msg}: IAllChannelsMessage) => void
  ) {
    this.allIncomingChannels.subscribe({
      next: listener
    })
    console.log(`New subscriber on all incoming channels`)
  }

  onMessageSent(
    listener: ({channelId, msg}: IAllChannelsMessage) => void
  ) {
    this.allOutgoingChannels.subscribe({
      next: listener
    })
    console.log(`New subscriber on all outgoing channels`)
  }
}
