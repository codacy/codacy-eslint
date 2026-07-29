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

## Agent Playbook: Updating This Repository End-to-End

This section is written for an AI coding agent (or a human) tasked with updating this repo — most commonly bumping ESLint itself, one of the ~150 bundled `eslint-plugin-*`/`eslint-config-*`/`@scope/eslint-plugin-*` packages, or a supporting dependency (webpack, typescript, etc.). Follow it top to bottom; it tells you what to change, how to regenerate derived files, how to test locally, and how to interpret CI so you can iterate on failures without guessing.

### 1. What this repository is

This is a **Codacy engine**: a Node.js/TypeScript wrapper (built on the `codacy-seed` library, the published package for [codacy-engine-typescript-seed](https://github.com/codacy/codacy-engine-typescript-seed)) that packages [ESLint](https://eslint.org/) plus a very large collection of ESLint plugins and shareable configs as a Docker image Codacy's platform runs against a customer's source code. There is no single "underlying tool version" — this repo bundles ESLint core *and* ~150 separate plugin/config packages side by side, and any of them can be the target of an update.

The `docs/` directory is machine-consumed configuration, analogous to other Codacy engines' `patterns.json`:

- `docs/patterns.json` — the full list of ESLint rules ("patterns") across all bundled plugins that Codacy knows about, their parameters/defaults, and which are enabled out of the box. **Generated file, do not hand-edit.**
- `docs/description/description.json` + `docs/description/*.md` — human-readable titles/descriptions per pattern, used in the Codacy UI. **Generated file, do not hand-edit.**
- `docs/multiple-tests/*` — fixtures used by `codacy-plugins-test` (the "multiple tests" mode) to validate the engine actually produces the expected results for real code samples, one directory per scenario/plugin.
- `docs/tool-description.md` — short blurb about the tool, hand-maintained.

Unlike some Codacy engines (e.g. the Checkstyle wrapper), **there is no external repo clone / tag-scraping step**. The generator (`src/docGenerator.ts`, invoked via `src/docGeneratorMain.ts`) builds the pattern list by directly `require`-ing the ESLint rule modules that are already installed in `node_modules` (see `src/eslintPlugins.ts`, which lists every bundled plugin package name in `packageNames`, and pulls in `@eslint-stylistic/metadata` for stylistic rule metadata). It separately fetches each plugin's rule *documentation* (not its rule logic) as raw Markdown from each plugin's GitHub repo via `axios`, with one `docGenerator.downloadDocs(...)` call per plugin in `src/docGeneratorMain.ts`. This means `npm run build:docs` needs **network access** to GitHub raw content, but does **not** need git or pandoc.

### 2. Files that encode versions — check all of these on every update

| File | What it controls | What to check |
|---|---|---|
| `package.json` → `dependencies` | The pinned version of ESLint itself (`"eslint": "^8.57.0"`) and every bundled plugin/config (`eslint-plugin-*`, `eslint-config-*`, `@scope/eslint-plugin-*`, plus supporting libs like `typescript`, `webpack`, `next`, etc.) | Bump the specific package(s) named in the task, e.g. `npm install --legacy-peer-deps --omit=dev eslint-plugin-jsdoc@latest` (see recent commit `c1a4471` "Bump eslint-plugin-jsdoc" for the exact shape: only `package.json`/`package-lock.json` + regenerated `docs/description/*` changed). Respect the `preupgrade` script's excluded packages (`@teambit/react.eslint-config-bit-react`, `eslint` itself pinned to `latest` overall, `eslint-plugin-lodash` pinned to minor) if doing a bulk upgrade. |
| `package-lock.json` | Exact resolved dependency tree | Regenerated automatically by `npm install`; commit it alongside `package.json`. |
| `src/eslintPlugins.ts` → `packageNames` array | Which installed packages' rules get pulled into `docs/patterns.json` | Only touch when **adding/removing** a plugin, not for a plain version bump. |
| `src/docGeneratorMain.ts` | Which plugins get their rule-doc Markdown fetched from GitHub, and from which path/tag-prefix | Only touch when adding a new plugin whose docs should be scraped, or when a plugin's docs moved (a real past fix: `f3b6ac1` "fix: transient version was overriding expected typescript version", `b2677fb` "fix: document generation for some plugins"). |
| `src/blacklist.ts` | Rules disabled because they need internet/`node_modules` access unavailable in the Docker sandbox | Check if a version bump adds/removes rules that need blacklisting. |
| `Dockerfile` → base image (`node:lts-alpine3.21`) | Node runtime the packaged app builds and runs on | Only bump if asked explicitly or if the new package version raises its minimum Node requirement — check `engines.node` (currently `>=18.0.0`) in `package.json` and the target package's own `engines` field. |
| `.circleci/config.yml` → `codacy/base` orb (`12.1.3`) and `codacy/plugins-test` orb (`2.0.11`) | Shared CircleCI steps (checkout, docker build/publish, tagging) and the `codacy-plugins-test` runner | Check the latest published orb versions if asked to bump them; not tied to ESLint plugin bumps. |

Look at recent bump commits for the shape of a typical diff: `git log --oneline --all | grep -iE "bump|update|upgrade"`, then `git show <hash>`. Typical patterns observed in this repo's history:
- A pure dependency bump (e.g. `c1a4471` "Bump eslint-plugin-jsdoc (#4922)") touches only `package.json`/`package-lock.json` plus the regenerated `docs/description/*.md` and `docs/description/description.json` for that plugin's rules.
- Adding a brand-new plugin is a two-commit pattern: first install it (`9fa290b` "feature: Install `eslint-plugin-react-you-might-not-need-an-effect`" — just `package.json`/`package-lock.json`), then run the doc generator in a follow-up commit (`bd4073d` "fix: Run doc generator" — the `docs/description/*` additions).
- Dependabot opens most routine bumps automatically (see `.github/dependabot.yml`) and `.github/workflows/auto-merge.yml` auto-merges dependabot PRs up to `target: major`; a manually-driven bump (like the one this playbook is for) still goes through the same CI gate as those.

### 3. Step-by-step update procedure

1. **Install/bump the target package(s)** in `package.json`:
   ```bash
   npm install --legacy-peer-deps --omit=dev <package-name>@<version>
   ```
   or, for a broad refresh of everything: `npm run upgrade` (runs `preupgrade` → `npm-check-updates -u` with the exclusions noted above, then installs).
2. **If adding a brand-new plugin/config** (not just bumping an existing one): add it to `packageNames` in `src/eslintPlugins.ts`, and if it has rule docs on GitHub, add a `docGenerator.downloadDocs(...)` call for it in `src/docGeneratorMain.ts` (see the `README.md` "Configuring new plugins" section above for the exact call shape and parameters).
3. **Build the TypeScript sources:**
   ```bash
   npm run build
   ```
4. **Regenerate the docs** (requires network access to reach `raw.githubusercontent.com` for each plugin's rule Markdown):
   ```bash
   npm run build:docs
   ```
   This rewrites `docs/patterns.json`, `docs/description/description.json`, and `docs/description/*.md`. Review the diff for new/removed/renamed rules and stale `docs/multiple-tests` fixture references.
5. **Run the unit test suite:**
   ```bash
   npm run lint
   npm test
   ```
6. **Build the Docker image** (mirrors CI, which itself runs `npm run build:docs && npm run test` inside the build stage — see `Dockerfile`):
   ```bash
   npm run build:docker
   ```
7. **Add/update a fixture** in `docs/multiple-tests/` if the bump changes which rules exist or their default output for the plugin in question, so `codacy-plugins-test` exercises the new behavior.
8. **Run `codacy-plugins-test` locally** before pushing — clone https://github.com/codacy/codacy-plugins-test and run its multiple-tests DockerTest command against your locally built image tag (CI runs this as the `plugins_test` job with `run_multiple_tests: true`).
9. **Iterate on failures**, re-running the relevant command after each fix.
10. **Commit** the dependency bump (`package.json`/`package-lock.json`) together with the regenerated `docs/` files in one change.
11. **Push and open a PR.** CI (`.circleci/config.yml`) runs `codacy/checkout_and_version` -> `publish_docker_local` (builds+saves the image) -> `plugins_test` -> `codacy/publish_docker` (default branch only) -> `tag_version`.
12. **Poll the PR's real CI checks until they all pass — local validation is NOT the finish line.** After every push, run `gh pr checks <pr-url>` and keep re-polling (short sleep while any check is `pending`) until all checks finish. If a check fails, fetch its actual log (CircleCI API/UI for the failing job — don't guess), find the true root cause, fix it, push again (never `--no-verify`, never force-push), and re-poll. Repeat until every check is green. **The CI environment's toolchain can differ from your local one**, so a clean local run does not guarantee CI passes — for example, `npm run build:docs` inside the Docker build stage runs against exactly the `package-lock.json`-resolved tree and Alpine/Node version in `Dockerfile`, which can behave differently from a local `npm install` on a different OS/Node version. Only stop iterating when every check passes, or you hit a genuine product/infra decision that needs a human — in which case explain it in the PR rather than guessing.

### 4. Common failure modes and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm run build:docs` fails to fetch a plugin's rule docs (404/network error) | Plugin moved its docs path, renamed its default branch, or changed its tag-naming scheme since the `downloadDocs(...)` call was written | Update the path/branch/tag-prefix arguments for that plugin in `src/docGeneratorMain.ts` (real past example: `b2677fb` "fix: document generation for some plugins") |
| Wrong/unexpected rule version picked up during doc generation | A transitive dependency shadows the intended plugin version in `node_modules` | Check resolution with `npm ls <package>`; real past example `f3b6ac1` "fix: transient version was overriding expected typescript version" |
| `multiple` DockerTest fails on a specific `docs/multiple-tests/*` fixture | Rule renamed/removed/added or its default output changed upstream between versions | Regenerate docs, update the expected results in that fixture to match the new (verified correct) output |
| A rule needs to be permanently disabled after a bump (needs internet/`node_modules` access unavailable in the sandbox) | New/changed rule requires resources not available inside the Docker container | Add it to `blacklistRegexes` in `src/blacklist.ts` |

### 5. Definition of done

- Target package(s) bumped in `package.json`, with `package-lock.json` regenerated and committed.
- `docs/patterns.json` and `docs/description/*` regenerated via `npm run build:docs` and committed, with any stale `docs/multiple-tests` fixtures updated.
- `npm run lint` and `npm test` pass locally.
- Docker image builds successfully via `npm run build:docker` (this also re-runs `build:docs` and `test` inside the build stage).
- `codacy-plugins-test` multiple-tests run passes locally against the freshly built image.
- **After pushing and opening/updating the PR, every CI check on it is green.** Poll `gh pr checks <pr-url>` and iterate on any failure (fetch the real CI log, fix, push, re-poll) until all pass — a passing local build is not sufficient, because the CI toolchain can differ from your local one (see step 12).

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
