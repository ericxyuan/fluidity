# Reusable composition and interaction patterns

This local reference distills the composition patterns at commit `3b855612fb524cb042cc91b65f0cd575057471cc`. It is sufficient for the selected recipes without fetching the composition patterns.

The source catalog contained **78 registered UI entries, 82 UI source files, 79 example files and 77 component documentation pages**. These are inventory counts, not claims that every file was deeply reviewed. The development source map records each inspected file, its inspection scope, the evaluated candidates, and catalog-only entries. The other `components/ai-elements` directory is outside this component extraction; its mere presence does not imply coverage. Generated registry copies and commented backup implementations are not separate components.

## Selection and source reconciliation

The composition source is strongest where a compound component separates shared state from layout and visual treatment: `CutoutCard`, `Expandable`, `ChoicePoll`, `VoteTally` and `FamilyDrawer`. Earlier demos often combine a useful motion technique with fixed dimensions, decorative styling and incomplete interaction semantics. Retain the technique only after resolving the gap. A gallery preview does not prove keyboard, focus, touch or reduced-motion behavior.

Follow the canonical Fluidity motion and accessibility rules when applying these recipes. Keyboard selection, keyboard activation and reduced-motion transitions are immediate in the included adaptations. Pointer actions can animate, remain interruptible, and must commit their logical state immediately. The assets expose `instant` for controlled external changes. No component requires the composition patterns at runtime.

| Candidate | Decision | Specific retained value | Boundary or required correction |
| --- | --- | --- | --- |
| Expandable | CORE | Shared root state; explicit trigger; measured inner content; animated outer size; header/body/footer composition | Native trigger semantics, IDs and focus return; inert collapsed content; remove timer races and ignored props; adapt width to parent |
| DirectionAwareTabs | CORE | Ordered panel direction; shared selection marker; measured container height; presence transitions | Array position rather than numeric IDs; no animation input lock; scoped layout IDs; full tab keyboard contract; immediate keyboard changes |
| MinimalCard | CORE concept | Independent media/title/body/footer slots with native title and paragraph elements | Project tokens and meaningful heading level; preserve actions as real links/buttons; remove unnecessary image-framework coupling |
| CutoutCard | SPECIALIZED | Media/content/footer slots, state context, cancellable event composition, `data-slot` and `data-state`; static inset geometry avoids seams | Essential actions stay visible; focus/touch equivalents; reduced-motion must remove translation and CSS image zoom as well as change duration |
| SortableList | SPECIALIZED | Controlled order, stable item identity, explicit drag controls, measured row expansion, separate removal action | Keyboard reorder and announcement, label delete, handle-only drag, legal list DOM; do not equate selection with deletion |
| FamilyDrawer | SPECIALIZED | Delegate drawer semantics to Vaul; measure changing views inside the surface; distinguish view state from open state | Fix notification-only uncontrolled callback behavior; proper title/description and close name; cap height to viewport; immediate keyboard changes |
| MorphSurface | SPECIALIZED recipe | Compact trigger becomes inline form; shared indicator; separate success state; pair pointer start and outside click | Draft preservation, pending/error states, explicit submit/cancel, label text area, timer cleanup; never report success before async completion |
| ToolbarExpandable | SPECIALIZED recipe | Selected step drives measured content; horizontal navigation remains available; touch-aware native scrolling; overflow masks | Remove delayed scroll and fixed scroll targets; preserve semantics; selected items scroll into view with reduced-motion support |
| ChoicePoll | SPECIALIZED recipe | Separate selected values, submitted state and result data; option context and optional result parts | Use radio/checkbox semantics for a poll; valid controlled empty value; complete listbox semantics only if actually using listbox interaction |
| VoteTally | SPECIALIZED recipe | Counts and this user's votes are separate; immutable updates; toggle button exposes pressed state | Server authority, pending/rollback state, item-specific action names; avoid `ul > div > li` when sorting |
| SidePanel | REFERENCE | Measured nested expansion and a replaceable button renderer | Consolidate with measured disclosure; no independent sidebar implementation; remove 97% target and desktop demo widths |
| ExpandableScreen | REFERENCE | Separate shared background geometry from content opacity when opening detail | Use a real dialog primitive; source lacks focus trap, Escape handling and scroll-lock cleanup; generated per-instance IDs |
| FloatingPanel | REFERENCE | Trigger geometry and label can establish origin and continuity; explicit form parts | Position/collision handling and real modal focus behavior; source `aria-expanded` is hardcoded false and destructive close clears note |
| AnimatedNumber | REFERENCE | Spring numeric value independently from its display formatter | One exact accessible value; reduced motion shows final value; do not detect completion by repeated strict numeric equality |
| Dock | REFERENCE | Distance-to-center maps to width via a motion value and spring | Prefer the motion patterns' smaller dock architecture; remove duplicate pointer listeners, infinite launch bounce and coordinate-space mismatch |
| ThreeDCarousel | REFERENCE | Shared image identity; motion stops while detail is open; velocity can inform release | No cylinder in the default stack; source accumulates total drag offset each event, has click-only faces and fixed geometry |
| FeatureCarousel | REFERENCE | State-indexed layered presentation; small reusable image entrance presets | Reject automatic 3-second cycling, full-card click overlays, input lock and no-op step selection; use accessible manual navigation |
| ColorPicker | REFERENCE | Popover combines swatch, editable textual value, channel controls and presets | Do not copy parsing or gradient math; source mixes an HSV-like plane with HSL coordinates, has malformed HSL regex and prop-sync callbacks |
| Onboarding | REFERENCE | Step/substep state separated; progress text and explicit next/back actions | Inspected API and progress section only; no assertion that all navigation/validation paths work; use one-based visible labels and explicit state guards |
| TextureButton | REFERENCE | CVA variants, native props, `asChild` seam and nested radius relation | Keep existing project button; avoid extra texture, hard-coded palette or nested action elements |
| EdgeBlur | REFERENCE | Noninteractive layered masks can indicate a scroll boundary | Prefer a cheap gradient when sufficient; do not obscure readable content; avoid several viewport-wide backdrop blurs by default |
| DistortedGlass | REJECT implementation | None needed for the core surface | Static fractal/displacement decoration, fixed sizes, repeated SVG ID and framework-specific CSS add little interaction value; Apple Glass Card does not inherit this effect |

