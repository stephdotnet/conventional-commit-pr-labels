# Conventional commit PR labeler

![CI](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/check-dist.yml/badge.svg)](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This repo is based on this un maintained action :
https://github.dev/bcoe/conventional-release-labels

It leverages the github release summary automatic generation :
https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes#about-automatically-generated-release-notes

## Setting up action

Create a `.github/workflows/conventional-label.yaml`:

```yaml
# Warning, do not check out untrusted code with
# the pull_request_target event.
on:
  pull_request_target:
    types: [opened, edited]

name: conventional-release-labels
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: stephdotnet/conventional-commit-pr-labels@v1
```

Create a `.github/release.yaml`:

```yaml
changelog:
  exclude:
    labels:
      - ignore-for-release
    authors:
      - octocat
  categories:
    - title: Breaking Changes 🛠
      labels:
        - breaking
    - title: Exciting New Features 🎉
      labels:
        - feature
    - title: Fixes 🔧
      labels:
        - fix
    - title: Other Changes
      labels:
        - '*'
```

## Contributing

- Add .env containing
  - `INPUT_GITHUB_TOKEN`
- Run `npm install`
- Make the changes
- Run `npm run all`
- Open a pull request
