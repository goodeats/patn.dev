import { clickLink, expectHeading } from '#tests/page-utils'
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
		const testRoute = '/admin'
		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// sidebar content
		await clickLink(page, 'admin')
		await expect(page).toHaveURL(testRoute)

		await clickLink(page, 'profile')
		await expect(page).toHaveURL('/settings/profile')
		await page.goto(testRoute)

		await clickLink(page, 'pages')
		await expect(page).toHaveURL('/admin/pages')
		await page.goto(testRoute)

		// main content
		await expectHeading(page, 'Welcome Admin')
	})
})
