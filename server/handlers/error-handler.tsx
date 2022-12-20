import { renderToString  } from "https://esm.sh/preact-render-to-string@5.2.6"
import ErrorPage from '../pages/error.tsx'

const DEFAULT_STATUS_CODE: number = 500

export function generateErrorResponse(
  status: number,
  errorMessage: string
): Response {
  const html = renderToString(
    <ErrorPage
      errorMessage={errorMessage}
    />
  )
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
    status,
  });
}

export function handleError(
  e: Error,
  details?: { [key: string]: string }
) {
  const { name, message } = e as Error
  let statusCode: number = DEFAULT_STATUS_CODE
  let errorMessage: string = `${name}: ${message}`
  
  console.error(e)
  if (details) {
    for (let k in details) {
      console.log(`${k}: ${details[k]}`)
    }
  }

  if (e instanceof Deno.errors.NotFound) {
    statusCode = 404
    errorMessage = 'The file you requested could not be found.' 
  }

  return generateErrorResponse(
    statusCode,
    errorMessage
  )
}
