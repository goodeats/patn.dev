import { type Page, type Post } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import {
	checkCheckbox,
	clickButton,
	expectHeading,
	expectUniqueText,
	fillInput,
	uncheckCheckbox,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../pages-utils'
import { createPost, insertPost } from './posts-utils.ts'

test.describe('Users cannot update Admin Page Post', () => {
	test('when not logged in', async ({ page }) => {
		const adminPage = await insertPage({})
		const newPost = await insertPost({ pageId: adminPage.id })
		await page.goto(`/admin/pages/${adminPage.slug}/posts/${newPost.slug}/edit`)
		await expect(page).toHaveURL('/')
	})
})

let adminPage: Page
let adminPost: Post
let testRoute: string
test.describe('User can update Admin Pages', () => {
	test.beforeEach(async ({ page }) => {
		// Delete all pages before each test
		await prisma.page.deleteMany()

		adminPage = await insertPage({})
		adminPost = await insertPost({ pageId: adminPage.id })
		testRoute = `/admin/pages/${adminPage.slug}/posts/${adminPost.slug}/edit`
	})

	test('when logged in as admin', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// main content
		await expectHeading(page, 'Edit Page')
	})

	test('Users will see errors for required fields', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)

		// clear required fields
		await fillInput(page, 'title', '')
		await fillInput(page, 'description', '')
		await fillInput(page, 'content', '')
		// submit
		await clickButton(page, 'submit')

		// expect page to not be created
		await expect(page).toHaveURL(testRoute)
		await expectUniqueText(page, 'Title Required')
		await expectUniqueText(page, 'Description Required')
		await expectUniqueText(page, 'Content Required')
	})

	test('Users will see error if duplicate name', async ({ page, login }) => {
		await login()

		const otherPost = await insertPost({ pageId: adminPage.id })
		await page.goto(testRoute)

		// clear name and description
		await fillInput(page, 'title', otherPost.title)
		// submit
		await clickButton(page, 'submit')

		// expect page to not be created
		await expect(page).toHaveURL(testRoute)
		await expectUniqueText(page, 'Post with that title already exists')
	})

	test('Users can update post to published', async ({ page, login }) => {
		await login()

		const updatedPost = createPost({ pageId: adminPage.id })

		await page.goto(testRoute)

		// fill in form
		await fillInput(page, 'title', updatedPost.title)
		await fillInput(page, 'description', updatedPost.description)
		await fillInput(page, 'content', updatedPost.content)
		await checkCheckbox(page, 'publish')

		// submit
		await clickButton(page, 'submit')

		// expect page to be updated
		await expect(page).toHaveURL(
			`/admin/pages/${adminPage.slug}/posts/${updatedPost.slug}`,
		)
		await expectHeading(page, updatedPost.title)
		await expectUniqueText(page, 'Published')
		await expectUniqueText(page, updatedPost.description)
		await expectUniqueText(page, updatedPost.content)
		await expectUniqueText(page, 'less than a minute ago')
	})

	test('Users can create page to unpublished', async ({ page, login }) => {
		await login()

		await prisma.post.update({
			where: { id: adminPost.id },
			data: { published: true },
		})

		const updatedPost = createPost({ pageId: adminPage.id })
		await page.goto(testRoute)

		// fill in form
		await fillInput(page, 'title', updatedPost.title)
		await fillInput(page, 'description', updatedPost.description)
		await fillInput(page, 'content', updatedPost.content)
		await uncheckCheckbox(page, 'publish')

		// submit
		await clickButton(page, 'submit')

		// expect page to be updated
		await expect(page).toHaveURL(
			`/admin/pages/${adminPage.slug}/posts/${updatedPost.slug}`,
		)
		await expectHeading(page, updatedPost.title)
		await expectUniqueText(page, 'Not Published')
		await expectUniqueText(page, updatedPost.description)
		await expectUniqueText(page, updatedPost.content)
		await expectUniqueText(page, 'less than a minute ago')
	})
})
