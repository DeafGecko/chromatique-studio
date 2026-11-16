import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const WCAG_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const presets = ['Raw Linen', 'Cast Iron', 'Modern Olive', 'Swiss Dark']

async function settle(page) {
  // preview colours transition over 150ms; wait for them to finish before scanning
  await page.mouse.move(0, 0)
  await expect.poll(() => page.locator('p[contenteditable]').evaluate(el => getComputedStyle(el).transitionProperty)).toBeTruthy()
  await page.waitForTimeout(250)
}

async function expectWcagAa(page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze()
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target.join(' ')) }))).toEqual([])
}

for (const name of presets) {
  test(`${name} preset meets WCAG 2.1 AA`, async ({ page }) => {
    await page.getByRole('button', { name, exact: true }).click()
    await settle(page)
    await expectWcagAa(page)
  })
}

test('default page meets WCAG 2.1 AA with every colour-blindness mode', async ({ page }) => {
  for (const mode of ['Protan', 'Deuter', 'Tritan', 'Normal']) {
    await page.getByRole('button', { name: mode, exact: true }).click()
    await settle(page)
    await expectWcagAa(page)
  }
})

test('edit mode meets WCAG 2.1 AA', async ({ page }) => {
  await page.getByRole('button', { name: 'Edit preview text' }).first().click()
  await settle(page)
  await expectWcagAa(page)
})

test('export modal meets WCAG 2.1 AA', async ({ page }) => {
  await page.getByRole('button', { name: 'Export Token Schema' }).click()
  await settle(page)
  await expectWcagAa(page)
})

test('tab order reaches the main controls in sequence', async ({ page }) => {
  const reached = []
  await page.keyboard.press('Tab')
  for (let i = 0; i < 40; i++) {
    const label = await page.evaluate(() => {
      const el = document.activeElement
      return el && el !== document.body
        ? (el.getAttribute('aria-label') || el.textContent || el.value || '').trim()
        : null
    })
    if (label) reached.push(label)
    await page.keyboard.press('Tab')
  }
  expect(reached.indexOf('Reset Default')).toBeLessThan(reached.indexOf('Raw Linen'))
  expect(reached.indexOf('Background Hex Code')).toBeLessThan(reached.indexOf('Text Hex Code'))
  expect(reached).toContain('Export Token Schema')
})

test('focused controls show a visible outline', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Raw Linen', exact: true })
  await button.focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Shift+Tab')
  const outline = await button.evaluate(el => getComputedStyle(el).outlineStyle)
  expect(outline).not.toBe('none')
})

test('contrast panel reports the default pair as passing AA and AAA', async ({ page }) => {
  await expect(page.getByText('13.27:1')).toBeVisible()
  const panel = page.getByRole('region', { name: 'Color Palettes' })
  await expect(panel.getByText('PASS').first()).toBeVisible()
})

async function blur(page) {
  await page.evaluate(() => document.activeElement?.blur())
}

test.describe('keyboard shortcuts', () => {
  test('legend stays hidden until a key is pressed', async ({ page }) => {
    await expect(page.getByRole('list', { name: 'Keyboard shortcuts' })).toHaveCount(0)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('list', { name: 'Keyboard shortcuts' })).toBeVisible()
  })

  test('/ moves focus to the background hex input', async ({ page }) => {
    await blur(page)
    await page.keyboard.press('/')
    await expect(page.getByLabel('Background Hex Code')).toBeFocused()
  })

  test('/ does not hijack typing in a text field', async ({ page }) => {
    const input = page.getByLabel('Text Hex Code')
    await input.fill('')
    await input.press('/')
    await expect(input).toHaveValue('/')
  })

  test('r resets to the default pair', async ({ page }) => {
    await page.getByRole('button', { name: 'Cast Iron', exact: true }).click()
    await blur(page)
    await page.keyboard.press('r')
    await expect(page.getByLabel('Background Hex Code')).toHaveValue('#D8D8DC')
  })

  test('e toggles preview editing and Escape exits', async ({ page }) => {
    await blur(page)
    await page.keyboard.press('e')
    await expect(page.getByRole('button', { name: 'Finish editing preview text' }).first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Edit preview text' })).toBeVisible()
  })
})

test('a near-invisible custom pair reports FAIL', async ({ page }) => {
  await page.getByLabel('Text Hex Code').fill('#C8C8CC')
  await page.getByLabel('Text Hex Code').press('Enter')
  await expect(page.getByText('1.17:1')).toBeVisible()
  await expect(page.getByText('FAIL').first()).toBeVisible()
})
