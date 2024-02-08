import { prisma } from '#app/utils/db.server'
import {
	clickLink,
	expectHeading,
	expectPageTableHeaders,
	expectPageTableRowContent,
	getButton,
	getLink,
	pageTableRow,
	pageTableRowCount,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage, insertPages } from '../pages-utils'

test.describe('Users cannot view Admin Pages Page Posts', () => {
	test('when not logged in', async ({ page }) => {
		const newPage = await insertPage({})
		await page.goto(`/admin/pages/${newPage.slug}/posts`)
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin Pages', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		const newPage = await insertPage({})
		const testRoute = `/admin/pages/${newPage.slug}/posts`

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// back link
		await clickLink(page, 'back')
		await expect(page).toHaveURL(`/admin/pages/${newPage.slug}`)
		await page.goto(testRoute)

		// main content
		await expectHeading(page, `${newPage.name} Posts`)

		// // table content
		// await expectPageTableHeaders(page, [
		// 	'Order',
		// 	'Page',
		// 	'Published',
		// 	'Posts',
		// 	'Date',
		// ])
		// const rowCount = await pageTableRowCount(page)
		// const pageUpdatedAt = new Date().toLocaleDateString()
		// const rowContent = ['0', newPage.name, 'No', '0', pageUpdatedAt]
		// await expectPageTableRowContent(page, rowCount - 1, rowContent)

		// // table link to page
		// await clickLink(page, newPage.name)
		// await expect(page).toHaveURL(`${testRoute}/${newPage.slug}`)
		// await page.goto(testRoute)

		// // table link to page posts
		// const firstTableRow = await pageTableRow(page, 0)
		// const postsLink = await getLink(page, '0')
		// await firstTableRow.locator(postsLink).click()
		// await expect(page).toHaveURL(`${testRoute}/${newPage.slug}/posts`)
	})

	// copied from pages, fix reorder test when ready
	test.skip('and reorder pages', async ({ page, login }) => {
		await login()
		const testRoute = '/admin/pages'
		await prisma.page.deleteMany()
		const pages = await insertPages(5)

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// all created just now
		const pageUpdatedAt = new Date().toLocaleDateString()
		const moveUpButton = await getButton(page, 'Move Up')
		const moveDownButton = await getButton(page, 'Move Down')

		// expect pages in order
		for (let i = 0; i < pages.length; i++) {
			const thisPage = pages[i]

			const actions = await page.locator(`#page-${thisPage.id}-actions`)

			const rowContent = [
				i.toString(),
				thisPage.name,
				'Yes',
				'0',
				pageUpdatedAt,
				actions,
			]
			await expectPageTableRowContent(page, i, rowContent)

			// expect first move up button disabled
			if (i === 0) {
				const tableRow = await pageTableRow(page, i)
				await expect(tableRow.locator(moveUpButton)).toBeDisabled()
			}

			// expect last move down button disabled
			if (i === 4) {
				const tableRow = await pageTableRow(page, i)
				await expect(tableRow.locator(moveDownButton)).toBeDisabled()
			}
		}

		// move 2nd page up
		const tableRowToMoveUp = await pageTableRow(page, 1)
		await tableRowToMoveUp.locator(moveUpButton).click()
		// expect updated order
		const tableRow0 = await pageTableRow(page, 0)
		const tableCell0 = tableRow0.getByRole('cell').nth(1)
		await expect(tableCell0).toHaveText(pages[1].name)
		const tableRow1 = await pageTableRow(page, 1)
		const tableCell1 = tableRow1.getByRole('cell').nth(1)
		await expect(tableCell1).toHaveText(pages[0].name)

		// move 2nd to last page down
		const tableRowToMoveDown = await pageTableRow(page, 3)
		await tableRowToMoveDown.locator(moveDownButton).click()
		// expect updated order
		const tableRow3 = await pageTableRow(page, 3)
		const tableCell3 = tableRow3.getByRole('cell').nth(1)
		await expect(tableCell3).toHaveText(pages[4].name)
		const tableRow4 = await pageTableRow(page, 4)
		const tableCell4 = tableRow4.getByRole('cell').nth(1)
		await expect(tableCell4).toHaveText(pages[3].name)
	})
})