These decisions account for usefulness, interaction, adaptability, accessibility, responsive behavior, implementation quality, dependency cost, performance, uniqueness, composition and maintenance. They are static engineering judgments, not measured performance benchmarks. The machine-readable source map includes an eleven-axis evaluation for each candidate. Catalog-only entries remain unreviewed and are not implicitly accepted or rejected.

## Shared engineering principles from the actual source

`components-build/rules/composition.md`, `state.md`, `principles.md`, `as-child.md`, `design-tokens.md` and `accessibility.md` supply the component foundation:

1. Give a complicated pattern a small root that owns shared state, with dedicated trigger/content parts. Export native prop types and preserve element semantics. A one-purpose component need not acquire a context hierarchy.
2. Offer `value/defaultValue/onValueChange` or `open/defaultOpen/onOpenChange` when both modes help. An observer callback in uncontrolled mode must not prevent internal state from updating. Detect controlled values with `!== undefined`, not truthiness: empty strings, false and zero can be legitimate values.
3. Use `data-slot` for component parts and `data-state` for styling logical state. These expose structure without prescribing color, texture or typography. Keep project classes/variants rather than install the composition source's visual identity.
4. Compose consumer handlers with internal behavior: call the consumer first; if `event.defaultPrevented`, stop. Use a native button for actions and an anchor for navigation. With an existing Radix trigger, use its `asChild`/Slot support and ensure the child spreads props and forwards refs. Do not merely clone a child while discarding its handler/ref.
5. Separate geometry, media, text and action layers. An outer surface can change size while an inner text layer uses position-only layout or a short opacity transition. Decorative overlay layers use `pointer-events: none` and are hidden from assistive technology.
6. Reuse the host's class merge helper; the composition source's `cn` is `twMerge(clsx(inputs))`. Do not copy its website `absoluteUrl` helper: the fallback points to the composition patterns and has no place in a self-contained component asset.
7. Prefer semantic colors and paired foreground/background tokens. The composition source's older theming page describes HSL channel variables; its newer design-token skill uses complete OKLCH values. This is a version/style difference. Preserve the project's token representation and do not wrap a full `oklch(...)` value in `hsl(...)`.
8. Component distribution includes explicit source files, external dependencies and registry dependencies. Inspect imports as well as registry metadata: the source registry omits `react-use-measure` from Expandable and motion from several entries, so metadata alone is insufficient.

