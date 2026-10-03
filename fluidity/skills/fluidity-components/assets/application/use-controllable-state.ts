"use client";

import { useCallback, useState } from "react";

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

/** Undefined selects uncontrolled mode; keep the mode stable for this mount.
 * Pass concrete next values: this API deliberately does not imitate React's
 * functional setter, whose callback must remain free of notification effects.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): readonly [T, (next: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internalValue;
  const setValue = useCallback(
    (next: T) => {
      if (Object.is(current, next)) return;
      if (!controlled) setInternalValue(next);
      onChange?.(next);
    },
    [controlled, current, onChange],
  );
  return [current, setValue] as const;
}
