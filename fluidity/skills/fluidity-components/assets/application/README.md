# Local application assets

These are small corrected implementation assets and larger local recipes distilled from the application patterns commit `8a29318ef09a97ba821cd711786ab6e241c96a57`. Read `../../references/application-patterns.md` for API evidence, selection decisions, source gaps, and seven-layer adaptation.

| Asset | Minimum dependencies | Contract |
| --- | --- | --- |
| use-controllable-state.ts | React | Concrete `next` setter; stable controlled/uncontrolled mode; required default |
| pagination.ts | None | One-based pages; zero pages represented by currentPage 0; normalized finite inputs |
| selection.ts | None | Stable string IDs; explicit selection scope; immutable returned Set |
| InlineEdit.tsx | React | Parent committed value; temporary local draft; async Save; explicit Cancel |
| recipes.md | Depends on selected recipe | Use the project's established primitives and data layer |

Do not install the application source's site dependencies. The snippets do not use its icon libraries, remote media, registry, analytics, or site CSS. The InlineEdit asset deliberately leaves visual styling to the project. The `className` prop styles its root; `data-fluidity="inline-edit"` and `.fluidity-inline-edit-actions` are hooks for project CSS. Preserve native visible focus styles or replace them with the project's visible focus treatment. Supply a standard screen-reader-only utility for `.fluidity-sr-only`:

```css
.fluidity-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

InlineEdit is single-line and uses English default action/status/error copy. Localize all visible and accessible strings together. `onSave` must update the parent's committed value and resolve after acceptance; reject to leave the session open. Cancel discards the draft before persistence starts. Pending save has no abort contract. For concurrent data sources, pass a stable revision to a product-specific mutation layer; the sample detects a changed value before Save but cannot implement server conflict resolution itself.

Usage examples:

```tsx
const [mode, setMode] = useControllableState({
  value: props.value,
  defaultValue: "compact",
  onChange: props.onValueChange,
});

<InlineEdit label="Display name" value={profile.name}
  validate={name => name.trim() ? undefined : "Enter a name."}
  onSave={async name => {
    const updated = await updateProfile({ name });
    setProfile(updated);
  }} />
```

The usage example assumes the application already supplies `updateProfile`, `profile`, and `setProfile`. It is not a persistence implementation. Import only the selected local files using the target project's path conventions.

```tsx
const page = paginationModel(requestedPage, totalPages, 7);
// Render a labeled nav. Numeric buttons use aria-current="page" only for the
// active page; gaps are noninteractive text; Previous/Next use canPrevious/canNext.

const visibleIds = visibleRows.map(row => row.id);
const header = selectionSummary(selectedIds, visibleIds);
// Wire header.mixed to the chosen checkbox primitive's indeterminate contract.
// Native checkbox indeterminate is a DOM property, not an HTML attribute.
const selectVisible = (checked: boolean) => {
  setSelectedIds(previous => setScopeSelected(previous, visibleIds, checked));
};
```

The pure helpers are intended to be exercised by the plugin's validation and by meaningful integration tests in the target product. Verify keyboard and pointer behavior, focus restoration, empty/invalid data, concurrent update behavior, narrow containers, and reduced motion in the actual host UI before shipping it. No source demo was executed as part of this static extraction; the development validation records exactly which code checks were run.
