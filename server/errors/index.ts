export class WidgetNotFoundError extends Error {
  constructor() {
    super('Could not find the requested widget')
  }
}
