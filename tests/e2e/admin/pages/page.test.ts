import { prisma } from '#app/utils/db.server'
import { expect, test } from '#tests/playwright-utils.ts'
import { createPage } from './pages-utils'

test.describe('Users cannot view Admin Page', () => {
	test('when not logged in', async ({ page }) => {
		await prisma.page.deleteMany()
		const newPage = await prisma.page.create({
			data: createPage(),
		})
		await page.goto(`/admin/pages/${newPage.slug}`)
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin Page', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		await prisma.page.deleteMany()
		const newPage = await prisma.page.create({
			data: createPage(),
		})

		await page.goto(`/admin/pages/${newPage.slug}`)
		await expect(page).toHaveURL(`/admin/pages/${newPage.slug}`)

		// main content
		await expect(
			page.getByRole('heading', { name: newPage.name }),
		).toBeVisible()
		const description = await page.getByText(newPage.description).first()
		await expect(description).toBeVisible()
		const published = await page.getByText('Published').first()
		await expect(published).toBeVisible()
	})
})
