import { expect, test } from '#tests/playwright-utils.ts'

test.describe('Users cannot view Admin', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/admin')
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		await page.goto('/admin')
		await expect(page).toHaveURL('/admin')

		// sidebar content
		const adminLink = page.getByRole('link', { name: /admin/i })
		await adminLink.click()
		await expect(page).toHaveURL('/admin')

		const profileLink = page.getByRole('link', { name: /profile/i })
		await profileLink.click()
		await expect(page).toHaveURL('/settings/profile')
		await page.goto('/admin')

		// main content
		await expect(
			page.getByRole('heading', { name: 'Welcome Admin', exact: true }),
		).toBeVisible()
	})
})
