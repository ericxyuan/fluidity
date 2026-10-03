# Source-first development contract

Fluidity draws primarily from Motion Patterns, Composition Patterns, Design author's skills,
and Application Platform. They are technical build-time sources, not runtime services.
Source priority: relevant source knowledge; reconciliation across sources;
explicit Fluidity extensions; original material only for uncovered requirements.

Study registries, source, examples, hooks, CSS, state, dependencies and accessible
behavior. Distinguish catalog inventory from source reading and tested behavior.
For each selected capability preserve its API, mechanism, constraints and a usable
local implementation or recipe. A source URL alone does not count as incorporation.

Classify candidates CORE (frequent, deep local support), SPECIALIZED (valuable in a
specific context), REFERENCE (useful technique without a dedicated component), or
REJECT (novelty, duplication, inaccessible behavior, cost or weak generality).
Evaluate usefulness, interaction, adaptability, accessibility, responsiveness,
engineering, dependencies, performance, uniqueness, composition and maintenance.
Do not maximize component count.

Separate interaction, information structure, layout, responsive strategy, motion,
implementation and styling. Retain the first six when useful; let host project
tokens replace styling. Existing product purpose and conventions govern selection.

Use Design's judgment for general behavior; retain Motion Patterns' specialized
mechanisms; compare Composition and Application for overlapping components. Record why
differences exist, the unified decision, modifications and rejected variants in
`conflicts.md`. Keep a single authoritative runtime rule per issue.

Each source report records a historical commit, inspected paths, decisions and
destinations. `source-map.json` joins these reports and integration decisions. Exclude source
checkouts, package-manager downloads and development evidence from the release zip.

The user supplied only extension names and authorized conservative, explicitly
documented definitions. `fluidity/skills/fluidity-components/references/extensions.md`
is that versioned behavioral contract; it does not claim to reproduce an unseen spec.

## Renamed local snapshots

The local snapshots have been renamed and edited. Historical commit IDs record
their origin only; they do not certify byte identity with an upstream repository.
Use local identifiers and file hashes. Do not restore remote source names or
repository metadata into this project.
