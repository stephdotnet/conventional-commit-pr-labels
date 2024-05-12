# Conventional commit PR labeler

![CI](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/check-dist.yml/badge.svg)](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/stephdotnet/conventional-commit-pr-labels/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This repo is based on this un maintained action : https://github.dev/bcoe/conventional-release-labels

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
    permissions:
      contents: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: stephdotnet/conventional-commit-pr-labels@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
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

## Options

- Label mapping can be set with the `label_mapping` option and is defined as follow:

```
{
  'fix': ['fix', 'bugfix', 'perf', 'refactor','test', 'tests'],
  'feature': ['feat', 'feature']
}
```

- If a breaking change is detected the `breaking_change_label` will be applied instead of `fix` or `feature`

## About

This action uses this regex to identify the category and if the commit contains a Breaking change :
https://gist.github.com/marcojahn/482410b728c31b221b70ea6d2c433f0c

## Contributing

- Add .env containing
  - `INPUT_GITHUB_TOKEN`
- Run `npm install`
- Make the changes
- Run `npm run all`
- Open a pull request
