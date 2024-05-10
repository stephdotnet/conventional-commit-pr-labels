import * as core from '@actions/core'
import * as github from '@actions/github'
import { getConfig, getNumberFromValue } from './config'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log('CONTEXT')
    console.log(JSON.stringify(github.context))

    const eventName = github.context.eventName || core.getInput('EVENT_NAME')
    const config = getConfig()

    let prNumber
    // Is it a pull request
    if (github.context.eventName === 'pull_request') {
      // Get the title
      prNumber =
        github.context.payload.pull_request?.number ||
        getNumberFromValue(core.getInput('PR_NUMBER'))
      core.info(`The PR number is: ${prNumber}`)
    } else {
      core.error('This is not a pull request event')
      return
    }

    const octokit = github.getOctokit(config.token)

    if (typeof prNumber !== 'undefined') {
      // const prTitle = octokit.rest.pulls.get({
      //   pull_number: prNumber
      // })
    }

    // Extract the conventionnal commit

    // Convert to label using map

    // Apply label to PR
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
