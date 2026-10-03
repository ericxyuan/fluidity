'use client';

// Changes: stable content keys instead of array indices, explicit direction,
// inert outgoing content, reduced motion, no caller motion-prop precedence trap.
import { AnimatePresence, motion, usePresence, usePresenceData, useReducedMotion, type Transition } from 'motion/react';
import { forwardRef, useLayoutEffect, type ReactNode } from 'react';

type FrameProps = {
  children: ReactNode;
  direction: -1 | 0 | 1;
  reduce: boolean;
  transition: Transition;
};

type PresenceSettings = { direction: -1 | 0 | 1; reduce: boolean };

// popLayout needs its immediate custom child to forward the DOM ref.
const Frame = forwardRef<HTMLDivElement, FrameProps>(function Frame(
  { children, direction, reduce: ownReduce, transition }, ref,
) {
  const [present, safeToRemove] = usePresence();
  const settings = usePresenceData() as PresenceSettings | undefined;
  const reduce = settings?.reduce ?? ownReduce;
  useLayoutEffect(() => { if (!present && reduce) safeToRemove?.(); }, [present, reduce, safeToRemove]);
  if (!present && reduce) return null;
  return (
    <motion.div
      ref={(node) => {
        if (node) node.inert = !present;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      aria-hidden={!present}
      custom={{ direction, reduce }}
      variants={{
        enter: (value: PresenceSettings) => ({ opacity: 0, x: value.reduce ? 0 : value.direction * 12 }),
        center: { opacity: 1, x: 0, transition: reduce ? { duration: 0 } : transition },
        exit: (value: PresenceSettings) => ({ opacity: 0, x: value.reduce ? 0 : value.direction * -12,
          transition: value.reduce ? { duration: 0 } : transition }),
      }}
      initial="enter" animate="center" exit="exit"
      transition={reduce ? { duration: 0 } : transition}
    >{children}</motion.div>
  );
});

export type TransitionPanelProps = {
  activeKey: string;
  children: ReactNode;
  direction?: -1 | 0 | 1;
  /** Propagate keyboard/assistive modality; commands must settle immediately. */
  instant?: boolean;
  className?: string;
  transition?: Transition;
};

/** Visual presence layer. Caller owns tab/step semantics and focus placement. */
export function TransitionPanel({ activeKey, children, direction = 0, instant = false, className,
  transition = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }: TransitionPanelProps) {
  const reduce = useReducedMotion() !== false || instant;
  return (
    <div className={className} style={{ position: 'relative' }}>
      <AnimatePresence initial={false} mode="popLayout" custom={{ direction, reduce }}>
        <Frame key={activeKey} direction={direction} reduce={reduce} transition={transition}>
          {children}
        </Frame>
      </AnimatePresence>
    </div>
  );
}
