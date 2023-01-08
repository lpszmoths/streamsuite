import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts"
import { extname } from "https://deno.land/std@0.166.0/path/mod.ts"
import { pathToClient, pathToClientDist, pathToStatic } from "../util/paths.ts"
import { handleError } from "./error-handler.tsx"

export async function handleStaticContent(
  req: Request
) {
  const url = new URL(req.url)
  let filePath: string = pathToClient(url.pathname)
  let extension = extname(filePath)
  if (extension) {
    extension = extension.replace(
      /^\./,
      ''
    )
  }
  
  try {
    const file = await Deno.readFile(filePath)
    const mimeType: string = (
      extension ?
      (
        mime.getType(extension) ||
        'text/plain'
      ) :
      'text/plain'
    )

    return new Response(file, {
      headers: {
        'content-type': mimeType,
      },
    })
  } catch(e) {
    return handleError(e, {
      filePath,
    })
  }
}
