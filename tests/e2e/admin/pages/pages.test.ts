import { expect, test } from '#tests/playwright-utils.ts'

test.describe('Users cannot view Admin Pages', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/admin/pages')
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin Pages', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		await page.goto('/admin/pages')
		await expect(page).toHaveURL('/admin/pages')

		// main content
		await expect(
			page.getByRole('heading', { name: 'Pages', exact: true }),
		).toBeVisible()
	})
})
