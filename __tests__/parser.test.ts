/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { getConventionnalCommitInfo } from '../src/utils/parser'

describe('parser', () => {
  it('returns null when no matching type', async () => {
    expect(getConventionnalCommitInfo('test')).toEqual({ type: null, isBreakingChange: false })
  })

  it('returns null when matching type without conventionnal commit structure', async () => {
    expect(getConventionnalCommitInfo('fix')).toEqual({ type: null, isBreakingChange: false })
  })

  it('returns conventionnal commit type', async () => {
    expect(getConventionnalCommitInfo('fix: commit title')).toEqual({ type: 'fix', isBreakingChange: false })

    expect(getConventionnalCommitInfo('chore: commit title')).toEqual({ type: 'chore', isBreakingChange: false })

    expect(getConventionnalCommitInfo('feature: commit title')).toEqual({ type: 'feat', isBreakingChange: false })

    expect(getConventionnalCommitInfo('feat: commit title')).toEqual({ type: 'feat', isBreakingChange: false })
  })

  it('returns breaking change', async () => {
    expect(getConventionnalCommitInfo('fix!: commit title')).toEqual({ type: 'fix', isBreakingChange: true })

    expect(getConventionnalCommitInfo('chore!: commit title')).toEqual({ type: 'chore', isBreakingChange: true })

    expect(getConventionnalCommitInfo('feature!: commit title')).toEqual({ type: 'feat', isBreakingChange: true })

    expect(getConventionnalCommitInfo('feat!: commit title')).toEqual({ type: 'feat', isBreakingChange: true })
  })
})
