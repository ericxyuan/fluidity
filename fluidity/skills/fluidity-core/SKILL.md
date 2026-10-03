---
name: fluidity-core
description: Build and refine interfaces using Fluidity's integrated design-engineering system. Use for UI work that needs purpose, hierarchy, component selection and coordinated implementation; inherit the project's visual identity.
---

# Fluidity Core

Start with the user's task, information hierarchy, existing project conventions,
platform constraints, accessibility and interaction requirements. Component availability
is not a reason to add a component. A settings form may only need native controls.

This plugin provides local design guidance and reusable implementation patterns.
Normal use is offline:
read the resources here; do not ask the user to consult or install the source repositories.

## Work from the existing interface

Inspect the relevant view, its tokens, component conventions, dependencies, state
ownership and responsive behavior. Name the user outcome and the smallest useful
change. Preserve the user's requested visual identity. Extend existing tokens rather
than creating a parallel theme. Read [design foundations](references/design-foundations.md)
when hierarchy, material, typography, feedback or Viewing Importance needs a decision.

Select only the needed mode:

- Building or adjusting motion: read [Fluidity Motion](../fluidity-motion/SKILL.md).
- Selecting/adapting a reusable pattern, glass card or card stack: read
  [Fluidity Components](../fluidity-components/SKILL.md).
- Reviewing UI or motion, finding opportunities, or planning improvements: read
  [Fluidity Review](../fluidity-review/SKILL.md).

Do not load the entire catalog for a small change. Those entrypoints share the same
motion policy and component rules; they are cooperating modes of one system.

## Orchestrate according to the request

For an implementation request, inspect, select, implement, then verify the result.
For review-only requests, report grounded findings without changing the product.
For a requested plan, produce a self-contained plan; for an authorized fix, carry it
through verification. Do not insert a mandatory plan-approval stage before ordinary
authorized work. Delegation, if available and useful, can split independent source
inspection or components with clear ownership; reconcile behavior before integration.

If alternatives are explicitly requested, create a small isolated comparison with
meaningfully different interaction/layout choices, real content and working controls.
Keep variant switching instant. Integrate the selected direction when authorized.
Do not turn routine changes into a compulsory multi-variant exercise.

## Completion

Verify the task's important paths: initial, active, disabled, loading, empty and error
states where they exist; keyboard and pointer use; constrained width and enlarged text;
reduced motion; focus behavior after changes; rapid reversal and cancellation for
motion. Use the project's meaningful checks. See the review skill for deeper checks
only when the change warrants them.

Report what changed and why, actual verification and material limitations. Do not
claim an interface is accessible or its motion feels correct from source inspection
alone.
