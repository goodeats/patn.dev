import { type Page } from '@prisma/client'
import { prisma } from '#app/utils/db.server'
import { expectLink, expectUniqueText } from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { insertPage } from '../admin/pages/pages-utils'

test.describe('Users can view static Home Page', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL('/')

		await expectUniqueText(page, 'Pat Needham')
	})
})

let websitePage: Page
let testRoute: string
test.describe('Users can view dynamic Home Page content', () => {
	test.beforeEach(async ({ page }) => {
		await prisma.page.deleteMany()

		websitePage = await insertPage({
			overrides: { name: 'About', published: true },
		})
		testRoute = `/`

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)
	})

	test('expect nav page nav link', async ({ page }) => {
		await expectLink(page, websitePage.name)
	})
})
