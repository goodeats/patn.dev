import { type Post, type Page } from '@prisma/client'
import { prisma } from '#app/utils/db.server'
import {
	clickButton,
	clickLink,
	expectHeading,
	expectUniqueText,
	pageLocateTableBody,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../pages-utils'
import { insertPost } from './posts-utils.ts'

test.describe('Users cannot view Admin Page Post', () => {
	test('when not logged in', async ({ page }) => {
		const adminPage = await insertPage({})
		const newPost = await insertPost({ pageId: adminPage.id })
		await page.goto(`/admin/pages/${adminPage.slug}/posts/${newPost.slug}`)
		await expect(page).toHaveURL('/')
	})
})

let adminPage: Page
let adminPost: Post
let testRoute: string
test.describe('User can view Admin Page Post', () => {
	test.beforeEach(async () => {
		// Delete all pages before each test
		await prisma.page.deleteMany()

		adminPage = await insertPage({})
		adminPost = await insertPost({ pageId: adminPage.id })
		testRoute = `/admin/pages/${adminPage.slug}/posts/${adminPost.slug}`
	})

	test('when logged in as admin', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// page link
		await clickLink(page, adminPage.name)
		await expect(page).toHaveURL(`/admin/pages/${adminPage.slug}`)
		await page.goto(testRoute)

		// posts link
		await clickLink(page, 'posts')
		await expect(page).toHaveURL(`/admin/pages/${adminPage.slug}/posts`)
		await clickLink(page, 'back')
		await page.goto(testRoute)

		// edit link
		await clickLink(page, 'edit')
		await expect(page).toHaveURL(`${testRoute}/edit`)
		await clickLink(page, 'cancel')
		await page.goto(testRoute)

		// main content
		await expectHeading(page, adminPost.title)
		await expectUniqueText(page, 'Published')
		await expectUniqueText(page, adminPost.description)
		await expectUniqueText(page, adminPost.content)
	})

	test('and delete post', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// delete button
		await clickButton(page, 'delete')
		await clickButton(page, 'confirm delete')
		await expect(page).toHaveURL(`/admin/pages/${adminPage.slug}/posts`)

		// expect toast
		await expectUniqueText(page, `"${adminPost.title}" has been deleted.`)
		// expect post to not be visible from list
		const tableBody = await pageLocateTableBody(page)
		await expect(tableBody).not.toHaveText(adminPost.title)
	})
})
