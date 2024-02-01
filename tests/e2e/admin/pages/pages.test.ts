import { prisma } from '#app/utils/db.server'
import {
	clickLink,
	expectHeading,
	expectPageTableHeaders,
	expectPageTableRowContent,
	pageTableRowCount,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from './pages-utils'

test.describe('Users cannot view Admin Pages', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/admin/pages')
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin Pages', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		const testRoute = '/admin/pages'
		await prisma.page.deleteMany()
		const newPage = await insertPage({})

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// new link
		await clickLink(page, 'add page')
		await expect(page).toHaveURL(`${testRoute}/new`)
		await page.goto(testRoute)

		// main content
		await expectHeading(page, 'Pages')

		// table content
		await expectPageTableHeaders(page, ['Order', 'Page', 'Published', 'Date'])
		const rowCount = await pageTableRowCount(page)
		const pageUpdatedAt = new Date().toLocaleDateString()
		const rowContent = ['0', newPage.name, 'No', pageUpdatedAt]
		await expectPageTableRowContent(page, rowCount - 1, rowContent)

		// table link to page
		await clickLink(page, newPage.name)
		await expect(page).toHaveURL(`${testRoute}/${newPage.slug}`)

		await prisma.page.deleteMany()
	})
})
