import { githubLabels } from '../../src/utils/api'
import { Unarray } from '../../types/utils'

export function getGithubLabel(name: string): Unarray<githubLabels> {
  return {
    id: 1,
    node_id: '1',
    url: 'fake-url',
    name,
    description: null,
    color: '#000000',
    default: false
  }
}
