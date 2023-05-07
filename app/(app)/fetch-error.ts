export class FetchInitialDataError extends Error {
  constructor(public message: string, public type: 'aggregate' | 'config') {
    super(message)
    this.name = 'FetchInitialDataError'
  }
}
