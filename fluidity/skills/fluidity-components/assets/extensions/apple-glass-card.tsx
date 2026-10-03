import type { ComponentPropsWithoutRef } from 'react';

export function AppleGlassCard({ className = '', ...props }: ComponentPropsWithoutRef<'article'>) {
  return <article {...props} className={`fluidity-glass-card ${className}`} data-fluidity="glass-card" />;
}
