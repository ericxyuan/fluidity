import assert from 'node:assert/strict';
import { paginationModel } from '../../fluidity/skills/fluidity-components/assets/application/pagination';
import { selectionSummary, setScopeSelected } from '../../fluidity/skills/fluidity-components/assets/application/selection';
import { swipeStep, boundedIndex } from '../../fluidity/skills/fluidity-components/assets/extensions/stack-model';

// Model invariants across changing data, not snapshots of implementation wording.
for (let total = 0; total <= 130; total++) for (let page = -3; page <= total + 3; page++) {
  const model = paginationModel(page, total);
  const numbers = model.items.filter((x): x is number => typeof x === 'number');
  assert.equal(new Set(numbers).size, numbers.length);
  assert(numbers.every(x => x >= 1 && x <= total));
  assert(numbers.every((x, i) => i === 0 || x > numbers[i - 1]));
  assert(numbers.length <= 7);
  if (total) { assert(numbers.includes(1)); assert(numbers.includes(total)); assert(numbers.includes(model.currentPage)); }
  else assert.equal(model.currentPage, 0);
}
assert.equal(paginationModel(NaN, Infinity).currentPage, 0);
const original = new Set(['outside', 'a']);
assert.deepEqual(selectionSummary(original, ['a', 'a', 'b']), { all: false, mixed: true, selectedInScope: 1 });
assert.deepEqual([...setScopeSelected(original, ['a', 'b'], false)], ['outside']);
assert.deepEqual([...original], ['outside', 'a']);
assert.equal(selectionSummary(original, []).all, false);
assert.equal(swipeStep(-2, -650, 300), 1);
assert.equal(swipeStep(-90, 700, 300), -1); // recent reversal wins
assert.equal(swipeStep(-10, 0, 300), 0);
assert.equal(swipeStep(NaN, 600, 300), 0);
assert.equal(swipeStep(-65, 0, 300), 1);
assert.equal(boundedIndex(0, -1, 3), 0);
assert.equal(boundedIndex(2, 1, 3), 2);
assert.equal(boundedIndex(0, 1, 0), -1);
console.log('PASS: pagination, stable selection, swipe intent and bounds invariants');
