# Fluidity

A self-contained Codex plugin for purposeful interfaces and motion. It combines
design-engineering judgment, reusable interaction patterns, practical motion
architecture, and application components into one system that inherits the current
project's visual identity.

## Use

The plugin exposes four cooperating skills:

| Skill | Purpose |
| --- | --- |
| [fluidity-core](skills/fluidity-core/SKILL.md) | Task, hierarchy, project conventions and coordinated implementation |
| [fluidity-motion](skills/fluidity-motion/SKILL.md) | Motion judgment, timing, springs, gestures, recipes and vocabulary |
| [fluidity-components](skills/fluidity-components/SKILL.md) | Select and adapt local components, application patterns and card extensions |
| [fluidity-review](skills/fluidity-review/SKILL.md) | Evidence-based critique, opportunities, plans and authorized improvements |

Example requests: “Use Fluidity to improve this settings page while keeping our
brand”; “Fix the interruption and keyboard behavior of this card stack”; “Review
this animation and implement the important fixes.” A simple interface remains simple.

The plugin itself is guidance and local source assets. Normal use requires no source
repository checkout, registry CLI, MCP server, external account or upstream browsing.
React adapters target React 19 and Motion 12.43-compatible APIs; React/Motion are
consumer dependencies when copied into an app, not bundled libraries. Existing
Radix/Base UI primitives may be used by the detailed recipes; those recipes are
explicitly distinguished from the bundled adapters.

## Local implementation material

[Selection and integration](skills/fluidity-components/references/selection-and-integration.md)
routes to exact APIs and dependency notes. Local source includes unmounting and
persistent disclosures, direction-aware tabs, selected-item decoration, presence
panels, text/number presentation, optional pointer tilt, inline editing, selection
and pagination helpers, Apple Glass Card and Stacked Card Set.

[Runnable example compositions](skills/fluidity-components/assets/examples.tsx) and
[opt-in CSS](skills/fluidity-components/assets/fluidity.css) show integration. Copy only
the required components and relative helpers; map neutral tokens to the host design
system.

[Extension contracts](skills/fluidity-components/references/extensions.md) document
conservative v0.1 definitions authorized by the user. Viewing Importance is task-relative
information hierarchy; Apple Glass Card is a readable semantic material surface;
Stacked Card Set is bounded selection with native controls and optional handle drag.
They do not claim native Apple equivalence or implement an additional unseen spec.

Source-specific references preserve detailed mechanisms and defects discovered during
study; the [shared motion policy](skills/fluidity-motion/references/motion-policy.md)
resolves competing defaults. A visually compelling source demo is not automatically
an accessible or appropriate production component.

## Validation scope

The development workspace includes TypeScript checks, model invariant tests and a
browser harness for representative adapters, keyboard paths, dynamic data, focus,
cancellation, constrained width and preference handling. Source references are not
claims that every upstream component or every target device has been tested. When
adapting to another project, validate its content, styling, dependencies and input paths.

[Fluidity MIT license](LICENSE).
