# okapi-projects-submitter

A tool for submit missing project for okapi.

## how to use

1. `bun install`
2. add name of projects in keywordList of src/config.ts
3. `bun run search` will check if the project is already in okapi
4. `bun run start` will let you input rootdata link, then projects json will be downloaded and parsed in data folder
5. After fix wrong information, `bun run submit` will submit the projects in data folder to okapi
