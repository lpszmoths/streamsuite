type PlainObject = { [key: string]: any }

type ItemsDictionary<T> = { [key: string]: Partial<T> }

export interface ParserState<T extends PlainObject> {
  currentItemKey: string | null
  currentItem: Partial<T> | null
}

const HEADER_REGEX: RegExp = /^\[\s*([^\s]+)\s*\]+$/
const ASSIGNMENT_REGEX: RegExp = /^([\w\-]+)\s*?=\s*?(.+)$/

function commitCurrentItem<
  T extends PlainObject
>(
  parserState: ParserState<T>,
  dict: ItemsDictionary<T>
): void {
  if (
    parserState.currentItemKey &&
    parserState.currentItem
  ) {
    dict[parserState.currentItemKey] = parserState.currentItem
    parserState.currentItemKey = null
    parserState.currentItem = null
  }
}
export function parseIniFileContents<
  T extends PlainObject
>(
  fileContents: string
): { [key: string]: Partial<T> } {
  const dict: { [key: string]: Partial<T>} = {}

  const parserState: ParserState<T> = {
    currentItemKey: null,
    currentItem: null,
  }
  const fileLines: string[] = fileContents.split(/[\n\r]/)
  fileLines.forEach((line: string) => {
    line = line.trim()
    const headerMatches = line.match(HEADER_REGEX)
    const assignmentMatches = line.match(ASSIGNMENT_REGEX)
    if (headerMatches) {
      commitCurrentItem(
        parserState,
        dict
      )

      parserState.currentItemKey = headerMatches[1]
      parserState.currentItem = {}
    }

    else if(parserState.currentItemKey && assignmentMatches) {
      let [
        ,
        key,
        value
      ] = assignmentMatches
      key = key.trim()
      value = value.trim()
      parserState.currentItem![key as keyof T] = value as any
    }
  })

  commitCurrentItem(
    parserState,
    dict
  )

  return dict
}