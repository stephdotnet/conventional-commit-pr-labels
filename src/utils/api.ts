import * as GitHub from '@actions/github'
import { ActionConfig, getConfig } from '../config'

export type Octokit = ReturnType<(typeof GitHub)['getOctokit']>

let config: ActionConfig
let octokit: Octokit

export function init(cfg?: ActionConfig): void {
  config = cfg || getConfig()
  octokit = GitHub.getOctokit(config.token)
}

export type githubLabels = Awaited<ReturnType<typeof octokit.rest.pulls.get>>['data']['labels']

interface getPullRequestInformationsReturnType {
  title: string
  labels: githubLabels
}

export async function getPullRequestInformations(
  repo: string,
  owner: string,
  pull_number: number
): Promise<getPullRequestInformationsReturnType> {
  const response = await octokit.rest.pulls.get({
    repo,
    owner,
    pull_number
  })

  return {
    title: response.data.title,
    labels: response.data.labels
  }
}

export async function syncPullRequestLabels(
  repo: string,
  owner: string,
  pull_number: number,
  labelsToSync: string[]
): Promise<void> {
  octokit.rest.issues.setLabels({
    owner,
    repo,
    issue_number: pull_number,
    labels: labelsToSync
  })
}
