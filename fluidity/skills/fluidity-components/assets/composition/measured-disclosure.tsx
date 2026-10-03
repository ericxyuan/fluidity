"use client";

import {
  createContext, useContext, useId, useLayoutEffect, useRef, useState,
  type ComponentPropsWithoutRef, type ReactNode, type RefObject,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMeasuredSize } from "./use-measured-size";

type DisclosureContextValue = {
  open: boolean;
  setOpen: (next: boolean, instant?: boolean) => void;
  instant: boolean;
  triggerId: string;
  contentId: string;
  trigger: RefObject<HTMLButtonElement | null>;
  content: RefObject<HTMLDivElement | null>;
};
const Context = createContext<DisclosureContextValue | null>(null);
function useDisclosure() {
  const context = useContext(Context);
  if (!context) throw new Error("Disclosure parts require Disclosure.Root");
  return context;
}

export type DisclosureRootProps = ComponentPropsWithoutRef<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Make externally controlled changes immediate as well. */
  instant?: boolean;
};
function Root({ open: controlled, defaultOpen = false, onOpenChange, instant = false, children, ...props }: DisclosureRootProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const [interactionInstant, setInteractionInstant] = useState(false);
  const open = controlled ?? internal;
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const restoreFocus = () => {
    if (content.current?.contains(document.activeElement)) trigger.current?.focus();
  };
  const setOpen = (next: boolean, actionInstant = false) => {
    if (next === open) return;
    setInteractionInstant(actionInstant);
    if (!next) restoreFocus();
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  useLayoutEffect(() => {
    if (!open) restoreFocus();
  }, [open]);
  return (
    <Context.Provider value={{ open, setOpen, instant: instant || interactionInstant, triggerId: `${id}-trigger`, contentId: `${id}-content`, trigger, content }}>
      <div {...props} data-slot="disclosure" data-state={open ? "open" : "closed"}>{children}</div>
    </Context.Provider>
  );
}

function Trigger({ onClick, children, ...props }: ComponentPropsWithoutRef<"button">) {
  const { open, setOpen, triggerId, contentId, trigger } = useDisclosure();
  return (
    <button {...props} ref={trigger} type="button" id={triggerId}
      aria-expanded={open} aria-controls={contentId} data-slot="disclosure-trigger"
      onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) setOpen(!open, event.detail === 0); }}>
      {children}
    </button>
  );
}

export type DisclosureContentProps = {
  children: ReactNode;
  className?: string;
  /** Add a named region for a substantial panel; avoid many tiny landmarks. */
  region?: boolean;
};
function Content({ children, className, region = false }: DisclosureContentProps) {
  const { open, instant, triggerId, contentId, content } = useDisclosure();
  const [measure, size] = useMeasuredSize<HTMLDivElement>();
  const reduce = useReducedMotion();
  return (
    <motion.div ref={content} id={contentId} data-slot="disclosure-content"
      role={region ? "region" : undefined} aria-labelledby={region ? triggerId : undefined}
      aria-hidden={!open} inert={!open} initial={false}
      animate={{ height: open ? (size?.height ?? "auto") : 0, opacity: open ? 1 : 0 }}
      transition={reduce || instant ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 30 }}
      style={{ overflow: "hidden" }}>
      <div ref={measure} className={className} style={{ display: "flow-root" }}>{children}</div>
    </motion.div>
  );
}

export const Disclosure = { Root, Trigger, Content };

/** Neutral semantic card shell. Supply the project's surface, radius and spacing. */
export function ContentCard(props: ComponentPropsWithoutRef<"article">) {
  return <article {...props} data-slot="content-card" />;
}
