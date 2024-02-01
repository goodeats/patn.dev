import { clickLink, expectHeading, expectUniqueText } from '#tests/page-utils'
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
		const testRoute = `/admin/pages/${newPage.slug}`

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// edit link
		await clickLink(page, 'edit')
		await expect(page).toHaveURL(`${testRoute}/edit`)
		await clickLink(page, 'cancel')
		await page.goto(testRoute)

		// main content
		await expectHeading(page, newPage.name)
		await expectUniqueText(page, newPage.description)
		await expectUniqueText(page, 'Published')
	})
})
