
/** Selection is by stable ID, independent of row position/sorting.
 * The caller chooses the scope (current page, filtered results, or all rows).
 */
export function selectionSummary(
  selected: ReadonlySet<string>,
  scope: readonly string[],
): { all: boolean; mixed: boolean; selectedInScope: number } {
  const unique = [...new Set(scope)];
  const count = unique.reduce((n, id) => n + Number(selected.has(id)), 0);
  return { all: unique.length > 0 && count === unique.length,
    mixed: count > 0 && count < unique.length, selectedInScope: count };
}

export function setScopeSelected(
  selected: ReadonlySet<string>,
  scope: readonly string[],
  checked: boolean,
): Set<string> {
  const next = new Set(selected);
  scope.forEach(id => { if (checked) next.add(id); else next.delete(id); });
  return next;
}
