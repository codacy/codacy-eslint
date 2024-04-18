# Codacy ESLint

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/88324e5ee7464c62abe07115b884c6a9)](https://app.codacy.com/gh/codacy/codacy-eslint/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![CircleCI](https://circleci.com/gh/codacy/codacy-eslint.svg?style=svg)](https://circleci.com/gh/codacy/codacy-eslint)

## Manually upgrading packages / plugins / configs

```shell
npm run upgrade
```

## Adding new packages / plugins / configs

Install the package / plugin using npm:
```shell
npm install --legacy-peer-deps --omit=dev package-name
```

## Configuring new plugins

**NOTE**: Before adding a plugin to the Codacy UI, make sure it has widespread use and is actively maintained.

1.  If the plugin has descriptions for rules on GitHub, reference them
    at `src/docGeneratorMain.ts` to include them on the generated documentation.

    -   Add a section similar to the following example:
        ```typescript
        await docGenerator.downloadDocs(
          // plugin prefix (e.g., xss/some-pattern-id)
          "eslint-plugin-xss",
          // path to .md patterns files within github
          `/Rantanen/eslint-plugin-xss/master/docs/rules/`,
          // prefix for tag relases (for example if tags are "v.1.0.0" you have to prefix tags with "v.")
          // or "false" if package has no tags released
          // (default) "v"
          "v",
          // change to true if it should fail in case of missing .md files for any pattern
          // (default) false
          false
        )
        ```

    -   In `src/eslintPlugins.ts` add a new value to the array with the name of the package/plugin:
        ```typescript
        // make sure it matches the correct name of the package
        const packageNames = [
          //(...)
          "@angular-eslint/eslint-plugin",
          //(...)
          "eslint-plugin-xss",
          //(...)
        ]
        ```

2.  Generate documentation so it adds the new plugin documentation.

    ```shell
    npm run build:docs
    ```

3.  Add a new test in `/docs/multiple-tests` that uses the newly added plugin.
    You can use the Getting Started section of the package documentation to find a small usage example. 

## Generating documentation

```shell
npm run build:docs
```

## Test changes to codacy-seed locally

You may need to test changes that comes from our [codacy-engine-typescript-seed](https://github.com/codacy/codacy-engine-typescript-seed).

1.  Create a package with your changes on the seed:
    *   Don't forget to update the dependencies: `npm install`
    *   Compile the library: `npm run compile`
    *   Package the library: `npm pack`
    > This should generate a codacy-seed-0.0.1.tgz on your codacy-seed repository

2.  Copy the `codacy-seed-0.0.1.tgz` into the root of this repository

3.  Install the package: `npm install codacy-seed-0.0.1.tgz`

4.  Update Dockerfile and `.dockerignore` so you copy the `codacy-seed-0.0.1.tgz` inside the docker you will be building
    *   Add `!codacy-seed-0.0.1.tgz` to your `.dockerignore`
    *   Add the package to the docker before `RUN npm install`: `COPY codacy-seed-0.0.1.tgz ./`
    *   Remove multi-stage docker steps
        -   Lines from the beginning of the file until `RUN rm -rf /package.json /package-lock.json`
        > This way you skip copying the files to the other docker, and another `npm install`

5.  Publish your docker locally as normal: `docker build -t codacy-eslint:local .`

## Limitations

### Incompatible rules

There are some ESLint rules that will be ignored when running this Docker container. For more details on the ignored rules, check `blacklistRegexes` defined at [blacklist.ts](src/blacklist.ts).

Usually, these rules need an Internet connection and/or to check `node_modules`, and would not run successfully on our Docker container environment.

## What is Codacy

[Codacy](https://www.codacy.com/) is an Automated Code Review Tool that monitors your technical debt, helps you improve your code quality, teaches best practices to your developers, and helps you save time in Code Reviews.

### Among Codacy’s features

-   Identify new Static Analysis issues
-   Commit and Pull Request Analysis with GitHub, BitBucket/Stash, GitLab (and also direct git repositories)
-   Auto-comments on Commits and Pull Requests
-   Integrations with Slack, HipChat, Jira, YouTrack
-   Track issues in Code Style, Security, Error Proneness, Performance, Unused Code and other categories

Codacy also helps keep track of Code Coverage, Code Duplication, and Code Complexity.

Codacy supports PHP, Python, Ruby, Java, JavaScript, and Scala, among others.

### Free for Open Source

Codacy is free for Open Source projects.
