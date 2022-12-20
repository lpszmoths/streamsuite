export const CLIENT_READY_EVENT: string = 'client-ready'

export default class ClientReadyEvent extends Event {
  constructor() {
    super(CLIENT_READY_EVENT)
  }
}