# Unified motion policy

Derived primarily from the source author's animate, apple-design, design-engineering,
review-animations and find-animation-opportunities; integrated with the three
component repositories. This is the canonical policy. Source-specific references
describe source behavior and adaptations, not competing defaults.

## Gate before motion

1. Frequency: keyboard shortcuts, command palettes and actions repeated hundreds
   of times daily settle immediately. Tens-per-day interactions use minimal feedback;
   occasional surfaces can use short transitions; rare explanatory moments can be
   more expressive. Treat these as observed task frequency, not analytics requirements.
2. Purpose: feedback, spatial consistency, state indication, preventing a jarring
   change, explanation, or rare delight. If none applies, keep the state static.
3. Function: preserve readability and targeting. Functional data does not move for
   decoration. Never delay focus, activation or content availability for choreography.
4. Preference: reduced motion removes nonessential translation, scale, rotation,
   layout travel, overshoot and parallax. Use instant state or short opacity/color
   feedback. All interaction paths and information remain available.

Keyboard-initiated navigation and activation must not wait on animation. In reusable
adapters propagate modality/instant state; `event.detail === 0` is a useful signal for
native button keyboard/assistive activation, but custom event systems must track it
explicitly. Immediate pressed/focused/selected state remains visible.

## Timing and easing

| Situation | Starting choice |
| --- | --- |
| Press | 100–160ms; subtle scale 0.97 only when motion allowed |
| Tooltip/small popover | 125–200ms |
| Dropdown/select | 150–250ms |
| Modal/drawer | 200–300ms ordinary case; up to 500ms for justified travel |
| Hover/color | CSS ease; no positional hover on coarse pointers |
| Enter/exit | cubic-bezier(0.23, 1, 0.32, 1) |
| Non-gesture movement/morph | cubic-bezier(0.77, 0, 0.175, 1) |
| Drawer tween | cubic-bezier(0.32, 0.72, 0, 1) |
| True constant progress | linear |

Most UI transitions finish within 300ms. The source's 500ms drawer and 400ms Sonner
recipes are contextual exceptions, not alternative global defaults. Preserve a
well-integrated library's measured timing when it earns the exception. A physical
spring's settling time is not a fixed duration budget. Prefer immediate response and
prompt perceptual settling; never freeze input until all oscillation ends.

Avoid ease-in for action feedback and entrances because it postpones visible response.
Start scale entrances near 0.95 with opacity, not scale zero. Anchor popovers to their
trigger; keep unanchored modals centered. Same spatial route in and out; enter/exit
durations need not differ unless the task calls for asymmetric deliberation/response.

## Tool and performance choice

CSS transitions for simple repeatable changes; CSS keyframes for predetermined
sequences that need no retargeting; WAAPI when programmatic control needs no physics;
Motion for presence, measured/shared layout and dynamic springs or gestures.
Retarget from current presentation values. Restarting keyframes can jump on rapid
input. Keep gesture motion values stable across renders and preserve release velocity.

Transform and opacity are preferred. GPU compositing is not a guarantee that the
animation driver runs off the main thread. Motion shorthand values are useful for
physics/layout; predetermined full-transform/CSS/WAAPI animation can reduce main-thread
work. Profile under load instead of rewriting every `x` or `layout` occurrence.
Do not animate inherited parent CSS variables every frame to move many children.
Batch measurements; use ResizeObserver with cleanup; avoid React state on every
pointer frame. Apply will-change only when justified and remove unused layers.

Measured height is allowed for disclosure where document reflow is the point;
isolate/limit the cost and keep it short. Clip/mask can preserve synchronized text
color or comparison reveal, but profile paint cost. Subtle blur (~2px) is a last polish
option for a double-exposed crossfade, not default decoration; avoid broad animated
filters and avoid heavy blur (source guidance keeps transient blur below 20px).

## Springs and orchestration

Default to no visible overshoot for ordinary UI. Use physics springs for gestures
with actual velocity; allow restrained bounce after a flick if it improves the model.
Do not confuse Apple's damping ratio with Motion's damping coefficient or assume
response seconds exactly equal Motion duration. See gesture mechanics for mapping.

Orchestration means coordinating dependent visual states around one state owner.
Commit state immediately, then use one presence boundary or layout group to show the
relationship. Exit-before-enter is appropriate for an occasional exclusive message;
it must not queue repeated user commands or hide current content behind stale exits.
Prefer simultaneous replacement for rapid controls. For an occasional group entrance,
30–80ms stagger is a starting point with a bounded total delay; controls remain usable.
Do not add stagger to a daily data table, stream or keyboard navigation list.
