import Bot, { BotOptions } from './bot.ts'
import { getEnvString } from '../common/env.ts'

const TWITCH_USERNAME = getEnvString('TWITCH_USERNAME')
const TWITCH_OAUTH_TOKEN = getEnvString('TWITCH_OAUTH_TOKEN')
const TWITCH_CHANNELS_RAW = getEnvString('TWITCH_CHANNELS')

const enableTwitch: boolean = !!(
  TWITCH_USERNAME &&
  TWITCH_OAUTH_TOKEN &&
  TWITCH_CHANNELS_RAW
)
if (!enableTwitch) {
  console.log('Twitch environment variables not found. Disabling Twitch.')
}

const options: BotOptions = {}
if (enableTwitch) {
  const twitchChannels: string[] = (
    TWITCH_CHANNELS_RAW!
      .split(/[, ]+/)
      .map(s => s.trim())
  )
  options.twitchOptions = {
    twitchUsername: TWITCH_USERNAME!,
    twitchOauthToken: TWITCH_OAUTH_TOKEN!,
    channels: twitchChannels!
  }
}

const BOT = new Bot(options)
try {
  console.log('Connecting...')
  await BOT.connect()
} catch(e) {
  throw new Error(
    `Error while trying to connect`,
    e
  )
}
