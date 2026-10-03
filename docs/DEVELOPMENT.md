# Developing Fluidity

## Prerequisites

Use Node.js 22 or newer, pnpm 11, and Python 3.10 or newer. The Python release
utilities use the standard library. The lockfile records the exact JavaScript
dependency resolutions used by the validation workspace.

In PowerShell, Windows Terminal, or another terminal, clone the repository and enter
its root:

```sh
git clone https://github.com/ericxyuan/fluidity.git
cd fluidity
pnpm install --frozen-lockfile
```

The distributable plugin lives in the inner `fluidity/` folder. JavaScript packages
and Python utilities in the repository root are development tools, not plugin runtime
requirements.

## Preview

```sh
pnpm build:preview
node development/serve-preview.mjs
```

Open [the local preview](http://127.0.0.1:4317). Add `?test` to include the dynamic-data,
asynchronous edit, and presence edge cases used by the browser harness. The server
binds to localhost only; stop it before running Playwright, which owns its own server.

## Checks

```sh
pnpm typecheck
pnpm test
pnpm build:preview
pnpm exec playwright test
python development/validate.py
python development/test_release_validation.py
```

On Windows the harness uses Edge when it is installed in the expected location.
On other systems, install the test browser first:

```sh
pnpm exec playwright install chromium
```

The tests block nonlocal browser requests. They verify selected state and input paths,
not every possible host application or physical device. Keep changes proportional to
the task and record material validation limits.

## Package

```sh
python development/package_plugin.py
```

The command validates local links, imports, manifests, licensing, and maintenance
records; writes the plugin ZIP; and checks a fresh isolated extraction. The archive
and SHA-256 file inventory are written to `dist/`.

To check an extracted package without the development workspace:

```sh
python development/validate.py --runtime-only --plugin /path/to/extracted/fluidity
```

For a maintainer with the research checkouts present, `--sources` additionally checks
the pinned revisions and input hashes. Ordinary development and package validation
do not require those checkouts.

## What belongs in Git

Commit plugin code, skill guidance, local references, tests, build scripts, maintained
records, documentation, and the current distributable package. Keep dependency folders,
research checkout caches, temporary Python packages, and generated browser output out
of Git. Preview images selected for the repository page live in `docs/assets/`.

The repository must not contain machine-specific credentials, authentication state,
or local plugin-manager settings. Preserve the notices distributed with adapted code
and documentation when moving or repackaging them.
