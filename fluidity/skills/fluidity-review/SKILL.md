---
name: fluidity-review
description: Review UI and motion, identify useful animation opportunities, or plan and implement requested improvements with Fluidity's source-derived criteria. Use for design critique, animation audits and polish requests.
---

# Fluidity Review

Use the [shared motion policy](../fluidity-motion/references/motion-policy.md) and
[review criteria](references/review-criteria.md). First establish the requested mode:
review-only, opportunity search, improvement plan, or implementation. Honor the user's
existing authorization; an improvement request can include fixing the issues. Do not
inherit an upstream skill's mandatory refusal to implement or its promotional output.

Inspect the relevant code and, when available, its rendered behavior. Map existing
tokens, libraries, component state, task frequency and input paths. For broad work,
split independent surfaces or review categories only if useful; confirm each finding
against the cited code before reporting. Reject duplicates, false positives and
documented justified tradeoffs. Do not demand motion where none is needed.

For a critique, present high-confidence findings with location, before, proposed after,
why, and severity when useful. Keep actual failures distinct from preferences and
untested feel. A clean review is a valid outcome.

For opportunities, apply purpose/frequency/function/preference gates and offer a small
ranked set with concrete mechanics; also identify meaningful rejected candidates.
For plans, use the [implementation plan recipe](references/implementation-plan.md).
For authorized changes, implement and verify; report observable behavior, tests and
remaining limitations. Do not claim real-device motion quality from static code alone.
