import { stub } from "std/testing/mock";
import { IMessageBroker } from "./message-broker.ts";

export default class MessageBrokerMock implements IMessageBroker {
  constructor() {
  }

  createChannel(channelId: string): void {
  }

  emitToChannel<T>(channelId: string, msg: T): void {
  }

  subscribeToChannel<T>(channelId: string, listener: (msg: T) => void): void {
  }
}