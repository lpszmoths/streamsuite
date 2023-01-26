const PORT: number = (
  Deno.env.get('PORT') &&
  parseInt(Deno.env.get('PORT')!)
) || 8007

export default function ClientEnvVars() {
  return (
    <>
      <script id='env-vars'>
        window.PORT = {PORT};
      </script>
      <script src='/dist/client.js'></script>
      <link rel='stylesheet' href='/theme-overrides/theme.css'></link>
    </>
  )
}
