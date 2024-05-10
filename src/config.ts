import * as core from '@actions/core'

/**
 * action.yaml definition.
 */
export interface ActionConfig {
  // GitHub API token for making requests.
  token: string
}

export enum ActionOutputs {}

export function getConfig(): ActionConfig {
  return {
    token: core.getInput('token', { required: true })
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
