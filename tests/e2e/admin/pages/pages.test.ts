import { prisma } from '#app/utils/db.server'
import {
	clickLink,
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
		await prisma.page.deleteMany()
		const newPage = await insertPage({})

		await page.goto('/admin/pages')
		await expect(page).toHaveURL('/admin/pages')

		// new link
		const newLink = page.getByRole('link', { name: /add page/i })
		await newLink.click()
		await expect(page).toHaveURL('/admin/pages/new')
		await page.goto('/admin/pages')

		// main content
		await expect(
			page.getByRole('heading', { name: 'Pages', exact: true }),
		).toBeVisible()

		// table content
		await expectPageTableHeaders(page, ['Order', 'Page', 'Published', 'Date'])
		const rowCount = await pageTableRowCount(page)
		const pageUpdatedAt = new Date().toLocaleDateString()
		const rowContent = ['0', newPage.name, 'No', pageUpdatedAt]
		await expectPageTableRowContent(page, rowCount - 1, rowContent)

		// table link to page
		await clickLink(page, newPage.name)
		await expect(page).toHaveURL(`/admin/pages/${newPage.slug}`)

		await prisma.page.deleteMany()
	})
})
