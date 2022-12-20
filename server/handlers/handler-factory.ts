import type ServerState from "../singletons/server-state.ts"
import { handleRequest } from "./main-request-handler.tsx"

export function createMainRequestHandler(serverState: ServerState) {
  return async (req: Request): Promise<Response> => {
    return await handleRequest(req, serverState)
  }
}