import { Observable, Subscriber, Subject } from 'https://esm.sh/rxjs'

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
}

export default class MessageBroker implements IMessageBroker {
  protected channels: {
    [key: string]: Subject<any>
  }

  constructor() {
    this.channels = {}
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
    console.log(`Message emitted to channel ${channelId}`)
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
}
