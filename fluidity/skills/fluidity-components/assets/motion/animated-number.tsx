'use client';

// Changes: stable motion tag, explicit locale/format, exact semantic value,
// reduced-motion jump; no repeated aria-live announcements of intermediates.
import { motion, useReducedMotion, useSpring, useTransform, type SpringOptions } from 'motion/react';
import { useEffect, useMemo } from 'react';

export type AnimatedNumberProps = {
  value: number;
  instant?: boolean;
  locale?: string;
  formatOptions?: Intl.NumberFormatOptions;
  springOptions?: SpringOptions;
  className?: string;
};

export function AnimatedNumber({ value, instant = false, locale = 'en', formatOptions,
  springOptions = { stiffness: 200, damping: 30 }, className }: AnimatedNumberProps) {
  const reduce = useReducedMotion() !== false || instant;
  const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const finiteValue = Number.isFinite(value) ? value : 0;
  const spring = useSpring(finiteValue, springOptions);
  const display = useTransform(spring, current => formatter.format(current));
  useEffect(() => { if (reduce) spring.jump(finiteValue); else spring.set(finiteValue); }, [finiteValue, reduce, spring]);
  const exact = formatter.format(value);
  if (!Number.isFinite(value)) return <span className={className}>{exact}</span>;
  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>{exact}</span>
      <motion.span aria-hidden="true">{reduce ? exact : display}</motion.span>
    </span>
  );
}
