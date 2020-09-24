# Codacy ESLint

## Adding new plugins / configs

1.  Install the package using npm:

    ```bash
    npm install <package-name>
    ```

2.  \[Plugins only\] Add the plugin to the plugins section in the file `src/eslintDefaultOptions.ts`

3.  \[Plugins only\] If the plugin has descriptions for rules on GitHub, reference them
at `src/eslintDefaultOptions.ts` to include them on the generated documentation. To do this, add a section similar to the following example:

    ```typescript
    console.log("Generate xss description files")
    await docGenerator.downloadDocs(
      (pattern) =>
        `${githubBaseUrl}/Rantanen/eslint-plugin-xss/master/docs/rules/${pattern}.md`,
      "xss"
    )
    ```

4.  Generate documentation so it adds the new plugin documentation

## Generating documentation

```bash
npm install
npm run generateDocs
```

## Test changes to codacy-seed locally
You may need to test changes that comes from our [codacy-engine-typescript-seed](https://github.com/codacy/codacy-engine-typescript-seed).

1.  Create a package with your changes on the seed:
    * Don't forget to update the dependencies: `npm install`
    * Compile the library: `npm run compile`
    * Package the library: `npm pack`
        > This should generate a codacy-seed-0.0.1.tgz on your codacy-seed repository

2.  Copy the `codacy-seed-0.0.1.tgz` into the root of this repository

3.  Install the package: `npm install codacy-seed-0.0.1.tgz`

4.  Update Dockerfile and `.dockerignore` so you copy the `codacy-seed-0.0.1.tgz` inside the docker you will be building
    *  Add `!codacy-seed-0.0.1.tgz` to your `.dockerignore`
    *  Add the package to the docker before `RUN npm install`: `COPY codacy-seed-0.0.1.tgz ./`
    *  Remove multi-stage docker steps
        *  Lines from `FROM node:$NODE_IMAGE_VERSION` to `RUN rm -rf /package.json /package-lock.json`
        > This way you skip copying the files to the other docker, and another `npm install`

5.  Publish your docker locally as normal: `docker build -t codacy-eslint:local .`

## What is Codacy

[Codacy](https://www.codacy.com/) is an Automated Code Review Tool that monitors your technical debt, helps you improve your code quality, teaches best practices to your developers, and helps you save time in Code Reviews.

### Among Codacy’s features

- Identify new Static Analysis issues
- Commit and Pull Request Analysis with GitHub, BitBucket/Stash, GitLab (and also direct git repositories)
- Auto-comments on Commits and Pull Requests
- Integrations with Slack, HipChat, Jira, YouTrack
- Track issues in Code Style, Security, Error Proneness, Performance, Unused Code and other categories

Codacy also helps keep track of Code Coverage, Code Duplication, and Code Complexity.

Codacy supports PHP, Python, Ruby, Java, JavaScript, and Scala, among others.

### Free for Open Source

Codacy is free for Open Source projects.
