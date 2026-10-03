# Fluidity extension contracts — v0.1

The supplied specification named these features without defining their complete
behavior. The user authorized these conservative definitions. They are Fluidity
extensions built from inspected source patterns, not exact replicas of an unseen spec.

## Apple Glass Card

A semantic, nonmodal content surface with a translucent material enhancement. It
inherits project typography, colors, radius and spacing via CSS variables/classes.
The word Apple describes the behavioral/material influence distilled by the design guidance; it does
not assert native Apple rendering or an Apple-provided component.

Use `AppleGlassCard({children, className?, style?, ...articleProps})` from
`../assets/extensions/apple-glass-card.tsx`, with the relevant rules from fluidity.css.
Give it a heading/label appropriate to its content. It is an article, not a clickable
button or implicit dialog. Put real buttons/links inside it. Optional disclosure uses
the local measured or unmounting disclosure; a modal task uses the host dialog.

The default has a readable solid surface. `@supports` adds a bounded static blur and
partially transparent background; increased contrast, reduced transparency and forced
colors restore a solid surface/border. No idle movement, pointer tilt, shimmer or
autoplay. If material arrival needs animation, the motion policy permits a short
near-full-scale/opacity transition; blur radius itself remains static. A high-frequency
card or keyboard action stays immediate. Do not stack nested glass surfaces.

Sources: the design guidance apple-design material hierarchy, preference handling and restraint;
The composition source ContentCard/expandable composition; the application source list-stack/card-swipe separation
of card data/controls from presentation; Motion disclosure/shared-element recipes for
optional state transitions. The visual token defaults are Fluidity's replaceable glue.

## Stacked Card Set

A bounded selection interface showing one active content card with up to two decorative
backing surfaces. It is for a small related set, not a replacement for a scannable data
table, reorder operation, deck autoplay or a stack of modal dialogs.

```tsx
<StackedCardSet
  label="Project stages"
  items={[{ id: 'draft', label: 'Draft', content: <Draft /> }, ...]}
  value={stageId}
  onValueChange={setStageId}
/>
```

`items` uses unique stable string IDs and labels. `value`/`onValueChange` own selection.
An invalid/missing ID displays the first available item without emitting a render-time
callback. An empty set displays the supplied empty label and no navigation. Removal
of the active item falls back the same way. Offscreen content unmounts; keep drafts in
parent state if persistence is required. Item order is never mutated.

Previous/Next and a labeled native select provide complete keyboard/assistive access.
Selection boundaries do not wrap. Keyboard actions and `instant` prop changes settle
immediately. Optional dragging starts only on a labeled handle, with horizontal intent,
primary-pointer protection and cancellation. Controls inside content remain usable.
Release uses the application source's distance/velocity concept, corrected to prioritize recent
flick direction, and advances at most one item. A physics spring returns from the live
drag position with release velocity. No animation lock prevents further interaction.
Reduced motion still permits intentional direct dragging but removes animated settling.

The active content is ordinary flow with responsive inline size; decoration contributes
no text, focus targets or ARIA content. A selection status announces the current label
and position, not every pointer frame. Focus stays on the persistent navigation/handle
when changing cards. If external selection replaces focused content, it moves to the
selection control. The container adapts to content height without fixed demo heights.

Sources: the application source card-swipe bounded state and offset/velocity model, list-stack and
dialog-stack layered context; the composition source sortable-list handle-only composition and stable
identity, rejecting cylinder/whole-row-drag/input-lock behavior; the design guidance directness,
velocity handoff and reduced motion; Motion MotionValue/spring architecture.

## Viewing Importance and orchestration

Viewing Importance is defined once in Core's
[design foundations](../../fluidity-core/references/design-foundations.md). It changes
information hierarchy, not a numerical score or an autoplay priority.
Orchestration is defined in Core's workflow and the shared motion policy: one task/state
owner, appropriate skill routing, coordinated visuals, no redundant source variants,
no blocking entrance delays and no mandatory approval stage for authorized fixes.
