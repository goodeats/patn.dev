import { type Page, type Post } from '@prisma/client'
import { prisma } from '#app/utils/db.server.ts'
import {
	checkCheckbox,
	clickButton,
	clickLink,
	expectHeading,
	expectUniqueText,
	fillInput,
	uncheckCheckbox,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../pages-utils'
import {
	createPost,
	expectPageContentForPost,
	insertPost,
} from './posts-utils.ts'

test.describe('Users cannot access Edit Admin Page Post', () => {
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
test.describe('Admin User can access Edit Admin Page Post', () => {
	test.beforeEach(async ({ page, login }) => {
		await prisma.page.deleteMany()

		adminPage = await insertPage({})
		adminPost = await insertPost({ pageId: adminPage.id })
		testRoute = `/admin/pages/${adminPage.slug}/posts/${adminPost.slug}/edit`

		await login()

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)
	})

	test('View expected content', async ({ page, login }) => {
		// main content
		await expectHeading(page, 'Edit Post')
	})

	test.describe('Update is unsuccessful', () => {
		test('without required fields', async ({ page, login }) => {
			// clear required fields
			await fillInput(page, 'title', '')
			await fillInput(page, 'description', '')
			await fillInput(page, 'content', '')
			// submit
			await clickButton(page, 'submit')

			// expect post to not be updated
			await expect(page).toHaveURL(testRoute)
			await expectUniqueText(page, 'Title Required')
			await expectUniqueText(page, 'Description Required')
			await expectUniqueText(page, 'Content Required')
		})

		test('Users will see error if duplicate name', async ({ page, login }) => {
			const otherPost = await insertPost({ pageId: adminPage.id })

			// fill title with existing post title
			await fillInput(page, 'title', otherPost.title)
			// submit
			await clickButton(page, 'submit')

			// expect page to not be created
			await expect(page).toHaveURL(testRoute)
			await expectUniqueText(page, 'Post with that title already exists')
		})
	})

	test.describe('Update is successful', () => {
		test('with required fields', async ({ page, login }) => {
			const updatedPost = createPost({ pageId: adminPage.id })

			// fill in form
			await fillInput(page, 'title', updatedPost.title)
			await fillInput(page, 'description', updatedPost.description)
			await fillInput(page, 'content', updatedPost.content)
			await checkCheckbox(page, 'publish')

			// submit
			await clickButton(page, 'submit')

			// expect page to be updated
			const updatedRoute = `/admin/pages/${adminPage.slug}/posts/${updatedPost.slug}`
			await expect(page).toHaveURL(updatedRoute)
			await expectPageContentForPost(page, updatedPost, true)
		})

		test('publish an unpublished post', async ({ page, login }) => {
			// go back to post page to confirm it is not published
			clickLink(page, 'cancel')
			await expectPageContentForPost(page, adminPost, false)
			clickLink(page, 'edit')

			// check publish and submit
			await checkCheckbox(page, 'publish')
			await clickButton(page, 'submit')

			await expectPageContentForPost(page, adminPost, true)
		})

		test('unpublish a published post', async ({ page, login }) => {
			await prisma.post.update({
				where: { id: adminPost.id },
				data: { published: true, publishedAt: new Date() },
			})

			// go back to post page to confirm it is  published
			clickLink(page, 'cancel')
			await expectPageContentForPost(page, adminPost, true)
			clickLink(page, 'edit')

			// uncheck publish and submit
			await uncheckCheckbox(page, 'publish')
			await clickButton(page, 'submit')

			await expectPageContentForPost(page, adminPost, false)
		})
	})
})
