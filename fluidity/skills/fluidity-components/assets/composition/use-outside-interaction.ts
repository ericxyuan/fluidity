"use client";

import { useEffect, useRef, type RefObject } from "react";

/** For an inline/non-modal surface only. Dialog/popover primitives should keep
 * their own dismissal, focus, portal and nesting handling. Include portalled
 * child roots and the trigger among `inside` refs. No dismissal on drag-out. */
export function useOutsideInteraction({ open, inside, onDismiss }: {
  open: boolean;
  inside: readonly RefObject<HTMLElement | null>[];
  onDismiss: () => void;
}) {
  const latest = useRef({ inside, onDismiss });
  useEffect(() => { latest.current = { inside, onDismiss }; }, [inside, onDismiss]);
  useEffect(() => {
    if (!open) return;
    let startedOutside = false;
    let pointer: number | null = null;
    const outside = (event: Event) => !latest.current.inside.some(({ current }) =>
      current && (event.composedPath().includes(current) || current.contains(event.target as Node)));
    const down = (event: PointerEvent) => {
      pointer = event.isPrimary && event.button === 0 ? event.pointerId : null;
      startedOutside = pointer !== null && outside(event);
    };
    const cancel = () => { pointer = null; startedOutside = false; };
    const click = (event: MouseEvent) => {
      if (event.detail > 0 && startedOutside && outside(event)) latest.current.onDismiss();
      cancel();
    };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("click", click, true);
    };
  }, [open]);
}
