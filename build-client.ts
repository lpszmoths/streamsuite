import { emit, bundle } from "https://deno.land/x/emit@0.12.0/mod.ts"

let cwd = `file://${Deno.cwd()}/`
let [sourceFile, outFile] = Deno.args
let sourcePath = new URL(sourceFile, cwd)
let emitResult = await emit(sourcePath, {
  load: async (specifier: string) => {
    console.log(specifier)
    return undefined
  }
})
console.log(emitResult)

// const { files } = emitResult
// const result = await bundle(
//   new URL("https://deno.land/std@0.140.0/examples/chat/server.ts"),
// );

// let source = files['deno:///bundle.js']
// let map = files['deno:///bundle.js.map']
// let reader = new FileReader()
// let blob = new Blob([map], {type: 'application/json'})
// reader.readAsDataURL(blob)

// await new Promise(cb => reader.onload = cb)
// source += `//# sourceMappingURL=${reader.result}`

// if (!outFile) console.log(source)
// else Deno.writeTextFile(new URL(outFile, cwd), source)
