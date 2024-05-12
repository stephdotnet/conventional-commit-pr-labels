/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import * as main from '../src/main'
import * as config from '../src/config'
import * as api from '../src/utils/api'
import { defaultContext } from './factories/github-context'
import * as parser from '../src/utils/parser'
import { getGithubLabel } from './factories/pull-request-labels'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock main imports
const getConfigMock: jest.SpiedFunction<typeof config.getConfig> = jest.spyOn(config, 'getConfig')
let getPullRequestInformationsMock: jest.SpiedFunction<typeof api.getPullRequestInformations>
let getConventionnalCommitInfoMock: jest.SpiedFunction<typeof parser.getConventionnalCommitInfo>
let syncPullRequestLabelsMock: jest.SpiedFunction<typeof api.syncPullRequestLabels>

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let infoMock: jest.SpiedFunction<typeof core.info>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    infoMock = jest.spyOn(core, 'info').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()

    getPullRequestInformationsMock = jest.spyOn(api, 'getPullRequestInformations').mockImplementation()
    getConventionnalCommitInfoMock = jest.spyOn(parser, 'getConventionnalCommitInfo')
    syncPullRequestLabelsMock = jest.spyOn(api, 'syncPullRequestLabels').mockImplementation()

    getConfigMock.mockReturnValue({
      token: '1234',
      labelsMap: config.defaultLabelsMap,
      breakingChangeLabel: config.defaultBreakingChangeLabel
    })
  })

  afterEach(() => {
    // Restore original @actions/github context
    Object.defineProperty(github, 'context', {
      value: { ...defaultContext }
    })
  })

  it('Stops if event is not pull request', async () => {
    Object.defineProperty(github, 'context', {
      value: { ...defaultContext, eventName: 'push' }
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(errorMock).toHaveBeenCalledWith('This is not a pull request event')
  })

  it('Stops if no pull request number', async () => {
    Object.defineProperty(github, 'context', {
      value: { ...defaultContext, ...{ payload: { pull_request: {} } } }
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(errorMock).toHaveBeenCalledWith('Could not find PR number')
  })

  it('Retrieve PR title and parses it but does not sync labels', async () => {
    getPullRequestInformationsMock.mockResolvedValue({
      title: 'test',
      labels: []
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getPullRequestInformationsMock).toHaveBeenCalled()
    expect(getConventionnalCommitInfoMock).toHaveBeenCalledWith('test')
    expect(syncPullRequestLabelsMock).not.toHaveBeenCalled()
  })

  it('Retrieve PR with breaking change', async () => {
    getPullRequestInformationsMock.mockResolvedValue({
      title: 'test',
      labels: []
    })

    getConventionnalCommitInfoMock.mockReturnValue({
      type: 'feat',
      isBreakingChange: true
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getPullRequestInformationsMock).toHaveBeenCalled()
    expect(syncPullRequestLabelsMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), [
      'breaking-change'
    ])
    expect(infoMock).toHaveBeenCalledWith('The label breaking-change will be added')
    expect(infoMock).toHaveBeenCalledWith('The labels breaking-change will be synced')
  })

  it('Retrieve PR with no breaking change', async () => {
    getPullRequestInformationsMock.mockResolvedValue({
      title: 'test',
      labels: []
    })

    getConventionnalCommitInfoMock.mockReturnValue({
      type: 'feat',
      isBreakingChange: false
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getPullRequestInformationsMock).toHaveBeenCalled()
    expect(syncPullRequestLabelsMock).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), [
      'feature'
    ])
  })

  it('Keeps original PR labels', async () => {
    getPullRequestInformationsMock.mockResolvedValue({
      title: 'test',
      labels: [getGithubLabel('test')]
    })

    getConventionnalCommitInfoMock.mockReturnValue({
      type: 'feat',
      isBreakingChange: false
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(getPullRequestInformationsMock).toHaveBeenCalled()
    expect(syncPullRequestLabelsMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.toIncludeAllMembers(['feature', 'test'])
    )
  })

  it('Handles exception throw', async () => {
    getPullRequestInformationsMock.mockImplementation(() => {
      throw new Error()
    })

    await main.run()

    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalled()
  })
})
