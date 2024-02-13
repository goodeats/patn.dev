import {
	clickLink,
	expectHeading,
	expectPageTableHeaders,
	expectPageTableRowContent,
	pageTableRowCount,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../pages-utils'
import { insertPost } from './posts-utils.ts'

test.describe('Users cannot view Admin Pages Page Posts', () => {
	test('when not logged in', async ({ page }) => {
		const newPage = await insertPage({})
		await page.goto(`/admin/pages/${newPage.slug}/posts`)
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can view Admin Pages Page Posts', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		const newPage = await insertPage({})
		const newPost = await insertPost({ pageId: newPage.id })
		const testRoute = `/admin/pages/${newPage.slug}/posts`

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// back link
		await clickLink(page, 'back')
		await expect(page).toHaveURL(`/admin/pages/${newPage.slug}`)
		await page.goto(testRoute)

		// main content
		await expectHeading(page, `${newPage.name} Posts`)

		// table content
		await expectPageTableHeaders(page, ['Post', 'Published', 'Date'])
		const rowCount = await pageTableRowCount(page)
		const updatedAt = new Date().toLocaleDateString()
		const rowContent = [newPost.title, 'No', updatedAt]
		await expectPageTableRowContent(page, rowCount - 1, rowContent)

		// table link to page
		await clickLink(page, newPost.title)
		await expect(page).toHaveURL(`${testRoute}/${newPost.slug}`)
	})
})
