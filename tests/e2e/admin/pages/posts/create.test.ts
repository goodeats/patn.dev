import { type Page } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import {
	checkCheckbox,
	clickButton,
	expectHeading,
	expectUniqueText,
	fillInput,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../pages-utils'
import {
	createPost,
	expectPageContentForPost,
	insertPost,
} from './posts-utils.ts'

test.describe('Users cannot access New Admin Pages Page Posts', () => {
	test('when not logged in', async ({ page }) => {
		const adminPage = await insertPage({})
		await page.goto(`/admin/pages/${adminPage.slug}/posts/new`)
		await expect(page).toHaveURL('/')
	})
})

let adminPage: Page
let testRoute: string
test.describe('Admin User can access New Admin Pages Page Posts', () => {
	test.beforeEach(async ({ login, page }) => {
		await prisma.page.deleteMany()

		adminPage = await insertPage({})
		testRoute = `/admin/pages/${adminPage.slug}/posts/new`

		await login()

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)
	})

	test('View expected content', async ({ page }) => {
		await expectHeading(page, `New ${adminPage.name} Post`)
	})

	test.describe('Create is unsuccessful', () => {
		test('without required fields', async ({ page }) => {
			await clickButton(page, 'submit')

			// expect post to not be updated
			await expect(page).toHaveURL(testRoute)
			await expectUniqueText(page, 'Title Required')
			await expectUniqueText(page, 'Description Required')
			await expectUniqueText(page, 'Content Required')
		})

		test('Users will see error if duplicate title', async ({ page }) => {
			const otherPost = await insertPost({ pageId: adminPage.id })

			// fill title with existing post title
			await fillInput(page, 'title', otherPost.title)
			await fillInput(page, 'description', otherPost.description)
			await fillInput(page, 'content', otherPost.content)

			await clickButton(page, 'submit')

			// expect post to not be created
			await expect(page).toHaveURL(testRoute)
			await expectUniqueText(page, 'Post with that title already exists')
		})
	})

	test.describe('Create is successful', () => {
		test('with required fields', async ({ page }) => {
			const newPost = createPost({ pageId: adminPage.id })

			await fillInput(page, 'title', newPost.title)
			await fillInput(page, 'description', newPost.description)
			await fillInput(page, 'content', newPost.content)

			await clickButton(page, 'submit')

			await expect(page).toHaveURL(
				`/admin/pages/${adminPage.slug}/posts/${newPost.slug}`,
			)
			await expectPageContentForPost(page, newPost, false)
		})

		test('that is published on create', async ({ page }) => {
			const newPost = createPost({ pageId: adminPage.id })

			await fillInput(page, 'title', newPost.title)
			await fillInput(page, 'description', newPost.description)
			await fillInput(page, 'content', newPost.content)
			await checkCheckbox(page, 'publish')

			await clickButton(page, 'submit')

			await expect(page).toHaveURL(
				`/admin/pages/${adminPage.slug}/posts/${newPost.slug}`,
			)
			await expectPageContentForPost(page, newPost, true)
		})
	})
})
