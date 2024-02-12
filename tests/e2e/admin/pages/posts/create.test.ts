import { type Page } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import {
	checkCheckbox,
	clickButton,
	expectHeading,
	expectNoUniqueText,
	expectUniqueText,
	fillInput,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../pages-utils'
import { createPost, insertPost } from './posts-utils.ts'

test.describe('Users cannot create Admin Pages Page Posts', () => {
	test('when not logged in', async ({ page }) => {
		const adminPage = await insertPage({})
		await page.goto(`/admin/pages/${adminPage.slug}/posts/new`)
		await expect(page).toHaveURL('/')
	})
})

let adminPage: Page
let testRoute: string
test.describe('User can create Admin Pages Page Posts', () => {
	test.beforeEach(async ({ page }) => {
		// Delete all pages before each test
		await prisma.page.deleteMany()

		adminPage = await insertPage({})
		testRoute = `/admin/pages/${adminPage.slug}/posts/new`
	})

	test('when logged in as admin', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// main content
		await expectHeading(page, `New ${adminPage.name} Post`)
	})

	test('and see errors for required fields', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)

		// skip name and description
		// submit
		await clickButton(page, 'submit')

		// expect page to not be created
		await expect(page).toHaveURL(testRoute)
		await expectUniqueText(page, 'Title Required')
		await expectUniqueText(page, 'Description Required')
		await expectUniqueText(page, 'Content Required')
	})

	test('Users will see error if duplicate title', async ({ page, login }) => {
		await login()

		const newPost = await insertPost({ pageId: adminPage.id })
		await page.goto(testRoute)

		// fill in form
		await fillInput(page, 'title', newPost.title)
		await fillInput(page, 'description', newPost.description)
		await fillInput(page, 'content', newPost.content)

		// submit
		await clickButton(page, 'submit')

		// expect post to not be created
		await expect(page).toHaveURL(testRoute)
		await expectUniqueText(page, 'Post with that title already exists')
	})

	test('Users can create post that is not published', async ({
		page,
		login,
	}) => {
		await login()

		await page.goto(testRoute)

		const newPost = createPost({ pageId: adminPage.id })

		// fill in form
		await fillInput(page, 'title', newPost.title)
		await fillInput(page, 'description', newPost.description)
		await fillInput(page, 'content', newPost.content)
		// leave published unchecked

		// submit
		await clickButton(page, 'submit')

		// expect page to be created
		await expect(page).toHaveURL(
			`/admin/pages/${adminPage.slug}/posts/${newPost.slug}`,
		)
		await expectHeading(page, newPost.title)
		await expectUniqueText(page, 'Not Published')
		await expectUniqueText(page, newPost.description)
		await expectUniqueText(page, newPost.content)
		await expectUniqueText(page, 'Updated: less than a minute ago')
		await expectNoUniqueText(page, 'Published: less than a minute ago')
	})

	test('Users can create post that is published', async ({ page, login }) => {
		await login()

		await page.goto(testRoute)

		const newPost = createPost({ pageId: adminPage.id })

		// fill in form
		await fillInput(page, 'title', newPost.title)
		await fillInput(page, 'description', newPost.description)
		await fillInput(page, 'content', newPost.content)
		await checkCheckbox(page, 'publish')

		// submit
		await clickButton(page, 'submit')

		// expect page to be created
		await expect(page).toHaveURL(
			`/admin/pages/${adminPage.slug}/posts/${newPost.slug}`,
		)
		await expectHeading(page, newPost.title)
		await expectUniqueText(page, 'Published')
		await expectUniqueText(page, newPost.description)
		await expectUniqueText(page, newPost.content)
		await expectUniqueText(page, 'Updated: less than a minute ago')
		await expectUniqueText(page, 'Published: less than a minute ago')
	})
})
