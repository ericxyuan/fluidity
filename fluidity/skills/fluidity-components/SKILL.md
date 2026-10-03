---
name: fluidity-components
description: Select and adapt Fluidity's local React component patterns, controls, cards, navigation, data interfaces and motion patterns. Use for reusable UI implementations, Apple Glass Card and Stacked Card Set.
---

# Fluidity Components

Choose a behavioral model that solves the user's task and fits the existing project.
Read [selection and integration](references/selection-and-integration.md) first, then
only the relevant reference:

- [Motion architecture](references/motion-architecture.md): presence, disclosure,
  selection indicators, text/numbers, shared elements and specialized motion.
- [Expressive composition](references/composition-patterns.md): persistent measured disclosure,
  direction-aware panels, cards, toolbars, outside interaction and drag composition.
- [Application patterns](references/application-patterns.md): state, selectors, editable data,
  pagination, tables, navigation, controls, menus, overlays and specialized UI.
- [Fluidity extensions](references/extensions.md): Apple Glass Card, Stacked Card Set
  and their explicit conservative contracts; Viewing Importance lives in Core.

Follow the [shared motion policy](../fluidity-motion/references/motion-policy.md)
when a source example differs from Fluidity's integrated rule. Source values and bugs
are recorded to explain implementation, not to preserve contradictory defaults.

Local TSX/TS assets are adaptable implementation sources. Copy only what the task
needs, including local imports. [Examples](assets/examples.tsx)
show composition; [base CSS](assets/fluidity.css) supplies neutral fallback tokens and
extension styling. Map them to the host's styling system; no gallery theme is required.

Keep semantics/state ownership in charge of the motion layer. Use the host's native,
Radix or Base UI primitive for complex accessible behavior. A recipe-only component
has an implementation contract, not a claim of a fully bundled production component.
Check dependencies and APIs before adapting to another platform or React version.
The bundled adapters target React 19 and Motion 12 on the web.

Verify controlled state, empty/dynamic data, focus, hidden descendants, interruption,
responsive width and preferences. Upstream checkout access is unnecessary at runtime.