The source accessibility rule's short dialog example is explanatory scaffolding: adding `role="dialog"` and `aria-modal` does not implement focus containment, Escape dismissal, background inertness or focus restoration. Fluidity uses the project's accessible dialog/popover primitive for those responsibilities.

## Measured disclosure and composed card

Local implementation: [`measured-disclosure.tsx`](../assets/composition/measured-disclosure.tsx), using [`use-measured-size.ts`](../assets/composition/use-measured-size.ts).

The composition source `Expandable` coordinates `isExpanded`, direction and animation settings in context. `ExpandableContent` measures the natural inner box, sends that height to a motion value, and springs the outer clipped box between zero and the measured height. This avoids guessing content height and responds to images, localization and content changes. `ExpandableCardHeader` and `ExpandableCardContent` give descendants their own layout layer.

The local adaptation deliberately concentrates that architecture into one vertical disclosure. `Disclosure.Root` accepts `open?`, `defaultOpen?`, `onOpenChange?`, `instant?` and native div props. `Disclosure.Trigger` is a native button and composes `onClick`; it supplies stable IDs and `aria-expanded`/`aria-controls`. `Disclosure.Content` takes `children`, `className?`, and `region?`. It stays mounted to preserve local form state, becomes `inert` and `aria-hidden` immediately when collapsed, and exposes an optional named region for substantial content. Focus inside a collapsing body returns to its trigger.

```tsx
import { ContentCard, Disclosure } from "./measured-disclosure";

<ContentCard className="project-card">
  <h2>Delivery details</h2>
  <p>Arrives Friday. Standard delivery is included.</p>
  <Disclosure.Root defaultOpen={false} onOpenChange={recordLocalExpansion}>
    <Disclosure.Trigger className="project-button">Delivery options</Disclosure.Trigger>
    <Disclosure.Content className="project-panel-body" region>
      <label>Delivery note <textarea name="delivery-note" /></label>
    </Disclosure.Content>
  </Disclosure.Root>
</ContentCard>
```

`ContentCard` is an article shell with `data-slot`, leaving the host in charge of typography, radii, border and spacing. A card does not automatically become clickable. If it contains multiple actions, retain separate buttons/links instead of wrapping the article in another interactive element. A single destination may use a descriptive link heading and an appropriately scoped stretched link, provided it does not cover secondary actions.

The measurement hook uses `ResizeObserver`, initially reads the natural box, disconnects on unmount, and skips unchanged dimensions. Observe the inner element; observing an outer element that is itself animating height can form a feedback loop. The inner `display: flow-root` keeps margin collapse out of the measurement. Avoid applying scale transforms to this measuring layer. A project targeting browsers without `ResizeObserver` must use its existing measurement helper or show natural height without animation.

The adapted pointer spring retains the composition source's stiffness 200 and increases damping from 20 to 30 to avoid ordinary disclosure overshoot. That is a Fluidity tuning decision, not a claim that the source used 30. Keyboard and reduced-motion paths use duration zero. `instant` supplies the same choice for external controlled updates. Use Fluidity's smaller Motion disclosure recipe when content should unmount on close; choose this compound persistent variant when hidden content state must survive and parts must be freely composed. Do not introduce both for identical requirements.

Source defects deliberately removed: uncleaned hover toggle timers; implicit 320/480 pixel sizes; a generic div trigger; unimplemented `expandBehavior`; `animateIn` parameters not applied by the helper; collapse-start effects firing on mount; and retained content that remains keyboard focusable while clipped. Do not expose an API prop unless the implementation honors it.

## Direction-aware tabs

Local implementation: [`direction-aware-tabs.tsx`](../assets/composition/direction-aware-tabs.tsx).

The source derives direction from numeric tab IDs, animates a shared bubble, then translates outgoing and incoming content in opposite directions inside a measured height wrapper. Fluidity retains the three independent layers: selection indicator, panel presence, and container size. It computes direction from the actual item order and inverts it for RTL. Stable string IDs identify content; the per-instance `LayoutGroup` scopes the shared marker.

`DirectionAwareTabs` accepts `tabs: readonly { id, label, content, disabled? }[]`, controlled `value`, `onValueChange`, a required accessible `label`, optional `dir`, `className` and `instant`. IDs must be unique. Keep `value` valid; a missing or disabled value displays the first enabled item, and an entirely disabled/empty set renders no tabs. This fallback is presentation only and does not emit a synthetic change.

