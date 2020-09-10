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
