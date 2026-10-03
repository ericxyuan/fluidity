'use client';

// Changes: actual controlled/uncontrolled contract, native trigger, linked IDs,
// focus restoration, inert closing content, reduced motion, neutral styling.
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export type DisclosureProps = {
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
  /** For externally controlled keyboard changes or very frequent actions. */
  instant?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  transition?: Transition;
};

export function Disclosure({ summary, children, open, instant = false, defaultOpen = false, onOpenChange,
  className, triggerClassName, contentClassName, transition }: DisclosureProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activationInstant, setActivationInstant] = useState(false);
  const expanded = open ?? internalOpen;
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() !== false || instant || activationInstant;

  useIsomorphicLayoutEffect(() => {
    if (!expanded && content.current?.contains(document.activeElement)) {
      trigger.current?.focus();
    }
    if (content.current) content.current.inert = !expanded;
  }, [expanded]);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    setActivationInstant(event.detail === 0);
    if (open === undefined) setInternalOpen(!expanded);
    onOpenChange?.(!expanded);
  }

  return (
    <div className={className}>
      <button ref={trigger} id={`${id}-trigger`} type="button" className={triggerClassName}
        aria-expanded={expanded} aria-controls={`${id}-content`} onClick={toggle}>
        {summary}
      </button>
      <div ref={content} id={`${id}-content`} role="region" aria-labelledby={`${id}-trigger`}
        aria-hidden={!expanded} style={{ overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={reduce}>
          {expanded && (
            <motion.div className={contentClassName}
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit="collapsed"
              variants={{ collapsed: (immediate: boolean) => ({ height: 0, opacity: 0,
                transition: immediate ? { duration: 0 } : (transition ?? { duration: 0.2, ease: [0.23, 1, 0.32, 1] }) }) }}
              transition={reduce ? { duration: 0 } : (transition ?? { duration: 0.2, ease: [0.23, 1, 0.32, 1] })}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
