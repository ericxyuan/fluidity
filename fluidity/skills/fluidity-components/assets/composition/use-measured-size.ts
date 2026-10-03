"use client";

// Measure natural inner content, never the animated outer box; observing both can create resize feedback loops.
import { useEffect, useLayoutEffect, useState } from "react";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useMeasuredSize<T extends HTMLElement>() {
  const [element, ref] = useState<T | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useBrowserLayoutEffect(() => {
    if (!element) return;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize((previous) => previous?.width === width && previous.height === height
        ? previous : { width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, size] as const;
}
