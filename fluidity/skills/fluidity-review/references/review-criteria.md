# Review criteria

Adapted from the design guidance's review-animations/STANDARDS.md, improve-animations/AUDIT.md,
find-animation-opportunities and design-engineering guidance; supplemented by gaps
found in actual the motion patterns, the composition source and the application source implementations.

| Category | Evidence to inspect | Success criterion |
| --- | --- | --- |
| Purpose and hierarchy | User task, frequency, placement, copy, actionable states | Main action/context readable; no decorative interruption of functional data |
| Feedback | Press, loading, disabled, success and error paths | Feedback starts at input; operation state is truthful; no arbitrary delay |
| Timing | Tokens, per-component overrides, perceived settling | Appropriate budget; quick initial response; exceptions justified in context |
| Origin and continuity | Trigger geometry, stable IDs, enter/exit paths | Anchored panels originate at trigger; modals need no false anchor; reverse path coherent |
| Interruption | Rapid open/close, re-selection, pointer cancellation | Current value/velocity retained; no input locks, stale exit callbacks or duplicate commits |
| Performance | Property updates, observers, subscriptions, loops, loaded dependencies | Bounded work; no pointer-frame React rendering; expensive effects justified by measurement |
| Accessibility | Keyboard paths, semantics, labels, focus, hidden descendants, live updates | Full task without dragging/hover; hidden controls unfocusable; focus returns sensibly |
| Responsive behavior | Narrow viewport, zoom, long/localized text, overflow, touch scroll | Reachable controls/content; no fixed demo dimensions obstructing task |
| Preferences | Reduced motion/transparency, contrast, forced colors | State remains understandable; nonessential movement/glass has a readable fallback |
| Cohesion | Existing tokens, primitive families, repeated patterns | One rule per behavior; variants differ only where their interaction model differs |

High priority: unreachable control, lost focus, hidden focusable content, wrong state,
blocked input, repeated commits or motion preventing task completion. Medium: a
noticeable origin/timing/reversal defect or costly repeated rendering. Lower: local
polish that does not affect completion. Rank using impact, frequency and scope, not
the number of catalog rules violated.

Check exact properties instead of transition:all; near-full-scale entry instead of
scale(0); strong responsive ease-out instead of delayed ease-in; hover gating for fine
pointers. Apply the policy's exceptions: height on disclosures, centered modals,
physics/layout shorthand where justified, instant keyboard actions, and no mandatory
stagger. Static/reduced-motion fades are valid; pure opacity is not itself a defect.

For gestures test short flick vs long slow drag, reversal, pointercancel/lost capture,
multi-touch, scrolling and boundaries. Test a control inside a draggable card. For
presence, check both the logical state and still-mounted exiting DOM. For asynchronous
content, resize after mount and ensure no stale measured height or timers update an
unmounted component. For data, distinguish selected IDs from visible row indices.

Inspect slow playback or frame-by-frame for doubled text, distorted children,
misaligned origins and discontinuous handoff. Then check normal speed: slow playback
cannot establish perceived responsiveness. Browser automation helps verify state;
touch feel/performance requires the actual supported device and workload. Record
what was exercised and what remains untested without claiming universal compliance.
