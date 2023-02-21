# strms

## Prerequisites

* Deno v2+

## Setup

```
npm install
touch .env

# Default host: 127.0.0.1
echo "HOST=myhost.com" >> .env

# Default port: 8007
echo "PORT=80" >> .env

# (optional)
echo "TWITCH_USERNAME=mybotname" >> .env
echo "TWITCH_OAUTH_TOKEN=0123abcd..." >> .env
echo "TWITCH_CHANNELS=pageofmoths, channel2, channel3" >> .env
```

## Usage

Start the widget server:

```
npm run build
npm run server
```

Start the bot:

```
npm run bot
```

The server and the bot are currently independent of one another.
