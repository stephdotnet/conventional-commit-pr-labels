import event from '../fixtures/event'

export const defaultContext = {
  ...event,
  ...{
    repo: {
      repo: 'test',
      owner: 'test'
    }
  }
}