```tsx
const [tab, setTab] = useState("summary");
<DirectionAwareTabs label="Order details" value={tab} onValueChange={setTab}
  tabs={[
    { id: "summary", label: "Summary", content: <OrderSummary /> },
    { id: "history", label: "History", content: <OrderHistory /> },
  ]} />
```

Left/Right, Home and End move focus and select an enabled tab. Exactly one tab is in the normal tab sequence. `aria-selected`, `aria-controls`, a named tablist, and labelled tabpanels express the model. Automatic activation is appropriate because panels are local and immediately available; for network-dependent panels use manual activation and persistent loading states in the project's existing tabs primitive.

Pointer changes translate by a short 20px while fading; the source used 300px and 4px blur. The shorter distance removes unnecessary motion and blur cost while retaining direction. Keyboard and reduced-motion changes switch indicator, content and wrapper height immediately. Presence mode is `sync`, so new input can replace an in-flight destination without a lock. The outgoing panel is immediately inert and excluded from the accessibility tree. It must not remain focusable merely because it is still fading.

Panels unmount after exit; put form state above the tabs if it must persist. Keep vertical scrolling native. The tab row can overflow horizontally instead of shrinking labels or using a fixed desktop width. DOM IDs derive from stable encoded entity IDs; position is used only to determine direction. Latest presence data clears all outgoing panels immediately when keyboard/reduced-motion mode begins. External removal/replacement of focused content moves focus to the current tab, or to the empty container when no panels remain. This adaptation does not implement vertical tabs or nested remote routing.

## Sophisticated cards without mandatory demo styling

`CutoutCard` separates `Media`, `Image`, `Overlay`, `Content`, `Footer`, `InsetLabel`, `Pin` and `Action`; a context carries a controllable hovered value. Its root handlers call external handlers before checking `defaultPrevented`, and its parts expose `data-slot`. These are useful reusable seams even when all cutout decoration is removed.

For an image-led card, keep media in a defined aspect ratio, keep titles and metadata in normal flow, and reserve actions their own region. If an inset label is needed, keep its geometry stationary against the image edge; the source explicitly avoids entrance animation on the inset/corner layers to prevent seams. Corner masks belong to a specialized visual variation, not the base card model.

An action required to understand or operate a card is always available. The source Action hides via opacity and pointer events, which does not remove descendants from the keyboard sequence. Prefer an always-visible action; a genuinely secondary hover reveal also appears on focus-within and touch, and never becomes invisibly focusable. Do not rely on a cursor change to announce an action. CSS media zoom and action translation need the same reduced-motion rule as React motion; a shorter duration alone still moves content.

For Apple Glass Card, retain this separation of surface, media/content and explicit actions. Use project surface tokens, a readable opaque fallback, and small conditional backdrop blur only if requested. `distorted-glass.tsx` is rejected as its fractal noise filter is unrelated to disclosure, navigation or direct manipulation. `edge-blur.tsx` demonstrates layered mask construction but does not justify applying five backdrop-filter layers to every card.

## Drag, reorder and Stacked Card Set

`SortableList` binds `Reorder.Group` to a controlled ordered array and `Reorder.Item` to stable item values. `useDragControls` allows the drag to start from a designated handle; row content can use `layout="position"` while a measured box changes height. Presence handles removal while an explicit delete button remains a separate action.

For a reorderable list, retain this API shape: `items`, `onItemsChange(nextItems)`, `getItemId`, and a render slot. Use `dragListener={false}` and call `dragControls.start(event)` from a named handle with `touch-action: none` only on that handle. Keep page scrolling available elsewhere. Add Move up/Move down buttons or a tested keyboard drag model and a polite final-position announcement. Keep list items directly inside a list; render contextual actions inside the appropriate item. A pending delete selection and an item completion state are distinct concepts.

Do not import the source's whole-row drag behavior, empty handle, unchecked keyboard support, unlabeled trash icon, `z-index:9999` convention, or item-global `layoutId` values. Use a local stacking context and instance-scoped identities. Pointer reordering is a convenience, not the only path.

The conservative Fluidity Stacked Card Set combines the composition source's handle-only direct manipulation and position-only inner layout with the application source's bounded swipe selection and contextual layering. Selection changes which card is active; it does not reorder the underlying data. Inactive cards are inert. Previous/Next and named selection controls are primary controls, with drag optional. For finite sets, clamp the requested index. Derive movement from event delta or use the final offset once; the composition source's cylinder demo adds the accumulated offset on every drag update and must not be reproduced.

