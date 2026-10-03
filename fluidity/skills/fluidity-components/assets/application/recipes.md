# Application recipes from the application source implementations

These recipes preserve source interaction and composition without requiring source downloads. The contracts below are **Fluidity adaptation contracts**, not claims about upstream exported types. Read `../../references/application-patterns.md` for original APIs and reasons for each correction.

## Select an implementation by actual task

| Task | Start with | Preserve from the application source | Add only when useful |
| --- | --- | --- | --- |
| Pick one item from a short list | Project/native select | Compact current-value summary; stable IDs | Optional icon beside the label |
| Pick one of a few always-visible choices | Radio group | Separate focused and selected state | Small selection indicator |
| Search a long option set | Existing combobox primitive | Input + grouped options + empty state + selected item | Matching keywords and async loading |
| Select multiple tags | Combobox chips or labeled checkbox list | ID array/set and independent removal | Search when the option set requires it |
| Run a command | Existing command palette + dialog | Grouped search, active result, keyboard commit | Scoped product shortcut |
| Reveal details in place | Unified disclosure | Natural inner size and persistent summary | Scoped shared-element continuity |
| Navigate records | Links/routes or a list-detail view | Record ID state and focus restoration | Measured local transition |

Do not use a command menu for form selection just because its search UI looks suitable. A form control needs a label, value submission, validation, and selection semantics. A command palette executes an action. A menu contains actions or menu selections. Keep these distinctions in the adapter API.

## 1. Compact filter and multi-selection

Source ingredients: StatusPicker's controlled selected ID and independent open/hover state; FilterDisclosure's compact trigger summary; the Base UI Combobox slots and Combobox10's immutable selected ID array.

Suggested data contract:

```ts
type Option = {
  id: string;
  label: string;
  description?: string;
  keywords?: readonly string[];
  disabled?: boolean;
};
type SelectionProps = {
  label: string;
  options: readonly Option[];
  value: string | null;
  onValueChange(next: string | null): void;
  disabled?: boolean;
};
```

Implementation sequence:

1. Resolve the selected option by ID each render. Handle a missing ID deliberately: show an unavailable value with validation or clear it through the parent data policy. Do not silently select the first item unless the product specifies that default.
2. Use a native select for the short ordinary case. An optional empty choice has `value=""`, mapped to `null`; require nonempty actual IDs or use an encoding layer. Pass the field's name/disabled/required state using the host form conventions.
3. For search, use the project's combobox Root, Input, List, Item, and Empty equivalents. If using the source-inspired Base UI composition, keep Content's Portal/Positioner/Popup order and bound the list by available height. Let the primitive own focus and selection; do not add a competing keyboard listener.
4. Keep query, highlighted result, and committed value separate. Changing the query does not select an option. Selecting commits once through `onValueChange` and then follows the primitive's normal close behavior.
5. For multiple selection, maintain stable IDs. A badge's remove action is a real sibling/button or the primitive's ChipRemove, named `Remove {label}`. Never nest that button within a button trigger. Give removal focus a destination when the last chip disappears.
6. Layout uses a full-width field with wrapping chips. Popup geometry belongs to the anchor/positioner. Icons are supplied by the project and are decorative when the visible label provides the name.
7. Optional motion belongs to an indicator or summary replacement. Keyboard selection is immediate. Essential labels remain readable and available while any decorative element exits.

Minimal ordinary selection, adapted to the project styles:

```tsx
<label htmlFor={fieldId}>{label}</label>
<select id={fieldId} value={value ?? ""} disabled={disabled}
  onChange={event => onValueChange(event.target.value || null)}>
  <option value="">Choose an option</option>
  {options.map(option => (
    <option key={option.id} value={option.id} disabled={option.disabled}>
      {option.label}
    </option>
  ))}
</select>
```

Acceptance: label announced, selection available to forms, keyboard works without pointer, clear/removal actions named, no nested buttons, small viewport popup stays usable, selected state survives reordering, and empty results contain no active option.

## 2. Grouped command palette with optional surface continuity

