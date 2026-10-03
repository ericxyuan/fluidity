'use client';

// Changes: bounded word/explicit-line reveal, no blur/rotation or character
// splitting, semantic text once, local sr-only style, reduced-motion fallback.
import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { CSSProperties } from 'react';

const screenReaderOnly: CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0,
};

export type TextRevealProps = {
  children: string;
  unit?: 'word' | 'line';
  className?: string;
  instant?: boolean;
  /** Seconds between segments, capped by maxStaggerDuration. */
  stagger?: number;
  /** Maximum delay before the final segment begins, in seconds. */
  maxStaggerDuration?: number;
};

/** Opt-in entrance for short display copy, never a delay before form feedback. */
export function TextReveal({ children, unit = 'word', className, instant = false, stagger = 0.03,
  maxStaggerDuration = 0.18 }: TextRevealProps) {
  const reduce = useReducedMotion() !== false || instant;
  const segments = unit === 'line' ? children.split('\n') : children.split(/(\s+)/);
  const step = Math.min(Math.max(0, stagger), Math.max(0, maxStaggerDuration) / Math.max(1, segments.length - 1));
  const item: Variants = { hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } } };
  if (reduce) return <span className={className} style={{ whiteSpace: 'pre-wrap' }}>{children}</span>;
  return (
    <span className={className}>
      <span style={screenReaderOnly}>{children}</span>
      <motion.span aria-hidden="true" initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: step } } }}>
        {segments.map((segment, index) => (
          <motion.span key={`${index}-${segment}`} variants={item}
            style={{ display: unit === 'line' ? 'block' : 'inline-block', whiteSpace: 'pre-wrap' }}>
            {segment || (unit === 'line' ? '\u00a0' : '')}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}
