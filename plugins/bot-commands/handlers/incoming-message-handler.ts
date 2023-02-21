import { BotMessage } from "../bot-types.ts"

/**
 * Middleware that attempts to handle a message.
 * 
 * @returns false to pass the message to the
 *          next handler, true to stop propagation
 */
export type IncomingMessageHandler = (message: BotMessage) => Promise<boolean>
