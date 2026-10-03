# Implementation recipes

The design guidance supplies timing/interaction judgment; the motion patterns supplies presence,
measurement, context and shared-layout patterns. The composition source and the application source supply richer
compositions. See [motion policy](motion-policy.md) for the unified decisions.

## CSS press and anchored surface

```css
.control {
  transition: transform 160ms cubic-bezier(.23, 1, .32, 1);
}
.control:active:not(:disabled) { transform: scale(.97); }
.control:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.popover {
  transform-origin: var(--radix-popover-content-transform-origin,
                        var(--transform-origin, center));
  transition: opacity 180ms cubic-bezier(.23,1,.32,1),
              transform 180ms cubic-bezier(.23,1,.32,1);
}
@media (prefers-reduced-motion: reduce) {
  .control { transition: none; }
  .control:active:not(:disabled) { transform: none; }
  .popover { transition: opacity 100ms linear; }
}
```

Wire entry/exit attributes to the actual primitive's lifecycle, not a made-up state.
For keyboard activation set instant presentation explicitly; media queries only
handle user preferences. Keep focus management in the semantic primitive. Group
tooltips so later neighbors skip both delay and animation after the first is open.

## Presence and replacement

Put conditional keyed children *inside* AnimatePresence; mounting the boundary only
when open prevents exits. Use stable semantic keys, not random values or indices for
mutable lists. Use `initial={false}` when first-render content should not animate.
Presence retains exiting DOM: make it inert and aria-hidden as soon as logically
closed; move focus out before hiding the focused subtree. Exit completion may clean
up visuals; it must not authorize a business action or block new state.

The motion patterns TransitionPanel uses keyed index/presence and configurable variants.
For exclusive occasional content, `mode="wait"` can sequence the outgoing and incoming
panel; for fast controls, use simultaneous replacement or instant state so repeated
input never waits behind a stale exit. Keep an accessible current panel label.

## Disclosure / resizing

The motion patterns Accordion and Disclosure pair open state with measured/auto height
and opacity. The composition source expandable adds a compound API and measured body. Keep a stable
native trigger with aria-expanded and aria-controls, and give the panel the matching
ID. Use a trusted accordion's supplied size variable or a ResizeObserver that tracks
images, wrapping and asynchronous content. Disconnect it on unmount. Avoid measuring
once and assuming content never changes. Short isolated height reflow is justified
here; transformed text should not remain distorted while the panel changes size.
See local [component implementations](../../fluidity-components/references/motion-architecture.md).

## Shared element continuity

The motion patterns MorphingDialog links card/container, image, title, subtitle and
description through stable scoped layout IDs. Retain that identity model, but place
modal semantics in a tested native/Radix/Base UI dialog. A layoutId only connects
geometry; it supplies no accessible name, focus trap, inert background or restoration.

Use a unique per-instance namespace (`useId` or LayoutGroup id), then stable child
identifiers such as `${namespace}:image:${item.id}`. Never use a global `card` ID across
unrelated groups. Keep borders/radii on the intended scaling layer and use position
layout or a child wrapper to avoid stretched text. Portals, scroll containers and
top-layer dialogs may break shared geometry; use a short scale/fade fallback when the
actual host combination cannot preserve a reliable transition. Reduced motion skips
shared travel. Closing mid-open must reverse from current values and restore focus.

## Text and numbers

The motion patterns TextEffect splits by word/character/line and propagates variants.
Keep a full semantic text string accessible and hide decorative fragments from AT.
Preserve whitespace and grapheme clusters; naive split('') breaks emoji and combining
scripts. Reserve stagger for rare headings, not continuously read data. Keep total
delay bounded. TextLoop/Typewriter must not conceal essential text or run endlessly
without a purpose and appropriate pause/static alternative.

Numbers need stable formatting/width. Use Intl.NumberFormat with explicit locale and
tabular numerals. Do not announce every intermediate animation frame; expose the
final number semantically. The motion patterns AnimatedNumber animates a MotionValue;
SlidingNumber adds digit columns. Choose the cheaper mechanism needed; use the host's
existing NumberFlow when its locale/rolling behavior is required. Reduced motion and
frequent financial values update immediately. Never generate market data in a demo
and label it live.

## Specialized patterns

- Comparison: the design guidance's clip-path overlay and the motion patterns ImageComparison preserve
  aligned images. Use a native range input with label/value for keyboard access; map
  its value to clip inset and handle position. Touch scrolling remains available.
- Direction-aware panels: the composition source uses explicit previous/current indices and a custom
  direction variant. Tie direction to data order; do not infer hierarchy between peer
  navigation tabs. Selection/focus happen before visual transitions.
- Infinite slider: the motion patterns measures strip width and adds a gap before looping
  duplicated content. Clones must be aria-hidden/inert. Pause while hidden and when
  requested; offer static content for reduced motion. Do not use for required reading.
- Toasts: use the existing Sonner/notification primitive. Reuse one toast ID to update
  loading → success/error, preserve action/dismiss controls, pause lifecycle while the
  document is hidden, and avoid firing a toast per render. Style through provided
  slots/options. Animation duration and notification lifetime are different units.
- Hold feedback: the design guidance's clip overlay fills linearly over a deliberate hold (example
  2s) and resets quickly (~200ms). A CSS fill is not a completed hold implementation:
  cancel on release/leave/lost capture, provide keyboard and equivalent confirmation,
  and commit once. Use only when the product actually requests this interaction.
