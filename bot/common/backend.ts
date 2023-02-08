export interface IBackend<
  IncomingMessageType,  
  OutgoingMessageType
> {
  connect(): Promise<void>
  sendMessage(msg: OutgoingMessageType): Promise<void>
  onMessageReceived(
    listener: (msg: IncomingMessageType) => any
  ): void
}

export default abstract class Backend<
  IncomingMessageType,
  OutgoingMessageType
>
implements IBackend<
  IncomingMessageType,
  OutgoingMessageType
> {
  abstract connect(): Promise<void>
  abstract sendMessage(msg: OutgoingMessageType): Promise<void>
  abstract onMessageReceived(listener: (msg: IncomingMessageType) => any): void
}