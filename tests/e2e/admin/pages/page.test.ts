import { clickLink, expectUniqueText } from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from './pages-utils'

test.describe('Users cannot view Admin Page', () => {
	test('when not logged in', async ({ page }) => {
		const newPage = await insertPage({})
		await page.goto(`/admin/pages/${newPage.slug}`)
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin Page', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		const newPage = await insertPage({})
		const testUrl = `/admin/pages/${newPage.slug}`

		await page.goto(testUrl)
		await expect(page).toHaveURL(testUrl)

		// edit link
		await clickLink(page, 'edit')
		await expect(page).toHaveURL(`/admin/pages/${newPage.slug}/edit`)
		await clickLink(page, 'cancel')
		await page.goto(testUrl)

		// main content
		await expect(
			page.getByRole('heading', { name: newPage.name }),
		).toBeVisible()
		await expectUniqueText(page, newPage.description)
		await expectUniqueText(page, 'Published')
	})
})
