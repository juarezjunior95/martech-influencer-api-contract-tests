# @martech/theloophub-mfe

[![Build Status](https://ab-inbev.visualstudio.com/GHQ_B2B_Delta/\_apis/build/status/martech-theloophub-mfe/martech-theloophub-mfe?branchName=master)](https://ab-inbev.visualstudio.com/GHQ_B2B_Delta/_build/latest?definitionId=680&branchName=master)

# Introduction

This application is a micro-frontend hosted by the [wrapper micro-frontend](https://ab-inbev.atlassian.net/wiki/spaces/BM/pages/1555136528/Supplier+Environments).

If you would like to understand this approach a little bit more, you can take a look [here](https://martinfowler.com/articles/micro-frontends.html)

More information about the architecture - (https://ab-inbev.atlassian.net/wiki/spaces/BM/pages/1901495275/BEES+Partner+Architecture+Repository)

## Getting Started

### 1. Recommended plugins for VSCode

- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- https://marketplace.visualstudio.com/items?itemName=eg2.tslint
- https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode

#### 1.1. Sonarlint configuration

1. File / Preferences / Settings
2. Search for: "Sonar"
3. Edit Sonarlint > Connected Mode: Servers
4. Edit in settings.json and add the config below

```json
{
  "sonarlint.connectedMode.project": {
    "serverId": "ANY_SERVER_ID",
    "projectKey": "martech-theloophub-mfe"
  },
  "sonarlint.connectedMode.servers": [
    {
      "serverId": "ANY_SERVER_ID",
      "serverUrl": "https://sonarcloud.io",
      "organizationKey": "ab-inbev",
      "token": "YOU_SHOULD_GENERATE"
    }
  ]
}
```

### 2. Setup

1. [Install nodejs](https://nodejs.org/en/) **Note:** version ^10.16
2. [Install yarn](https://yarnpkg.com/lang/en/)
3. [Set up your client's npmrc](https://docs.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops&tabs=windows)  
   Make sure you choose `admin-portal-shared-services` in the combobox, before connect `.npmrc`
4. Run this command on root folder to install our git hooks:  
   `make hooks`
5. Run this command on `src` to download all dependencies:  
   `yarn install`

### 3. Run and build the application

1. Run this command **on root** folder to build the app:  
   `make build`
2. Run this command on root folder to run on dev environment:  
   `make run-dev`
3. Run this command to run our mocks on dev environment:  
   `make dev-dependencies`

### 4. Automated tests

1. To run unit tests:  
   `yarn test`
2. To see the code coverage  
   `yarn coverage`
3. To run the component-test  
   `make component-tests-dev`
4. To run the component tests on CLI mode  
   `make component-tests`

### 5. SCM

1. We must use [Trunk-based Development](https://ab-inbev.atlassian.net/wiki/spaces/BM/pages/1965162532/SCM+Process+-+Trunk+Base) on this repo
2. The commit messages should follow this pattern:  
   `[BEESPI-123][BEESPI-456] Message describing your changes`  
    The first information ([BEESPI-123]) is the story key on jira and the second one ([BEESPI-456) is the key of the sub-task on jira.  
    If the commit message is not on the pattern above, the hooks will block the commit

### 6. Best practices

1. [ABI guide](https://ab-inbev.atlassian.net/wiki/spaces/BM/pages/1684537657/React+Code+Standards)

### 7. Metrics

1. [Sonar](https://sonarcloud.io/dashboard?id=martech-theloophub-mfe)
2. We expect 100% of code coverage and that is validated on our pre-commit hook