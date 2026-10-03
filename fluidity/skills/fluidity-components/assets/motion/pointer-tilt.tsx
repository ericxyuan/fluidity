'use client';

// Changes: optional fine-pointer enhancement; stable untransformed hit surface;
// no React state per movement; reduced-motion reset; conservative 4deg range.
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

export type PointerTiltProps = {
  children: ReactNode;
  className?: string;
  surfaceClassName?: string;
  maxAngle?: number;
};

/** Decorative surface only. Never use the moving layer as the hit target. */
export function PointerTilt({ children, className, surfaceClassName, maxAngle = 4 }: PointerTiltProps) {
  const reduce = useReducedMotion() !== false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30 });
  const springY = useSpring(y, { stiffness: 200, damping: 30 });
  const angle = Math.max(0, Math.min(8, maxAngle));
  const rotateX = useTransform(springY, [-0.5, 0.5], [angle, -angle]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-angle, angle]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  function reset() { x.set(0); y.set(0); }
  useEffect(() => { if (reduce) { x.set(0); y.set(0); springX.jump(0); springY.jump(0); } }, [reduce, x, y, springX, springY]);
  return (
    <div className={className} onPointerLeave={reset} onPointerCancel={reset}
      onPointerMove={event => {
        if (reduce || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        x.set(Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5)));
        y.set(Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5)));
      }}>
      <motion.div className={surfaceClassName} style={{ transform: reduce ? 'none' : transform }}>
        {children}
      </motion.div>
    </div>
  );
}
