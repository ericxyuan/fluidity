export type PaginationItem = number | "gap-start" | "gap-end";
export interface PaginationModel {
  currentPage: number;
  totalPages: number;
  items: PaginationItem[];
  canPrevious: boolean;
  canNext: boolean;
}

/** Page numbers are one-based; an empty collection has currentPage=0.
 * Retain endpoints and nearby pages. maxVisible counts numeric page buttons,
 * excluding gaps, Previous, and Next. It is clamped to at least five.
 */
export function paginationModel(
  currentPage: number,
  totalPages: number,
  maxVisible = 7,
): PaginationModel {
  const total = Number.isFinite(totalPages)
    ? Math.max(0, Math.floor(totalPages))
    : 0;
  const visible = Number.isFinite(maxVisible)
    ? Math.max(5, Math.floor(maxVisible))
    : 7;
  const page = total === 0 ? 0 : Math.min(total, Math.max(1,
    Number.isFinite(currentPage) ? Math.floor(currentPage) : 1));
  const pages: number[] = [];
  if (total <= visible) {
    for (let n = 1; n <= total; n++) pages.push(n);
  } else {
    const interior = visible - 2;
    const start = Math.min(total - interior,
      Math.max(2, page - Math.floor((interior - 1) / 2)));
    pages.push(1);
    for (let n = start; n < start + interior; n++) pages.push(n);
    pages.push(total);
  }
  const items: PaginationItem[] = [];
  pages.forEach((n, index) => {
    if (index > 0 && n - pages[index - 1] > 1) {
      items.push(index === 1 ? "gap-start" : "gap-end");
    }
    items.push(n);
  });
  return { currentPage: page, totalPages: total, items,
    canPrevious: page > 1, canNext: page > 0 && page < total };
}