Source ingredients: CommandSearch filtering/grouping/active index and shared trigger/input surface; the repository's semantic Dialog and Combobox/command primitive foundations.

```ts
type Command = {
  id: string;
  label: string;
  group: string;
  keywords?: readonly string[];
  disabled?: boolean;
  run(): void | Promise<void>;
};
```

Create one semantic dialog controlled by `open`. Give it an accessible title. Its search control has a label even if the design uses a placeholder. Within it, use one established command/combobox implementation for active option, keyboard navigation, and grouped options. The portal bounds content to the viewport; the result list owns scrolling, not the whole app.

Filter using normalized label + keywords. Preserve groups only when they have results. Store an active ID or let the command primitive manage it; raw array position can become stale after filtering. No result means no active ID. Before running, confirm the ID still belongs to current, enabled results. A pending asynchronous command has a real status and error path; whether the palette closes before or after completion depends on the command's actual task, not its animation.

Open focus is synchronous through the primitive's lifecycle. Close returns to the invoking control, unless execution intentionally navigates to a different route or focus context. The source's 100 ms focus delay is not needed. Keyboard shortcuts are optional configuration owned by the application. Scope them and skip composing/editable targets; do not import the demo's global `F` handler.

For pointer-triggered continuity, a scoped LayoutGroup can connect a decorative trigger shell to the palette shell. Do not duplicate active inputs or buttons to achieve the visual morph. Essential content and focus stay within the semantic dialog from the first frame. Under reduced motion or keyboard invocation, show the new state immediately according to the canonical policy.

Acceptance: no modulo-zero active index; no single-letter shortcut collisions; no focus outside the modal; Escape and close return focus; filtered/disabled commands cannot run accidentally; async failure is visible; repeated instances have independent motion identity.

## 3. List-detail card and contextual stack

Source ingredients: TransactionList's selected record ID, measured inner height, `layout="position"` identity fields; DialogStack's retained prior-context layer; ListStack's explicit disclosure state. Use the unified measured disclosure/card implementation for sizing rather than copying a second measurement hook.

```ts
type RecordSummary = { id: string; title: string; subtitle?: string };
type DetailViewProps<T extends RecordSummary> = {
  records: readonly T[];
  activeId: string | null;
  onActiveIdChange(id: string | null): void;
  renderSummary(record: T): React.ReactNode;
  renderDetail(record: T): React.ReactNode;
};
```

Build a semantic list with stable IDs. Each summary exposes one primary action as a real button for local detail or link for navigation. Store the invoking element for focus return. Keep record identity fields in the detail view and place additional metadata below. Use headings and a clear Back action. If a selected record is removed by a live update, show an unavailable state or return through the data policy; do not render a blank measured shell.

Place one natural-height inner element within the layout shell. Keep its padding/border calculation explicit; measuring `getBoundingClientRect()` already includes its own border box. Animate the outer shell only if this assists pointer-driven continuity. If text must retain identity while the shell changes size, use position-only layout motion or a separate text layer. Scope shared IDs by instance and record, such as `${instanceId}:title:${record.id}`.

A contextual stack may show one or two **decorative** previous layers. Those layers are aria-hidden, contain no focusable controls, and do not obscure the active title or Back/Close controls. Avoid rendering the entire inactive form tree merely to create the background silhouette. A modal stack uses one established dialog shell; changing its internal active step should not spawn several independently active modals. Close means close; Back means previous step. Store draft values outside a step that unmounts if the flow preserves drafts.

Expanded collection layout must contribute actual height to the document. A collapsed preview can be a summary plus a few decorative layers and a `Show N items` button with `aria-expanded` and `aria-controls`. Expanded items follow source order. Do not use the application source's reverse index positioning as the logical order, or let a fixed 400 px example host determine usable space.

Acceptance: summary identity preserved, data updates handled, logical/tab/visual order agree, only active surfaces accept interaction, focus returns correctly, multiple instances do not cross-animate, content grows beyond demo length without clipping, and keyboard changes are immediate.

## 4. Data table, selection, and finite pagination

Source ingredients: DataTable1's selected ID set and mixed header; AssetTableCard's explicit three-state sorting; usePagination's endpoints plus neighbor pages; CreditUsageCard's metric/history/action structure.

