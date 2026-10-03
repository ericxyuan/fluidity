'use client';

// Decoration-only API with caller-owned selection, semantics and reduced-motion support.
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import type { CSSProperties } from 'react';

export type SelectionIndicatorProps = {
  active: boolean;
  /** Set for keyboard/assistive activation or very frequent actions. */
  instant?: boolean;
  /** Use one React useId() value per independent group. */
  groupId: string;
  className?: string;
  style?: CSSProperties;
  transition?: Transition;
};

/** Put inside a positioned native button, tab, or radio; layer its label above. */
export function SelectionIndicator({ active, instant = false, groupId, className, style, transition }: SelectionIndicatorProps) {
  const reduce = useReducedMotion() !== false || instant;
  if (reduce) return active ? <span aria-hidden="true" className={className}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', ...style }} /> : null;
  return (
    <AnimatePresence initial={false}>
      {active && (
        <motion.span
          aria-hidden="true"
          layoutId={reduce ? undefined : `fluidity-selection-${groupId}`}
          className={className}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', ...style }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : (transition ?? { type: 'spring', bounce: 0, duration: 0.2 })}
        />
      )}
    </AnimatePresence>
  );
}
