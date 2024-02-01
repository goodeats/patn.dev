import { expect, test } from '#tests/playwright-utils.ts'

test.describe('Users cannot view Admin', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/admin')
		await expect(page).toHaveURL(`/`)
	})
})