Keep raw values in the data model:

```ts
type Row = {
  id: string;
  name: string;
  status: "pending" | "complete" | "failed";
  amount: number | null;
};
type Sort = { field: "name" | "amount"; direction: "asc" | "desc" } | null;
```

Compute filtering and sorting without mutating the source collection. For numeric fields, compare numeric values and define where nulls appear. Format with the project's locale only while rendering. AssetTableCard's formatted-string stripping is not a safe general numeric sort. For equal values, use stable source order or an explicitly documented ID tie break. A sortable `<th>` contains a button and owns `aria-sort`; sorting cannot be pointer-only.

Selection scope is explicit. Current-page selection and all-filtered-results selection are different actions. Use `selectionSummary(selectedIds, scopeIds)` and `setScopeSelected` to preserve selections outside the selected scope. Header mixed/all state is computed from membership, not from equal array lengths. Empty scope is neither all nor mixed. A native checkbox needs its `indeterminate` DOM property set; use the correct indeterminate API of the host primitive.

`paginationModel` normalizes total/current page and reserves endpoints, then fills a bounded interior window with neighbors and gaps. It does not fetch data. Its `maxVisible` counts numeric page buttons, excluding ellipses and Previous/Next. For zero pages the current page is zero and both directions are disabled. Clamp a URL/page request through this model or the application's routing policy when the filtered total shrinks; do not leave the UI on an unavailable page.

Render pagination in a named `<nav>`. Active numeric controls use `aria-current="page"`; gap markers are noninteractive. Use links if page changes are represented by navigation URLs and buttons if they change local data. On local page change, preserve the user's orientation with the table heading/status rather than animating every row. Keep selection IDs stable across page/sort changes.

At narrow widths, retain a semantic table within a labeled, discoverable horizontal scroll region or deliberately transform the information architecture into a record list. Do not simply hide essential columns. Header labels, amount alignment, empty/error/loading state, selected count, and batch actions remain meaningful at every width.

For resource cards, render the overview metric before the table, then keep history controls with the history they affect. A period selector must invoke filtering/loading rather than just update a label. Share/export/refresh menus need real implementations. Quote CSV fields, escape embedded quotes/newlines, and follow the product's spreadsheet-safety policy. Avoid automatically adding a parser/export dependency for a card if an existing export layer is available.

Acceptance: selection scope is labeled, mixed state correct for empty/subset/off-page selection, sorting works with keyboard and locale-formatted output, invalid pages normalize, row IDs survive reorder, table works at narrow widths, menu actions are real, and numeric changes are represented in text.

## 5. Availability interval editor

Source ingredients: SlotPicker's nested immutable day/slot updates; retained intervals when disabled; layout-presence behavior around local row changes.

Use a domain model such as day ID, enabled, and a list of interval IDs with start/end values. The upstream display strings are not a timezone/calendar model. If the product edits weekly local availability, define timezone and midnight crossover explicitly. If it edits dated appointments, include date and offset/zone rules in the real domain layer.

Treat edits as parent-controlled updates or as an explicit draft session with Apply/Cancel. Avoid an ambiguous `days` prop that initializes a hidden local copy once. Generate a stable new interval ID at the action boundary. Preserve existing IDs across field edits. Validate ranges and overlaps through the application's rules; present errors at the relevant interval and prevent an invalid commit.

A day switch exposes its name and checked state. When disabled, intervals may be preserved as data but removed from active interaction. Add Interval inserts a predictable empty/default interval, then focuses its first field. Remove Interval moves focus to a neighboring interval or Add Interval. If removing the final interval disables the day, show that policy clearly and update both states atomically; otherwise leave the day enabled with an explicit empty/error state.

Use a wrapping grid for From/To/actions so long localized labels and small containers fit. Keep source layout motion local to the changed group and honor the unified keyboard/reduced-motion policy. Never stagger form fields so the next input appears after focus tries to reach it.

