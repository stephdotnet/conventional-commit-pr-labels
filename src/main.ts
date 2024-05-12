import * as core from '@actions/core'
import * as github from '@actions/github'
import { getConfig } from './config'
import { getConventionnalCommitInfo } from './utils/parser'
import { getPullRequestInformations, syncPullRequestLabels } from './utils/api'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const config = getConfig()
    const eventName = github.context.eventName
    const repo = github.context.repo.repo
    const owner = github.context.repo.owner

    let prNumber: number | undefined = undefined

    // Is it a pull request
    if (eventName === 'pull_request') {
      prNumber = github.context.payload.pull_request?.number
      core.info(`The PR number is: ${prNumber}`)
    } else {
      core.error('This is not a pull request event')
      return
    }

    if (prNumber === undefined) {
      core.error('Could not find PR number')
      return
    }

    const { title: prTitle, labels: prLabels } = await getPullRequestInformations(repo, owner, prNumber)
    const { type, isBreakingChange } = getConventionnalCommitInfo(prTitle)

    let label: string | undefined
    if (isBreakingChange) {
      label = config.breakingChangeLabel
    } else if (type) {
      label = Object.entries(config.labelsMap).find(([_key, value]) => value.includes(type))?.[0]
    }

    const labelsToSync = prLabels
      .filter(value => !Object.keys(config.labelsMap).some(input => input === value.name))
      .map(value => value.name)

    // Apply label to existing labels
    if (label !== undefined && !prLabels.some(iteration => iteration.name === label)) {
      labelsToSync.push(label)

      core.info(`The label ${label} will be added`)
    }

    // Sync PR with labels
    if (!labelsToSync.every(val => prLabels.map(value => value.name).includes(val))) {
      core.info(`The labels ${labelsToSync.join(', ')} will be synced`)

      syncPullRequestLabels(repo, owner, prNumber, labelsToSync)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
