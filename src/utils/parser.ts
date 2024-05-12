interface getConventionnalCommitInfoType {
  type: string | null
  isBreakingChange: boolean
}

export function getConventionnalCommitInfo(title: string): getConventionnalCommitInfoType {
  const RegExp =
    /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test){1}(([\w\-.]+))?(!)?: ([\w ])+([\s\S]*)/

  const captureGroups = title.match(RegExp)

  return {
    type: captureGroups?.[1] || null,
    isBreakingChange: captureGroups?.[4] === '!'
  }
}
