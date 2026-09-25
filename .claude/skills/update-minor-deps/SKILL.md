---
description: Perform non-breaking (patch and minor) devDependency updates as a single batched group, then build, verify, and create one signed commit
args: `[scope: all | <package-name>]`
---

You are performing **non-breaking** version updates of devDependencies in this repo — everything below the next major (patch and minor). Because semver promises these are backward-compatible, you apply them **together as a single batch**, build, verify, and — only when green — create **one** signed commit. You **never push**; the user pushes themselves.

For **major** (breaking) updates, use `/update-major-deps` instead — that skill isolates each group with its own risk assessment and commit.

**Input**

- No args, or `all` → update every devDependency to its latest patch/minor.
- `<package-name>` → update only that package to its latest patch/minor.

**Core principles**

- **One batch, one commit.** Non-breaking updates don't need bisect isolation; a single commit keeps history clean.
- **Build is the gate — but not a sufficient one.** This repo has no automated test suite (no `test` script), so `npm run build` (lint + transpile + bundle + jekyll) staying green is necessary but not sufficient: deprecations and bugs can still slip through a semver-minor bump. If the batch touches `@babel/*`, `webpack`, `webpack-cli`, `css-loader`, `mini-css-extract-plugin`, `file-loader`, any `makeup-*` package, or `@ebay/skin` — all of which are imported into `_js/*.js` and shipped in the committed `static/browser.js`/`static/skin.css` bundles despite being listed as `devDependencies` — also run `npm start` and spot-check the site in the browser before committing.
- **Commit-only.** Never `git push`. Never use `--no-verify` or otherwise bypass hooks.
- **Lock-preserving.** Never clean-nuke the lockfile to work around an install problem.

---

**Process**

**1. Preflight**

- Confirm the working tree is clean (`git status --short`). If not, stop and report — do not mix unrelated changes into the dependency commit.
- Confirm Node/npm are available (`node -v`, `npm -v`). This repo has no `.nvmrc`/pinned Node version.
- Note the current branch. This repo's default (and deploy) branch is `gh-pages`.

**2. Detect available patch/minor updates**

Run a dry check scoped to non-breaking versions:

```
npx --yes npm-check-updates --dep dev --target minor
```

`--target minor` reports the highest patch/minor for each dependency while holding the major fixed. List what will move so the user can see the batch.

**3. Apply the batch**

Bump the ranges and install in one pass:

```
npx --yes npm-check-updates -u --dep dev --target minor
npm install
```

For a single-package scope, restrict it: `npx --yes npm-check-updates -u --dep dev --target minor <package-name>`.

Keep the lockfile in place — `npm install` updates it incrementally. Do **not** `rm -rf node_modules package-lock.json`; a lockfile-free resolve can float unrelated deps to a version the registry blocks.

**4. Handle a blocked or platform-rejected version**

This repo's `.npmrc` routes the `@ebay:` scope through an internal Artifactory registry, and any dependency can hit a proxy that blocks a specific version — the symptom is a clean HTTP `403` with a policy message, not a TLS or network error. A new CA cert will **not** fix it.

Crucially, the block is usually **version-specific**, so don't assume you must abandon the update. If `npm install` errors with a `403`:

- Identify the offending package and version from the error.
- **Check whether a higher version is approved before giving up.** The blocked version is often an unvetted intermediate while the current `latest` is allowed. Probe without installing:

  ```
  npm view <pkg> dist-tags          # find latest
  cd /tmp && npm pack <pkg>@<ver>    # 403 = blocked; downloads = approved
  ```

  If a higher approved version exists, target it explicitly (e.g. `^3.9.3`) and re-run `npm install`.

- Only if **no** approved version in range exists: pin the package back to the last known-good version (exclude it from the batch), re-run `npm install`, and note the exclusion in your report for follow-up.

Do **not** force past a policy block with `--force`, a clean reinstall, or by stripping auth/routing around the proxy — that bypasses a security control.

**5. Build and verify**

```
npm run build
```

- **Green** → continue toward a commit, then apply the manual browser check from Core principles if the batch touched any bundle-affecting or `makeup-*`/`@ebay/skin` package.
- **Red** → stop. Report the failure and leave the changes in the working tree for inspection; do **not** commit. A minor-version regression usually points to one package — bisect by reverting that single bump, not the whole batch.

**6. Commit (signed, commit-only)**

Stage exactly what changed: `package.json`, `package-lock.json`, and — only if regenerated — `static/browser.js`, `static/browser.js.map`, `static/skin.css`, `static/skin.css.map`. Review with `git status --short` first, stage explicit paths, and **never** `git add -A` (it would sweep in unrelated working-tree files, in particular `.npmrc` — see Safety reminders).

Use a single commit message matching this repo's existing convention:

```
build(deps-dev): bump patch and minor versions
```

Commits are GPG-signed automatically (`commit.gpgsign` is enabled for this repo). Verify with:

```
git log -1 --format='%h %G? %an <%ae>'
```

`%G?` should print `G` (good signature). **Do not push.**

**7. Report**

Summarize the batch — what was bumped, anything excluded (and why), and the resulting commit:

| Package | Old     | New     |
| ------- | ------- | ------- |
| `<pkg>` | `<old>` | `<new>` |

Note any packages held back (blocked version, engine/platform mismatch, or build failure) and recommend follow-up.

---

**Safety reminders**

- Never `git push`.
- Never bypass hooks (`--no-verify`) or force anything.
- Never clean-nuke the lockfile to resolve an install error — prefer pinning the offending package back and re-running.
- Never stage `.npmrc`. This repo's copy carries an internal Artifactory registry URL for the `@ebay:` scope — leave any local `.npmrc` changes out of every commit unless the user explicitly says otherwise.
- If the working tree starts dirty or a build fails, stop rather than working around it.
- Reach for `/update-major-deps` the moment a change crosses a major boundary.
