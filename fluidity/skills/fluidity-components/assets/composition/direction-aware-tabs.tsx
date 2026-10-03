"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, usePresence, usePresenceData, useReducedMotion } from "motion/react";
import { useMeasuredSize } from "./use-measured-size";

export type DirectionalTab = { id: string; label: string; content: ReactNode; disabled?: boolean };
export type DirectionAwareTabsProps = {
  tabs: readonly DirectionalTab[];
  value: string;
  onValueChange: (id: string) => void;
  label: string;
  dir?: "ltr" | "rtl";
  className?: string;
  /** Make externally controlled updates immediate as well. */
  instant?: boolean;
};

type PresenceSettings = { direction: number; reduce: boolean };

function Panel({ id, labelId, direction, reduce: ownReduce, children, measure }: {
  id: string; labelId: string; direction: number; reduce: boolean;
  children: ReactNode; measure: (element: HTMLDivElement | null) => void;
}) {
  const [present, safeToRemove] = usePresence();
  const settings = usePresenceData() as PresenceSettings | undefined;
  const reduce = settings?.reduce ?? ownReduce;
  useLayoutEffect(() => {
    if (!present && reduce) safeToRemove?.();
  }, [present, reduce, safeToRemove]);
  // Existing exiting panels also see the latest keyboard/preference state.
  // Return no retained DOM immediately, rather than waiting for an old exit.
  if (!present && reduce) return null;
  return (
    <motion.div id={id} role="tabpanel" aria-labelledby={labelId} tabIndex={present ? 0 : -1}
      aria-hidden={!present} inert={!present} custom={{ direction, reduce }}
      initial="enter" animate="visible" exit="exit"
      variants={{ enter: (s: PresenceSettings) => ({ x: s.reduce ? 0 : 20 * s.direction, opacity: 0 }),
        visible: { x: 0, opacity: 1 }, exit: (s: PresenceSettings) => ({ x: s.reduce ? 0 : -20 * s.direction, opacity: 0,
          transition: s.reduce ? { duration: 0 } : { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }) }}
      transition={reduce ? { duration: 0 } : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      style={{ gridArea: "1 / 1", pointerEvents: present ? "auto" : "none" }}>
      <div ref={present ? measure : undefined} style={{ display: "flow-root" }}>{children}</div>
    </motion.div>
  );
}

/** Controlled horizontal tabs. Use for local, immediately available panels.
 * Offscreen panels unmount: keep form state in the parent if it must persist. */
export function DirectionAwareTabs({ tabs, value, onValueChange, label, dir = "ltr", className, instant = false }: DirectionAwareTabsProps) {
  const id = useId();
  const prefersReducedMotion = useReducedMotion() !== false;
  const [interactionInstant, setInteractionInstant] = useState(false);
  const reduce = prefersReducedMotion || instant || interactionInstant;
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const focusedPanel = useRef(false);
  const focusedTab = useRef<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const [measure, size] = useMeasuredSize<HTMLDivElement>();
  const activeIndex = tabs.findIndex((tab) => tab.id === value && !tab.disabled);
  const index = activeIndex >= 0 ? activeIndex : tabs.findIndex((tab) => !tab.disabled);
  const active = tabs[index];
  const lastActive = useRef(active?.id);
  useLayoutEffect(() => {
    if (lastActive.current !== active?.id && (focusedPanel.current || focusedTab.current === lastActive.current)) {
      if (active) buttons.current.get(active.id)?.focus();
      else container.current?.focus();
      focusedPanel.current = false;
    }
    lastActive.current = active?.id;
  }, [active?.id]);
  const [previous, setPrevious] = useState({ id: active?.id, index, direction: 0 });
  if (previous.id !== active?.id) {
    setPrevious({ id: active?.id, index, direction: Math.sign(index - previous.index) * (dir === "rtl" ? -1 : 1) });
  }
  const enabled = tabs.filter((tab) => !tab.disabled);
  if (!active) return <div ref={container} role="group" aria-label={label} tabIndex={-1}>No panels available.</div>;
  const partId = (itemId: string) => encodeURIComponent(itemId);

  const choose = (next: DirectionalTab, actionInstant: boolean) => {
    setInteractionInstant(actionInstant);
    buttons.current.get(next.id)?.focus();
    if (next.id !== active.id) onValueChange(next.id);
  };
  return (
    <LayoutGroup id={id}>
      <div ref={container} className={className} dir={dir} data-slot="directional-tabs"
        onFocusCapture={event => {
          focusedPanel.current = !!(event.target as Element).closest('[role="tabpanel"]');
          focusedTab.current = (event.target as HTMLElement).dataset.tabId ?? null;
        }}
        onBlurCapture={event => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) {
            focusedPanel.current = false; focusedTab.current = null;
          }
        }}>
        <div role="tablist" aria-label={label} aria-orientation="horizontal"
          style={{ display: "flex", overflowX: "auto", gap: "var(--fluidity-gap, 0.25rem)" }}>
          {tabs.map((tab) => (
            <button key={tab.id} type="button" role="tab" id={`${id}-tab-${partId(tab.id)}`} data-tab-id={tab.id}
              aria-controls={`${id}-panel-${partId(tab.id)}`} aria-selected={tab.id === active.id}
              disabled={tab.disabled} tabIndex={tab.id === active.id ? 0 : -1}
              ref={(element) => { if (element) buttons.current.set(tab.id, element); else buttons.current.delete(tab.id); }}
              data-state={tab.id === active.id ? "active" : "inactive"}
              style={{ position: "relative", flexShrink: 0, minHeight: "2.75rem", paddingInline: "0.75rem" }}
              onClick={(event) => choose(tab, event.detail === 0)}
              onKeyDown={(event) => {
                const current = enabled.findIndex((item) => item.id === tab.id);
                let next: number | undefined;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = enabled.length - 1;
                if (event.key === "ArrowRight") next = (current + (dir === "rtl" ? -1 : 1) + enabled.length) % enabled.length;
                if (event.key === "ArrowLeft") next = (current + (dir === "rtl" ? 1 : -1) + enabled.length) % enabled.length;
                if (next !== undefined) { event.preventDefault(); choose(enabled[next], true); }
              }}>
              {tab.id === active.id && (
                <motion.span layoutId={reduce ? undefined : "selection"} aria-hidden="true"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 35 }}
                  style={{ position: "absolute", insetInline: 0, bottom: 0, height: 2, background: "currentColor", pointerEvents: "none" }} />
              )}
              {tab.label}
            </button>
          ))}
        </div>
        <motion.div initial={false} animate={{ height: size?.height ?? "auto" }}
          transition={reduce ? { duration: 0 } : { duration: 0.18 }} style={{ overflow: "hidden" }}>
          <div style={{ display: "grid" }}>
            <AnimatePresence initial={false} mode="sync" custom={{ direction: previous.direction, reduce }}>
              <Panel key={active.id} id={`${id}-panel-${partId(active.id)}`} labelId={`${id}-tab-${partId(active.id)}`}
                direction={previous.direction} reduce={reduce} measure={measure}>{active.content}</Panel>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}
