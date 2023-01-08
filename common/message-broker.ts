import { Subject } from 'rxjs'

export interface IMessageBroker {
  createChannel(channelId: string): void

  emitToChannel<T>(
    channelId: string,
    msg: T
  ): void

  subscribeToChannel<T>(
    channelId: string,
    listener: (msg: T) => void
  ): void

  subscribeToAllChannels(
    listener: ({channelId, msg}: IAllChannelsMessage) => void
  ): void
}

export interface IAllChannelsMessage {
  channelId: string,
  msg: any,
}

export default class MessageBroker implements IMessageBroker {
  protected allChannels: Subject<IAllChannelsMessage>
  protected channels: {
    [key: string]: Subject<any>
  }

  constructor() {
    this.channels = {}
    this.allChannels = new Subject<IAllChannelsMessage>
  }

  private assertValidChannelId(
    channelId: string
  ) {
    if (!(channelId in this.channels)) {
      throw new Error(
        `Unknown channel ${channelId}`
      )
    }
  }

  createChannel(channelId: string) {
    this.channels[channelId] = new Subject<any>
    console.log(`Created channel ${channelId}`)
  }

  emitToChannel<T>(
    channelId: string,
    msg: T
  ) {
    this.assertValidChannelId(channelId)
    this.channels[channelId].next(msg)
    this.allChannels.next({
      channelId,
      msg,
    })
    console.log(`Message emitted to channel ${channelId}: ${JSON.stringify(msg)}`)
  }

  subscribeToChannel<T>(
    channelId: string,
    listener: (msg: T) => void
  ) {
    this.assertValidChannelId(channelId)
    this.channels[channelId].subscribe({
      next: listener as (msg: any) => void
    })
    console.log(`New subscriber on channel ${channelId}`)
  }

  subscribeToAllChannels(
    listener: ({channelId, msg}: IAllChannelsMessage) => void
  ) {
    this.allChannels.subscribe({
      next: listener
    })
    console.log(`New subscriber on all channels`)
  }
}
