export function swipeStep(offset: number, velocity: number, width: number): -1 | 0 | 1 {
  if (![offset, velocity, width].every(Number.isFinite) || width <= 0) return 0;
  // px/s, not px/ms. A recent reverse flick beats old accumulated displacement.
  const direction = Math.abs(velocity) >= 500 ? velocity
    : Math.abs(offset) >= Math.min(80, Math.max(24, width * 0.18)) ? offset : 0;
  return direction < 0 ? 1 : direction > 0 ? -1 : 0;
}

export function boundedIndex(index: number, step: number, count: number): number {
  if (!Number.isFinite(count) || count < 1) return -1;
  return Math.max(0, Math.min(Math.floor(count) - 1,
    (Number.isFinite(index) ? Math.floor(index) : 0) + (Number.isFinite(step) ? Math.sign(step) : 0)));
}
