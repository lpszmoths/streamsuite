import type ServerState from "../singletons/server-state.ts";

export default interface PropsWithServerState {
  serverState: ServerState
}
