import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('default page has no axe violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('Swiss Dark preset has no axe violations', async ({ page }) => {
  await page.getByRole('button', { name: 'Swiss Dark', exact: true }).click()
  // preview colours transition over 150ms; wait for them to settle before scanning
  await expect.poll(() => page.locator('p[contenteditable]').evaluate(el => getComputedStyle(el).color)).toBe('rgb(229, 62, 62)')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
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
