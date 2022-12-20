let id = 1

export function generateId(): string {
  return `i${id++}`
}
