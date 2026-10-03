import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('examples render without external services, console errors or axe violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Behavior before decoration.' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Project stages' })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: '.validation/preview-desktop.png', fullPage: true });
});

test('persistent disclosure keeps its draft but hides focusable descendants', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Show project details' });
  await trigger.focus(); await page.keyboard.press('Enter');
  const input = page.getByRole('textbox', { name: 'Private note' });
  await input.fill('Keep this draft');
  await trigger.focus(); await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-slot="disclosure-content"]')).toHaveAttribute('inert', '');
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Keep this draft');
  await expect(input).toBeVisible();
});

test('tabs support roving keyboard navigation and linked current panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  const active = page.getByRole('tab', { name: 'Activity' });
  await expect(active).toBeFocused(); await expect(active).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Activity' })).toBeVisible();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('inline editing validates, saves once and restores focus; cancellation preserves value', async ({ page }) => {
  await page.goto('/');
  const edit = page.getByRole('button', { name: 'Edit Project name' });
  await edit.click();
  const input = page.getByRole('textbox', { name: 'Project name', exact: true });
  await input.fill(''); await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toHaveText('Enter a project name.');
  await input.fill('Updated project'); await page.keyboard.press('Enter');
  await expect(edit).toBeFocused();
  await expect(page.getByText('Updated project', { exact: true })).toBeVisible();
  await edit.click(); await input.fill('Discard'); await page.keyboard.press('Escape');
  await expect(edit).toBeFocused(); await expect(page.getByText('Updated project', { exact: true })).toBeVisible();
});

test('async save rejection and external update preserve edit session', async ({ page }) => {
  await page.goto('/?test');
  await page.getByRole('button', { name: 'Edit Rejecting save' }).click();
  await page.getByRole('textbox', { name: 'Rejecting save', exact: true }).fill('Try saving');
  await page.getByRole('textbox', { name: 'Rejecting save', exact: true }).press('Enter');
  await expect(page.getByRole('alert')).toContainText('Could not save');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Edit Conflicting edit' }).click();
  await page.getByRole('textbox', { name: 'Conflicting edit', exact: true }).fill('Local draft');
  await page.getByRole('button', { name: 'Simulate external update' }).click();
  await expect(page.getByRole('alert')).toContainText('changed elsewhere');
  await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
});

test('stack has bounded keyboard selection and only active content', async ({ page }) => {
  await page.goto('/');
  const stack = page.getByRole('region', { name: 'Project stages' });
  await expect(stack.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  const next = stack.getByRole('button', { name: 'Next', exact: true });
  await next.focus(); await page.keyboard.press('Enter');
  await expect(stack.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
  await expect(stack.getByRole('heading', { name: 'Draft', exact: true })).toHaveCount(0);
  await page.keyboard.press('Enter');
  await expect(next).toBeDisabled();
  await stack.getByRole('combobox').selectOption('draft');
  await expect(stack.getByRole('heading', { name: 'Draft', exact: true })).toBeVisible();
});

test('stack swipe advances one card, settles and cancellation does not select', async ({ page }) => {
  await page.goto('/');
  const stack = page.getByRole('region', { name: 'Project stages' });
  const handle = stack.getByRole('button', { name: 'Drag card horizontally, or use Previous and Next' });
  let box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - 160, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(stack.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
  await expect.poll(async () => stack.locator('.fluidity-stack-card').evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41))).toBeLessThan(1);
  box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  await page.mouse.move(box.x - 130, box.y + box.height / 2, { steps: 10 });
  await handle.dispatchEvent('pointercancel', { pointerId: 1, isPrimary: true, bubbles: true });
  await page.mouse.up();
  await expect(stack.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
});

test('stack accepts removed selections and empty data', async ({ page }) => {
  await page.goto('/?test');
  const stack = page.getByRole('region', { name: 'Dynamic cards' });
  await page.getByRole('button', { name: 'Remove selected card' }).click();
  await expect(stack.getByRole('heading', { name: 'two' })).toBeVisible();
  await page.getByRole('button', { name: 'Empty cards' }).click();
  await expect(stack).toContainText('No cards available.');
  await expect(stack.getByRole('button')).toHaveCount(0);
});

test('narrow viewport, enlarged text, reduced motion and forced colors remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 125%; }' });
  const stack = page.getByRole('region', { name: 'Project stages' });
  await stack.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(stack.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: '.validation/preview-mobile.png', fullPage: true });
  await page.emulateMedia({ forcedColors: 'active' });
  expect(await page.locator('.fluidity-glass-card').evaluate(el => getComputedStyle(el).backdropFilter)).toBe('none');
});

test('pointer transition followed by keyboard navigation clears every exiting tab panel immediately', async ({ page }) => {
  await page.goto('/?test');
  const tabs = page.locator('[data-slot="directional-tabs"]').filter({ has: page.getByRole('tablist', { name: 'Dynamic panels' }) });
  await tabs.getByRole('tab', { name: 'beta', exact: true }).click();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: 'gamma', exact: true })).toBeFocused();
  expect(await tabs.locator('[role="tabpanel"]').count()).toBe(1);
});

test('dynamic tab removal keeps IDs unique and restores focus from removed content', async ({ page }) => {
  await page.goto('/?test');
  const tabs = page.locator('[data-slot="directional-tabs"]').filter({ has: page.getByRole('tablist', { name: 'Dynamic panels' }) });
  await tabs.getByRole('button', { name: 'Remove this panel' }).click();
  const ids = await tabs.locator('[id]').evaluateAll(elements => elements.map(el => el.id));
  expect(new Set(ids).size).toBe(ids.length);
  await expect(tabs.getByRole('tab', { name: 'beta', exact: true })).toBeFocused();
  await expect(tabs.getByRole('tabpanel', { name: 'beta' })).toBeVisible();
});

test('generic presence also removes stale exits when switching to keyboard input', async ({ page }) => {
  await page.goto('/?test');
  const region = page.getByRole('region', { name: 'Presence edge case' });
  await region.getByRole('button', { name: 'Change presence content' }).click();
  await page.keyboard.press('Enter');
  expect(await region.locator('[data-presence-frame]').count()).toBe(1);
  await expect(region.locator('[data-presence-frame]')).toHaveText('Content 2');
});
