# Fluidity v0.1 validation — 2026-09-15

All checks below completed with successful process exit codes. Validation applies to
the local selected implementations and plugin package, not every upstream component.

| Check | Result and scope |
| --- | --- |
| TypeScript strict check | PASS: local TS/TSX adapters, examples and test harness |
| State-model invariants | PASS: normalized pagination across totals/pages, stable selection sets, swipe direction/velocity and bounded selection |
| Browser integration | PASS: 12 tests, installed Microsoft Edge, 1280×900 and 360×800 viewports |
| Automated accessibility scans | Zero axe violations in scanned initial, tab-selected and narrow/reduced-motion example states |
| Offline example behavior | Browser route policy blocks all nonlocal requests; bundled example interactions pass |
| Visual inspection | Desktop and 360px/125%-text screenshots examined; content and controls fit without horizontal overflow |
| Official plugin validator | PASS: manifest schema and referenced plugin structure |
| Official skill validators | PASS: all four skill entrypoints |
| Source evidence validation | PASS: four full pinned revisions, 96 capability mappings, input hashes, mapped output paths and edited local snapshot hashes |
| Package closure | Local Markdown links and TS/TSX/CSS imports resolve inside the plugin; only React/Motion consumer imports are permitted |

Browser tests cover persistent disclosure drafts and hidden focus targets; tab roving
keyboard selection; inline edit validation/save/cancel/focus; asynchronous rejection
and conflicting external updates; bounded card selection; pointer swipe and cancellation;
active item removal/empty data; reduced motion, forced colors and narrow/enlarged text;
instant keyboard changes after pointer transitions; stable tab IDs and focus following
external tab removal; and generic presence clearing earlier retained exits.

An independent forward-test read only the distributable `fluidity/` package against
a realistic daily dashboard request. It confirmed local routing and implementations
are usable without the research checkouts, preserve the host brand, and carry authorized
changes through implementation without a mandatory plan-approval pause. It identified
stale keyboard exits and index-based duplicate panel IDs/focus loss. Both failure cases
were reproduced in browser regression tests, repaired, and pass in the full suite.
The same stale-exit repair was applied and tested in the generic TransitionPanel.

Official Python validators needed PyYAML, which was installed only into
`.validation/python/` and passed through a process-local PYTHONPATH. It is excluded
from the plugin. No system Python dependency is required by normal Fluidity use.

The packaging command also validates a fresh temporary extraction with no workspace,
source repositories, development reports or node_modules. A separate closure test
checks that removing a required file/helper or adding a remote runtime import is rejected.
Final archive hashes and file inventory are recorded in `dist/release-manifest.json`.
The 46-file standalone archive passed extraction validation; the same 46 staged
personal-marketplace files passed byte-hash comparison and both runtime/schema checks.

## Practical limits

- Browser checks exercised selected adapter states in desktop Edge, including simulated
  mouse dragging and a synthetic pointer cancellation. Actual touch hardware, Safari,
  Firefox, a physical screen reader and performance under target-device load were not
  tested. Reduced-transparency media handling was inspected in CSS; forced-colors was
  exercised in-browser. Automated axe scans are not a complete accessibility audit.
- Text/number/tilt adapters and advanced recipe-only patterns have static/type validation,
  not a claim of exhaustive browser behavior coverage. The source catalogs were not built
  or audited in full. The source reports explicitly distinguish inventory from deep reading.
- Native/Expo/Swift material contributes platform-boundary guidance only. Bundled adapters
  target React 19 and Motion 12.43-compatible web APIs; other environments need adaptation.
- Extension definitions are the conservative v0.1 contracts authorized by the user.
  No additional unseen extension specification is claimed as implemented.

Run the commands in the workspace README to reproduce checks. The new source-first
closure validator uses the Python standard library; the official schema validators
come from the installed Codex plugin-creator and skill-creator skills.
