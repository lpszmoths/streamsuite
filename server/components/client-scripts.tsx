import { getHost, getPort } from '../../common/env.ts'

const HOST: string = getHost()
const PORT: number = getPort()

export default function ClientEnvVars() {
  return (
    <>
      <script id='env-vars'>
        window.HOST = '{HOST}';
        window.PORT = {PORT};
      </script>
      <script src='/dist/client.js'></script>
      <link rel='stylesheet' href='/theme-overrides/theme.css'></link>
    </>
  )
}
