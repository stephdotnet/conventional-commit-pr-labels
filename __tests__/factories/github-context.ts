import event from '../fixtures/event.json'

export const defaultContext = {
  ...event,
  ...{
    repo: {
      repo: 'test',
      owner: 'test'
    }
  }
}
