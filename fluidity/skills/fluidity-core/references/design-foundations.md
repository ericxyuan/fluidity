# Design foundations and Viewing Importance

This reference combines guidance on hierarchy, interaction, library selection and prototyping.

## Purpose before components

The design guidance's design gate asks what motion or visual detail does for the person using it.
Begin by making the primary task discoverable and completion predictable. Safety and
predictability, understanding, achievement and appropriate delight provide the
behavioral frame. Preserve agency with cancellation, clear state and recoverability.
Use familiar controls and spatial relationships. Add feedback at the causal event,
without an artificial wait for network completion or an entrance animation.

Choose component behavior before decoration. A catalog card is useful when its
disclosure, selection or information grouping solves this task. An animated financial
chart that prevents reading an exact value fails that test. Neutral styling is not a
requirement to strip a project's personality; it makes behavior portable.

## Viewing Importance — Fluidity extension v0.1

Viewing Importance is a task-relative hierarchy decision, **not** a score derived
from viewport intersection, an engagement ranking or a universal formula. It draws
from the design guidance's purpose/frequency/function gate and material hierarchy. Assign only when
useful to make a contested layout decision:

| Level | Meaning | Usual presentation |
| --- | --- | --- |
| Primary | What the person needs to understand or act on now | Strongest hierarchy, direct label, easy reach |
| Supporting | Context needed to decide or complete the primary task | Close to the relevant action; readable without decoration |
| Contextual | Helpful on demand, low immediate decision value | Progressive disclosure or secondary region |

Importance can change with state: an actionable validation error becomes primary;
completed instructions can become contextual. Prefer clear placement, spacing, text
weight, grouping and contrast over increasing motion. High importance does not grant
permission for pulsing, autoplay, oversized cards or delaying other content. Never
hide essential information or remove keyboard access because its level is lower.
Critical errors remain perceivable; announcement priority is a separate accessibility
decision, not automatic `aria-live="assertive"` for every primary element.

Example: a transfer form places amount, destination and confirmation as primary,
balance/fees as supporting, and historical details as contextual. A balance can become
primary when insufficient funds blocks submission. The values stay stable while read.
No financial service dependency is implied by this example.

## Feedback and spatial understanding

Show pressed state on pointer-down; commit actions on activation/release so the user
can cancel. Native buttons provide keyboard activation; do not implement action
commit only in `pointerdown`. Never disable input merely because a transition runs.
During a functional drag, follow the pointer directly from the grab offset. Decorative
tracking may lag through a spring; a slider thumb may not. Enter and exit through the
same spatial relationship. Anchored popovers use the trigger origin; unanchored modal
surfaces stay centered. Motion never substitutes for labels, values or selected state.

## Typography, density and visual identity

Inherit the host's fonts and design tokens. In a new unbranded project, system fonts
offer a restrained default. Build hierarchy from size, weight and leading together;
headings may tighten tracking/leading while body text keeps readable line spacing.
Do not force one tracking value across all sizes or scripts. Use optical sizing when
the typeface supports it. Scale spacing with text and test zoom and wrapping; use
min-width: 0 on shrinking flex/grid children. Truncation needs a task reason and a
way to reach the full value. Information-dense applications need stable alignment and
tabular digits more than decorative counters.

The design guidance's translucent shadows can separate surfaces more gently than a strong solid
border. Keep borders where contrast, forced-colors or dense table structure requires
them. A preference for shadows is not a blanket prohibition of borders.

## Materials and layering

Translucency should explain a floating structural layer or retained context. Use
bounded blur, a readable foreground, sufficient surface opacity and a solid fallback.
Avoid nested translucent layers that reduce readability. Large surfaces need clear
separation, not arbitrarily heavy filters. A modal task uses a scrim and proper focus
isolation; a parallel nonmodal panel keeps surrounding work available. Material alone
does not make a panel modal.

Reduced motion, reduced transparency and increased contrast are independent signals:
replace spatial motion with instant state or a brief fade; replace transparency with
solid material; strengthen contrast/borders. `forced-colors` must remain readable.
Unsupported media queries fall back to a legible baseline. Do not animate backdrop
blur continuously or promise compositor acceleration; profile on target devices.

## Engineering choices grounded in the sources

Use existing accessible primitives for dialogs, menus, tabs, comboboxes and tooltips.
The source catalogs contain both Radix and Base UI patterns; keep whichever the host
already uses. Do not migrate a working primitive solely to satisfy a catalog preference.
Prefer an existing Sonner toaster for notification lifecycle, a maintained command
primitive for command menus, and a chart/list tool already in the project. Ordinary
CSS hover/press transitions do not need Motion. Complex selection, focus or gesture
requirements justify stronger abstractions, not just visually impressive demos.

Distinguish component state from display: a swipe selects a card; reordering changes
data order; a disclosure expands content; a dialog starts a modal task. Similar layered
visuals are not interchangeable interaction models.