Acceptance: add/edit/remove/disable/re-enable preserve correct data; controlled updates appear; invalid or overlapping intervals cannot silently commit; field labels include day/interval context; focus survives deletion; narrow layout and long labels work.

## 6. Native numeric interaction with an optional custom display

Source ingredients: AdaptiveSlider's native range overlay, RangeSelectionSlider's staged Apply/Cancel values, and ScrubSlider's measured tick spacing.

The semantic numeric control is the source of truth. For a single range, retain a native input or existing range primitive. Its label, value, min/max/step, keyboard, and disabled behavior must remain intact. A track, thumb shape, ruler, or value bubble can be decorative. Keep the actual focus treatment visible even if the native input is transparent. If a direct numeric entry is available, make it obvious and keep it synchronized.

Reject invalid bounds and nonpositive steps in the adapter API. Handle a fixed range as a fixed value rather than dividing by zero. Snap relative to min, then clamp. A two-ended range needs a defined gap/crossing rule. When the control is a draft filter, store the opening interval separately so Cancel restores the correct session value; Apply submits the current draft.

For a scrub ruler, derive visual tick spacing from the available inner width and number of ticks. Re-measure after resize and when pointer mapping needs a fresh bounding rectangle; page scrolling can invalidate a cached left coordinate. Use pointer capture if implementing custom pointer presentation. Pointer cancellation/loss must release the dragging state. Keep the native range responsible for keyboard and assistive interaction.

Movement under a pointer follows the input directly. A spring can settle a decorative bubble after release if appropriate. Never delay the committed numeric value until spring completion. Avoid React state updates for every decorative animation frame; bind MotionValues to visual properties. Announce one complete value with units, not all repeated digits of a rolling-number column.

Acceptance: min-relative snapping correct; 0/1 tick and fixed-range cases handled; keys and exact entry work; pointer cancellation does not stick; no lag in direct manipulation; two handles have distinct names; cancellation restores session state; reduced motion shows correct values immediately.

## 7. Async confirmation and cancellation timing

CopyConfirm correctly waits for clipboard success before confirming. Preserve the operation-to-feedback dependency:

```text
idle --activate--> pending
pending --operation resolves--> success
pending --operation rejects--> error
success --feedback reset or next action--> idle
error --retry--> pending
```

Keep a real button and a stable label. Announce success/error separately; do not make the changing icon its only communication. Store a feedback timer handle, replace it on a new successful operation, and clear it on unmount. Disable only overlapping operations that cannot safely run concurrently. Do not create a false success while an API request is still pending.

TimedUndoAction is a visual countdown demonstration, not a working delete API. When a product actually needs deferred commitment, use a deadline rather than decrementing an assumed one-second interval; browser timers can be throttled. Countdown ticks update presentation only. A cancellation action is available throughout the promised window. Commit exactly once through a guarded operation outside React state updaters, with failure handling. Keep distinct labels for cancel-pending, undo-completed, and permanent deletion; their semantics are different.

No destructive action is introduced by these recipes. Connect the pattern only to an action already required and authorized by the application task. The default Fluidity component library should not turn a decorative deletion countdown into automatic destructive behavior.

## Dependency and adaptation ledger

| Recipe | Behavior dependency | Visual dependency | Avoid inheriting |
| --- | --- | --- | --- |
| Short selection | Native HTML or existing form primitive | None | Emoji and icon packages |
| Search/command | Existing combobox/command plus dialog primitive | Optional Motion | A second primitive toolkit, global hotkeys |
| Local detail/disclosure | Unified measured disclosure/card | Optional shared-element Motion | Duplicate measurement library and global layout IDs |
| Table/pagination | Native table + local pure helpers | None | Recharts for table decoration |
| Availability | Existing inputs/switches + domain validator | Optional local layout motion | Date parsing inferred from text inputs |
| Range/ruler | Native range or existing slider | Optional Motion | Parallel touch/mouse plumbing |
| Async feedback | Browser/product async API | Optional icon/opacity change | Arbitrary timer-governed operation completion |

Use only the selected row. Reuse existing project dependencies and utilities before adding any. A static screenshot is insufficient verification of these interaction contracts; exercise the implemented paths in the host application.
