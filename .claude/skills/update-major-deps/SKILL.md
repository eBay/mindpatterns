---
description: Perform major dependency updates one logical group at a time, assessing breakage risk, then build, verify, and create a signed commit per group
args: `[scope: all | <package-name>]`
---

You are performing **major** version updates of devDependencies in this repo, one logical group at a time. For each group you assess breakage risk, apply the bump, build, verify, and — only when green — create a single signed commit. You **never push**; the user pushes themselves.

**Input**

- No args, or `all` → process every available major update.
- `<package-name>` → process only the group containing that package (e.g. `@babel/core` processes the whole `@babel/*` group).

**Core principles**

- **One logical group per commit.** Isolating each change makes regressions trivial to bisect and revert.
- **Build gates every commit.** This repo has no automated test suite (no `test` script) — `npm run build` (lint + transpile + bundle + jekyll) is the only automated gate. Treat any group flagged high risk below as also needing the manual check in step 6.
- **Commit-only.** Never `git push`. Never use `--no-verify` or otherwise bypass hooks.
- **Risk-gated.** Auto-proceed for `none`/`low` risk; **pause and ask the user** before committing a `medium`/`high` risk group.

---

**Process**

**1. Preflight**

- Confirm the working tree is clean (`git status --short`). If not, stop and report — do not mix unrelated changes into dependency commits.
- Confirm Node/npm are available (`node -v`, `npm -v`). This repo has no `.nvmrc`/pinned Node version, so any reasonably current Node works.
- Note the current branch. This repo's default (and deploy) branch is `gh-pages`.
- Note that `.npmrc` scopes `@ebay:` packages through an internal Artifactory registry — installing a new major of an `@ebay/*` package depends on that registry being reachable, and `.npmrc` itself must never be staged (see Safety reminders).

**2. Detect and group major updates**

Run a dry check:

```
npx --yes npm-check-updates --dep dev
```

Identify entries whose **major** version increases. Group **coupled packages** that must move together:

- All `@babel/*` (`@babel/cli`, `@babel/core`, `@babel/preset-env`) → one group.
- Any other related family sharing a major line → one group.
- Everything else → its own single-package group.

Order the groups **lowest risk first** (see step 3) so cheap wins land before risky changes.

**3. Assess breakage risk (per group)**

Produce a risk level of `none` / `low` / `medium` / `high` with a short rationale. This repo is not a monorepo — it's a single Jekyll + webpack site whose source lives in `_js/*.js`, `_includes/`, and `_layouts/`. Its `devDependencies` fall into two very different risk buckets:

- **Build tooling only, no effect on shipped output** (`eslint`, `eslint-config-ebay`, `globals`, `nodemon`, `onchange`, `npm-run-all`, `rimraf`, `browser-sync`) → **none/low**.
- **Affects the compiled/bundled output** (`@babel/*`, `webpack`, `webpack-cli`, `css-loader`, `mini-css-extract-plugin`, `file-loader`) → **high** — these regenerate the *committed* `static/browser.js(.map)` and `static/skin.css(.map)` bundles.
- **UI component / runtime packages imported directly into `_js/*.js` and shipped in the bundle** (every `makeup-*` package, `@ebay/skin`) → **high**, even though `package.json` lists them under `devDependencies`. A major bump here changes markup, behavior, or CSS actually rendered on the live site. Treat these exactly like a production dependency bump — there is no automated test to catch a regression, only the manual check in step 6.

Other signals, as usual:

- **Usage breadth**: `grep -rl '<pkg>' _js _includes _layouts`. Few sites + only stable APIs → lower risk.
- **Changelog red flags**: dropped Node/engine support, removed or renamed APIs, stricter-by-default behavior, config-format changes.
- **Engine vs active runtime** (check explicitly):

  ```
  npm view <pkg>@<target> engines
  node -v
  ```

State the level and rationale before touching anything.

**4. Gate on risk**

- `none` / `low` → proceed automatically.
- `medium` / `high` → **stop and ask the user to confirm** before applying. Summarize the risk and what could break.

**5. Apply the bump (lock-preserving)**

Install the whole group to its new major in one command, e.g.:

```
npm install --save-dev @babel/core@^8 @babel/cli@^8 @babel/preset-env@^8
```

Confirm `package.json` reflects the new ranges.

**Preserve the lockfile — never clean-nuke.** Do **not** "fix" install problems with `rm -rf node_modules package-lock.json && npm install`. A lockfile-free resolve re-floats _unrelated_ deps to the latest in-range version, which can land on a release the internal Artifactory proxy blocks. Keeping the lockfile as the baseline means only the group you target changes.

**Handling ERESOLVE on coupled toolchains.** Upgrading a coupled family (e.g. `@babel/*`) against an existing lock can ERESOLVE because npm anchors on the _locked_ old version while installing the new one — an incremental-resolver deadlock, not a real incompatibility. The lock-preserving fix:

```
npm install --legacy-peer-deps
```

After it completes, **verify the resulting tree is self-consistent** before trusting it, e.g.:

```
npm ls @babel/core @babel/cli @babel/preset-env
```

**6. Build and verify**

```
npm run build
```

- **Green** → continue toward a commit.
- **Red** → stop. Report the failure, leave the changes in the working tree for inspection, and do **not** commit. Do not attempt unrelated fixes.

**No automated test suite exists in this repo.** For any group flagged `medium`/`high` in step 3 — especially anything touching the bundler/loader toolchain or a `makeup-*`/`@ebay/skin` package — also run `npm start` and manually spot-check the affected pattern page(s) in the browser before committing. This is the only regression check available for these groups.

**7. Commit (signed, commit-only)**

Stage exactly the files this group changed: `package.json`, `package-lock.json`, and — only for groups that regenerate them — `static/browser.js`, `static/browser.js.map`, `static/skin.css`, `static/skin.css.map`. Review with `git status --short` first. **Never** `git add -A` and never sweep in unrelated working-tree changes (in particular, never stage `.npmrc` — see Safety reminders).

Use a commit message matching this repo's existing convention (visible in `git log`), e.g.:

```
build(deps-dev): bump @babel/core, @babel/cli and @babel/preset-env from 7 to 8
```

Commits are GPG-signed automatically (`commit.gpgsign` is enabled for this repo). Verify with:

```
git log -1 --format='%h %G? %an <%ae>'
```

`%G?` should print `G` (good signature). **Do not push.**

**8. Repeat and report**

Move to the next group. When done (or stopped), output a summary table — one row per group, ordered as processed:

| Group                   | Risk                 | Build/Manual check | Commit        |
| ----------------------- | -------------------- | ------------------- | ------------- |
| `<pkg>` `<old>`→`<new>` | none/low/medium/high | pass/fail/n/a       | `<short-sha>` |

List any groups that were skipped (risk not confirmed) or failed (left uncommitted for follow-up).

---

**Safety reminders**

- Never `git push`.
- Never bypass hooks (`--no-verify`) or force anything.
- Never bundle multiple groups into one commit.
- Never clean-nuke the lockfile to resolve an install error — it can float unrelated deps to forbidden/newer versions. Prefer lock-preserving installs (`--legacy-peer-deps` with the lock present for coupled-toolchain ERESOLVE).
- Never stage `.npmrc`. This repo's copy carries an internal Artifactory registry URL for the `@ebay:` scope — leave any local `.npmrc` changes out of every commit unless the user explicitly says otherwise.
- If the working tree starts dirty or a build fails, stop rather than working around it.
