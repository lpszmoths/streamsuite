import { ComponentChild, VNode } from "preact"

export type RouteParams = {[key: string]: string}

export interface RouteProps {
  pattern: string | RegExp
  render: (params: RouteParams) => VNode
}

export default function Route({
  pattern,
  render,
}: RouteProps) {
  const { pathname } = window.location
  const params: RouteParams = {}

  if (typeof pattern === 'string') {
    const pathnameParts: string[] = pathname.split('/').filter(s => !!s)
    const patternParts: string[] = (pattern as string).split('/').filter(s => !!s)

    if (patternParts.length != pathnameParts.length) {
      return null
    }

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const patternPartName: string = patternParts[i].substring(1)
        params[patternPartName] = pathnameParts[i]
      }
      else if(patternParts[i] != pathnameParts[i]) {
        return null
      }
    }
  } else if (
    typeof pattern === 'object' &&
    pattern instanceof RegExp
  ) {
    const matches: RegExpExecArray | null = (pattern as RegExp).exec(pathname)
    if (!matches) {
      return null
    }

    if (matches.groups) {
      for (let k in matches.groups) {
        params[k] = matches.groups[k]
      }
    } else {
      for (let i = 1; i < matches.length; i++) {
        params[`param${i}`] = matches[i]
      }
    }
  }

  return render(params)
}