The composition source's `ThreeDCarousel` contributes only the idea that release velocity can affect settling and that background gestures stop while detail is open. Its cylindrical 1100/1800px geometry, rotate3d faces, remote placeholder images and click-only overlays are unnecessary. `FeatureCarousel` contributes layered content composition, not automatic cycling, animation locks or a click overlay that covers the whole composition.

## Morphing surfaces, drawers and anchored panels

Choose the semantic interaction before the animation. An inline form expands in document flow; a modal drawer/dialog interrupts the page and owns focus; an anchored popover remains attached to a trigger and needs collision handling. A visual morph does not make these the same component.

For an inline morphing form, use the measured disclosure shell with a state machine:

```ts
type FormPhase = "closed" | "editing" | "submitting" | "success" | "error";
// OPEN: closed -> editing, preserve draft.
// SUBMIT: editing/error -> submitting, validate and await the caller's action.
// RESOLVE: submitting -> success; announce completion once.
// REJECT: submitting -> error; keep draft and display retry guidance.
// CLOSE: editing/error/success -> closed; restore trigger focus.
```

`MorphSurface` has useful render seams (`renderTrigger`, `renderContent`, `renderIndicator`) and an independently shared status dot. Its defaults tie submission to a feedback message and expose only a Mac shortcut. Generalize to an explicitly labelled submit action and an optional platform-appropriate shortcut; keep Escape/cancel visible and drafts persistent unless the user explicitly discards them. A console log is not error handling. Do not close an async form optimistically unless the product specifies recovery and rollback.

The paired outside-interaction hook in `morph-surface.tsx` requires that interaction both begins and ends outside while the surface is open. This prevents a drag beginning inside from closing the panel on release outside, and prevents the opening click from also closing it. The local [`use-outside-interaction.ts`](../assets/composition/use-outside-interaction.ts) preserves that idea with pointer cancellation cleanup and `composedPath` checks. Pass stable refs for the trigger, surface and owned portalled content. It handles pointer click dismissal for an inline nonmodal surface only; it is not a dialog focus manager, does not add Escape behavior and does not replace a nested overlay manager. If a project already has a Radix dismissal layer, keep that instead.

`FamilyDrawer` is the stronger the composition source starting point for a modal drawer because it delegates to Vaul. Keep `Drawer.Root`, `Trigger`, `Portal`, `Overlay`, `Content`, `Close`, `Title` and `Description` responsibilities. Measure an inner view wrapper, animate the outer height, and cap it with a viewport/safe-area-aware maximum plus inner scrolling. The source derives opacity duration from absolute height difference, clamped to 0.15-0.27 seconds; this is a pointer-only optional refinement, not a delay before changing view. Retain dedicated view state independent of open state and preserve interrupted view changes.

Fix the source `onOpenChange || setInternalOpen` shortcut: with uncontrolled state and a notification callback, it stops changing internal state. Always update internal state when uncontrolled, then notify. The source header is a plain heading rather than a Drawer.Title and the default close is icon-only without an accessible name; correct those. Do not reset view state on an arbitrary timeout or wipe a draft simply because an overlay closed.

`FloatingPanel` reads a trigger rect and places content at `left` and `bottom + 8`. That is not complete positioning: viewport edges, zoom, scrolling and resize require repositioning/flipping. Keep the project's popover engine. Its `aria-modal` alone is insufficient; its `aria-expanded={false}` and close-clears-note behavior are not accepted. `ExpandableScreen` can inform separating shared surface geometry from a content fade, but its manual body-overflow mutation and click-only trigger are replaced by the accessible dialog primitive.

## Polls, result displays and voting

The composition source's newer `ChoicePoll` has a useful separation: selected IDs describe an unsubmitted draft; `hasVoted` describes submission; `votes` are result data; `showResults` controls presentation. An option context exposes selected state and percentage to independent label, indicator and progress parts. This is generalizable to a survey or decision card without copying a polling aesthetic.

For one selection, use native radios sharing a `name`, a fieldset and legend; for multiple selections, use labelled checkboxes. Retain a real submit button so selection does not immediately send data. If results are shown, render exact counts/percentages as text and let the decorative fill be `aria-hidden`. Animate fill with transform-origin at the inline start where practical. Clamp inputs to nonnegative finite counts and define zero-total as 0%. Do not animate screen-reader numbers every frame.

