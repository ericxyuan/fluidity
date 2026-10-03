'use client';

// Bounded card selection with optional handle gestures and immediate logical state updates.
import { useEffect, useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { animate, motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react';
import { boundedIndex, swipeStep } from './stack-model';

export type StackItem = { id: string; label: string; content: ReactNode };
export type StackedCardSetProps = {
  items: readonly StackItem[];
  value: string;
  onValueChange: (id: string) => void;
  label: string;
  className?: string;
  instant?: boolean;
  draggable?: boolean;
  labels?: {
    previous?: string; next?: string; select?: string; drag?: string; empty?: string;
    status?: (label: string, position: number, count: number) => string;
  };
};

export function StackedCardSet({ items, value, onValueChange, label, className = '',
  instant = false, draggable = true, labels = {} }: StackedCardSetProps) {
  const id = useId();
  const reduce = useReducedMotion() !== false || instant;
  const x = useMotionValue(0);
  const controls = useDragControls();
  const card = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const select = useRef<HTMLSelectElement>(null);
  const focusedContent = useRef(false);
  const cancelled = useRef(false);
  const activePointer = useRef<number | null>(null);
  const stop = useRef<(() => void) | undefined>(undefined);
  const index = Math.max(0, items.findIndex(item => item.id === value));
  const active = items[index];
  const previous = useRef(active?.id);

  function reset(velocity = 0, immediate = reduce) {
    stop.current?.();
    if (immediate) { x.jump(0); return; }
    const animation = animate(x, 0, { type: 'spring', stiffness: 300, damping: 35, mass: 1, velocity });
    stop.current = () => animation.stop();
  }
  function choose(next: number) {
    const target = items[boundedIndex(next, 0, items.length)];
    if (target && target.id !== active?.id) onValueChange(target.id);
  }
  useEffect(() => () => { stop.current?.(); }, []);
  useLayoutEffect(() => {
    if (previous.current !== active?.id && focusedContent.current) {
      select.current?.focus();
      focusedContent.current = false;
    }
    previous.current = active?.id;
  }, [active?.id]);
  useEffect(() => { if (reduce) { stop.current?.(); x.jump(0); } }, [reduce, x]);

  if (!active) return <section aria-label={label} className={className}>{labels.empty ?? 'No cards available.'}</section>;
  const cancel = () => { cancelled.current = true; activePointer.current = null; reset(0); };
  return (
    <section aria-label={label} className={`fluidity-stack ${className}`} data-fluidity="stacked-card-set">
      <div className="fluidity-stack-stage">
        {items.length > 2 && <div className="fluidity-stack-backing" data-depth="2" aria-hidden="true" />}
        {items.length > 1 && <div className="fluidity-stack-backing" data-depth="1" aria-hidden="true" />}
        <motion.div ref={card} className="fluidity-stack-card" style={{ x }}
          drag={draggable ? 'x' : false} dragControls={controls} dragListener={false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: index === items.length - 1 ? 0.18 : 1, right: index === 0 ? 0.18 : 1 }} dragMomentum={false}
          onDragEnd={(_, info) => {
            activePointer.current = null;
            if (cancelled.current) { reset(0); return; }
            const step = swipeStep(info.offset.x, info.velocity.x, card.current?.offsetWidth ?? 0);
            choose(index + step);
            reset(info.velocity.x);
          }}>
          <div ref={content} key={active.id}
            onFocusCapture={() => { focusedContent.current = true; }}
            onBlurCapture={event => {
              if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) focusedContent.current = false;
            }}>{active.content}</div>
          {draggable && items.length > 1 && <button type="button" className="fluidity-stack-handle"
            aria-label={labels.drag ?? 'Drag card horizontally, or use Previous and Next'}
            style={{ touchAction: 'pan-y' }}
            onPointerDown={event => {
              if (!event.isPrimary || event.button !== 0 || activePointer.current !== null) return;
              stop.current?.();
              cancelled.current = false;
              activePointer.current = event.pointerId;
              event.currentTarget.setPointerCapture(event.pointerId);
              controls.start(event, { snapToCursor: false });
            }}
            onPointerUp={() => { activePointer.current = null; }}
            onPointerCancel={cancel}
            onLostPointerCapture={event => { if (activePointer.current === event.pointerId) cancel(); }}
            onKeyDown={event => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault(); reset(0, true); choose(index + (event.key === 'ArrowRight' ? 1 : -1));
              }
            }}>↔</button>}
        </motion.div>
      </div>
      <div className="fluidity-stack-controls">
        <button type="button" disabled={index === 0} onClick={() => { reset(0, true); choose(index - 1); }}>{labels.previous ?? 'Previous'}</button>
        <label className="fluidity-sr-only" htmlFor={`${id}-select`}>{labels.select ?? 'Select card'}</label>
        <select id={`${id}-select`} ref={select} value={active.id}
          onChange={event => { reset(0, true); onValueChange(event.target.value); }}>
          {items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <button type="button" disabled={index === items.length - 1} onClick={() => { reset(0, true); choose(index + 1); }}>{labels.next ?? 'Next'}</button>
      </div>
      <p role="status" aria-live="polite" className="fluidity-stack-status">
        {labels.status?.(active.label, index + 1, items.length) ?? `${active.label} — ${index + 1} of ${items.length}`}
      </p>
    </section>
  );
}
