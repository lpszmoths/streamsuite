import { CommandExecutionRequest } from "./commands-types.ts";

const COMMAND_REGEX = /^([^\w][\w\-]+)/

export function extractCommandExecutionRequestFromInput(
  input: string
): CommandExecutionRequest | null {
  if (!input.trim()) {
    return null
  }

  // extract everything prior to the first space
  const commandMatches = input.match(COMMAND_REGEX)
  if (!commandMatches) {
    return null
  }

  const commandName = commandMatches[1]
  const commandArgs: string[] = [] // TODO implement

  return {
    commandName,
    commandArgs,
  }
}
