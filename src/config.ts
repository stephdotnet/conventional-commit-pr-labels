import * as core from '@actions/core'

/**
 * action.yaml definition.
 */
export interface ActionConfig {
  // GitHub API token for making requests.
  token: string
  labelsMap: object
  breakingChangeLabel: string
}

export const defaultLabelsMap = {
  fix: ['fix', 'bugfix', 'perf', 'refactor', 'test', 'tests'],
  feature: ['feat', 'feature']
}

export const defaultBreakingChangeLabel = 'breaking-change'

export function getConfig(): ActionConfig {
  return {
    token: core.getInput('token', { required: true }),
    labelsMap: core.getInput('labels_map') ? JSON.parse(core.getInput('labels_map')) : defaultLabelsMap,
    breakingChangeLabel: core.getInput('breaking_change_label') || defaultBreakingChangeLabel
  }
}

export function getNumberFromValue(value: string): number | undefined {
  if (value === '') {
    return undefined
  }

  try {
    const num = parseInt(value)

    if (isNaN(num)) {
      throw new Error('Parsed value is NaN')
    }

    return num
  } catch {
    throw new Error(`Unable to parse value: ${value}`)
  }
}
