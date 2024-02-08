import { prisma } from '#app/utils/db.server'
import {
	clickButton,
	clickLink,
	expectHeading,
	expectPageTableRowContent,
	expectUniqueText,
	pageLocateTableBody,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage, insertPages } from './pages-utils'

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
		await expectUniqueText(page, 'Published')
		await expectUniqueText(page, newPage.description)
		await expectUniqueText(page, 'Posts')
	})

	test('and delete page', async ({ page, login }) => {
		await login()
		await prisma.page.deleteMany()
		const pages = await insertPages(5)
		const newPage = pages[0]
		const testRoute = `/admin/pages/${newPage.slug}`

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// delete button
		await clickButton(page, 'delete')
		await clickButton(page, 'confirm delete')
		await expect(page).toHaveURL('/admin/pages')

		// expect toast
		await expectUniqueText(page, `"${newPage.name}" has been deleted.`)
		// expect page to not be visible from list
		const tableBody = await pageLocateTableBody(page)
		await expect(tableBody).not.toHaveText(newPage.name)
		// expect pages reordered
		pages.shift()
		for (let i = 0; i < pages.length; i++) {
			const thisPage = pages[i]
			const rowContent = [i.toString(), thisPage.name]
			await expectPageTableRowContent(page, i, rowContent)
		}
	})
})
