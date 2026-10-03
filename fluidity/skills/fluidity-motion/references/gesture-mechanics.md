# Gesture mechanics

Derived from the design guidance's apple-design and animate recipes, with the composition source's handle-based
Reorder composition and the application source's bounded card-swipe selection. The motion patterns
contributes MotionValue/spring composition. Use the host's existing gesture primitive
when it already provides this behavior.

## State and event contract

Model idle → pressed → dragging → settling, with cancellation from pressed/dragging.
Keep logical selection distinct from the animated presentation value. On pointer-down,
stop the current settle at its live value; remember pointer ID and grab offset.
Ignore additional pointers. Capture the active pointer, release capture on finish,
and handle pointercancel, lost capture and unmount. Clean up animations/listeners.
Do not disable input while settling. Start a fresh drag from the actual position,
not from the last target or a stale React closure.

Use a small intent threshold (~10px is the design guidance's starting example), respect page scroll
and make the drag region explicit. `touch-action: pan-y` fits a horizontal card drag;
`touch-action: none` belongs on a dedicated freeform drag handle, not the whole page.
Do not turn ordinary vertical scrolling or clicking links into a swipe. A handle with
native previous/next or move buttons preserves keyboard and assistive operation.

While dragging, update a MotionValue or direct transform; no delayed spring between
finger and functional control. A decorative tilt may intentionally use useSpring.
Do not repeatedly add cumulative `info.offset.x` on every drag event: use the offset
once relative to start, or accumulate per-event `delta.x`, never both.

## Units, projection and snap

Use recent position/time samples for release velocity, not distance divided by the
duration of a long hold. Motion PanInfo velocity is pixels per second. The older
The design guidance recipe's distance/elapsedMs threshold 0.11 uses pixels per millisecond (110px/s);
The application source's card-swipe threshold 500 uses px/s. They are different tuning choices,
not interchangeable numbers. Pick a contextual threshold and test slow drag, quick
flick, reverse flick, last-second hold and cancellation.

The design guidance's apple-design projection models exponential deceleration:

```ts
export function project(v: number, rate = 0.998): number {
  // v in px/s; return projected displacement in px.
  if (!Number.isFinite(v) || rate <= 0 || rate >= 1) return 0;
  return (v / 1000) * rate / (1 - rate);
}
export function rubberband(over: number, size: number, c = 0.55) {
  if (size <= 0) return 0;
  return (over * size * c) / (size + c * Math.abs(over));
}
```

Project current position + displacement, select the nearest allowed snap target,
clamp to actual bounds, then spring from the current position with release velocity.
Do not project beyond a destructive action or allow a flick to skip an unbounded
number of cards. The local Stacked Card Set changes at most one selection per release.
At edges, increasing resistance communicates a boundary without a frozen hard stop.

## Physical springs

For mass m, stiffness k and damping coefficient c, the damping ratio is
`zeta = c / (2 * sqrt(k*m))`. A critical/no-overshoot starting point with m=1, k=300
is c≈34.64. These are tunable engineering defaults, not exact Apple constants.
Motion physics springs accept absolute velocity in px/s. Retarget the same stable
MotionValue; pass release velocity when starting a new settle.

```tsx
const x = useMotionValue(0);
// During drag, Motion drives x 1:1. On release:
animate(x, target, {
  type: 'spring', stiffness: 300, damping: 35, mass: 1,
  velocity: releaseVelocity,
});
```

Use independent X/Y springs where their velocities differ. Motion's duration/bounce
API is convenient for ordinary presentational motion, but it is not a numeric
translation of Apple's response/damping ratio and does not replace a physics spring
when velocity handoff is required. Reserve overshoot for momentum-driven moments;
do not add it to every menu or precision control.

## Verification

Grab midway through settling and reverse; it must follow without a jump. Cancel a
pointer stream and confirm no selection/commit occurs. Attempt a second pointer.
Drag from a control near the edge; maintain its grab offset. Try the keyboard-only
alternative. Resize and remove the active item while idle/settling. In reduced motion,
selection and direct drag can still function, but decorative layers settle instantly.
Test actual touch scrolling on the target device before claiming gesture feel verified.
