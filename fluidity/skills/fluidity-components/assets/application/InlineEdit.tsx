"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface InlineEditProps {
  label: string;
  value: string;
  onSave: (next: string) => void | Promise<void>;
  validate?: (next: string) => string | undefined;
  /** Overrides only persistence failure copy; localize remaining UI strings
   * when adapting this asset to a non-English application. */
  saveError?: string;
  disabled?: boolean;
  className?: string;
}

/** Single-line editor. The parent owns committed value; this component owns
 * an edit session's draft. Save resolves only after the parent accepted it.
 * A parent update during editing is treated as a conflict, never overwritten.
 */
export function InlineEdit({ label, value, onSave, validate,
  saveError = "Could not save. Try again.", disabled = false,
  className }: InlineEditProps) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [baseValue, setBaseValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);
  const savingRef = useRef(false);
  const mounted = useRef(false);
  const returnFocus = useRef(false);
  const conflict = editing && !saving && value !== baseValue;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
    else if (returnFocus.current) {
      editRef.current?.focus();
      returnFocus.current = false;
    }
  }, [editing]);

  function close() {
    returnFocus.current = true;
    setEditing(false);
    setError(undefined);
  }
  async function save() {
    if (savingRef.current || disabled || conflict) return;
    const problem = validate?.(draft);
    if (problem) { setError(problem); inputRef.current?.focus(); return; }
    if (draft === value) { close(); return; }
    savingRef.current = true;
    setSaving(true);
    setError(undefined);
    try {
      await onSave(draft);
      if (mounted.current) close();
    } catch {
      if (mounted.current) setError(saveError);
    } finally {
      savingRef.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  const message = conflict
    ? "This value changed elsewhere. Cancel and reopen to edit the latest value."
    : error;
  return (
    <div className={className} data-fluidity="inline-edit">
      {editing ? (
        <div aria-busy={saving}>
          <label htmlFor={id}>{label}</label>
          <input id={id} ref={inputRef} value={draft}
            disabled={disabled || saving} aria-invalid={!!message}
            aria-describedby={message ? `${id}-error` : undefined}
            onChange={event => { setDraft(event.target.value); setError(undefined); }}
            onKeyDown={event => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === "Enter") { event.preventDefault(); void save(); }
              if (event.key === "Escape" && !saving) {
                event.preventDefault(); event.stopPropagation(); close();
              }
            }} />
          <div className="fluidity-inline-edit-actions">
            <button type="button" disabled={disabled || saving || conflict}
              onClick={() => { void save(); }}>{saving ? "Saving…" : "Save"}</button>
            <button type="button" disabled={saving} onClick={close}>Cancel</button>
          </div>
          {message && <p id={`${id}-error`} role="alert">{message}</p>}
        </div>
      ) : (
        <div>
          <span id={`${id}-label`}>{label}</span>
          <span>{value || "No value"}</span>
          <button type="button" ref={editRef} disabled={disabled}
            aria-label={`Edit ${label}`} onClick={() => {
              setDraft(value); setBaseValue(value); setError(undefined); setEditing(true);
            }}>Edit</button>
        </div>
      )}
      <span role="status" aria-live="polite" className="fluidity-sr-only">
        {saving ? `Saving ${label}` : ""}
      </span>
    </div>
  );
}