The source listbox-like option buttons include arrow/Home/End focus handling, but omit roving tab index and `aria-multiselectable`, and the listbox requires an accessible name. Its single selection can be cleared by clicking again, unlike ordinary radio selection. Do not combine these interaction models accidentally. It also uses a truthiness test when normalizing a controlled value, so an empty string switches modes. Use explicit undefined checks.

`VoteTally` exposes both a counts record and the IDs this user has voted for. Its immutable increment/decrement and `aria-pressed` trigger are reusable. Keep application authority outside the visual component: optimistic counts need request state and rollback, and a backend must enforce identity/duplicate rules. For sorting, derive the data order before mapping to `li`; the source's optional Group creates a `div` under a `ul`. A live vote update should not repeatedly move a focused item unless that behavior is intentionally designed. Name actions with their item, such as "Vote for keyboard shortcuts".

`ColorPicker` is a useful information-architecture reference: swatch, text input, channel controls, presets in a popover. Prefer the project's existing accessible picker or native `input type="color"` when adequate. For a full picker define one canonical color model and validate draft text separately from committed color. Source `useEffect([color])` calls `onChange`, the HSL input regex is malformed, partial hex silently becomes black, and the white/black plane is not consistent with the HSL mapping. Those implementation defects outweigh the benefit of copying its color utility functions.

## Presentation, numbers and dock recipes

For a multi-step presentation, derive the current content from a stable step ID and make controls real buttons with explicit accessible names. Preserve figure captions and reserve aspect ratio before images load. Only reveal optional layer details when they clarify the selected step; avoid staggering prose the user is trying to read. If autoplay is explicitly requested, provide pause, stop on user interaction/focus, suspend while hidden and respect reduced motion. It is off by default.

`AnimatedNumber` creates a spring from the actual number and uses a transform to format it, making numeric state independent of string representation. In Fluidity, the accessible text is the final exact value; any tweened visual digits are hidden from assistive technology, use tabular figures, and are optional for changing financial/data values. Update via `spring.set(value)` for pointer/ambient display changes, but jump/show the final value for reduced motion or keyboard-driven changes. Use the motion engine's completion event rather than `spring.get() === value` on every frame. Use `Intl.NumberFormat` or the project's formatter and keep precision a product decision.

`Dock` maps cursor distance to visual width: `distance = clientX - (rect.left + rect.width / 2)`; a three-point transform such as `[-150, 0, 150] -> [40, 80, 40]` feeds a spring. Share one pointer motion value among items. The the composition source implementation also subscribes separate global pointer tracking in each card and mixes `pageX` with viewport bounds; retain the simpler distance mapping from the motion patterns when synthesizing. Keyboard/touch users need ordinary named controls and a stable target size, with no perpetual bounce. A dock is specialized navigation, not the default application navbar.

## Review gates specific to these patterns

- Confirm actual dependencies from imports, not just registry metadata. Most accepted assets need only React and motion; the app's full Next/MDX/Three/Rive/AI dependency graph is not a component requirement.
- Mount two instances and verify no `layoutId`, SVG filter ID, tab IDs, labels or input IDs collide. Component labels and image URLs are not safe instance IDs.
- Resize a disclosure while open; test long labels and text zoom; verify height measurement tracks dynamic content and does not clip focus rings. Keep host card width fluid.
- Click/tap rapidly, reverse a transition, and use keyboard during a pointer animation. State must respond without locks, orphaned timers or stale exits. Check every animated layer honors `instant` and reduced motion.
- Test tab/shift-tab, disabled controls, collapse while focus is inside, and inactive panel/card focusability. Opacity, transforms and pointer-events do not remove an element from the accessibility tree or keyboard order.
- Test drag then cancel, drag from inside to outside, press outside then enter, and opening-click dismissal. Use the overlay library's own dismissal layer for nested portals.
- Test controlled false/empty values, uncontrolled notification callbacks, an invalid/deleted active item, empty collections and a single-item collection. Document intentional fallback behavior.
- For form/poll/vote recipes, test pending/rejected requests and verify success text only represents real completion. A visual animation does not implement persistence.
- Keep component selection proportional to the user task. A plain card, radio group or details element often fulfills the requirement without an expressive composition.
