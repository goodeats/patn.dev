import {
	checkCheckbox,
	clickButton,
	expectHeading,
	expectUniqueText,
	fillInput,
	uncheckCheckbox,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { createPage, insertPage } from './pages-utils'

test.describe('Users cannot update Admin Page', () => {
	test('when not logged in', async ({ page }) => {
		const newPage = await insertPage({})

		await page.goto(`/admin/pages/${newPage.slug}/edit`)
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can update Admin Pages', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		const newPage = await insertPage({})
		const testRoute = `/admin/pages/${newPage.slug}/edit`

		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// main content
		await expectHeading(page, 'Edit Page')
	})
})

test('Users will see errors for required fields', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({})
	const testUrl = `/admin/pages/${newPage.slug}/edit`
	await page.goto(testUrl)

	// clear name and description
	await fillInput(page, 'name', '')
	await fillInput(page, 'description', '')
	// submit
	await clickButton(page, 'submit')

	// expect page to not be created
	await expect(page).toHaveURL(testUrl)
	const nameRequired = await page.getByText('Required').first()
	await expect(nameRequired).toBeVisible()
	const descriptionRequired = await page.getByText('Required').last()
	await expect(descriptionRequired).toBeVisible()
})

test('Users will see error if duplicate name', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({})
	const otherPage = await insertPage({})
	const testUrl = `/admin/pages/${newPage.slug}/edit`
	await page.goto(testUrl)

	// clear name and description
	await fillInput(page, 'name', otherPage.name)
	// submit
	await clickButton(page, 'submit')

	// expect page to not be created
	await expect(page).toHaveURL(testUrl)
	await expectUniqueText(page, 'Page with that name already exists')
})

test('Users can update page that is published', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({ overrides: { published: true } })
	const testRoute = `/admin/pages/${newPage.slug}`
	await page.goto(`${testRoute}/edit`)

	const updatedPage = createPage()

	// fill in form
	await fillInput(page, 'name', updatedPage.name)
	await fillInput(page, 'description', updatedPage.description)
	await checkCheckbox(page, 'publish')

	// submit
	await clickButton(page, 'submit')

	// expect page to be updated
	await expect(page).toHaveURL(`/admin/pages/${updatedPage.slug}`)
	await expectHeading(page, updatedPage.name)
	await expectUniqueText(page, 'Published')
	await expectUniqueText(page, updatedPage.description)
	await expectUniqueText(page, 'less than a minute ago')
})

test('Users can create page that is not published', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({})
	const testRoute = `/admin/pages/${newPage.slug}`
	await page.goto(`${testRoute}/edit`)

	const updatedPage = createPage()

	// fill in form
	await fillInput(page, 'name', updatedPage.name)
	await fillInput(page, 'description', updatedPage.description)
	await uncheckCheckbox(page, 'publish')

	// submit
	await clickButton(page, 'submit')

	// expect page to be updated
	await expect(page).toHaveURL(`/admin/pages/${updatedPage.slug}`)
	await expectHeading(page, updatedPage.name)
	await expectUniqueText(page, 'Not Published')
	await expectUniqueText(page, updatedPage.description)
	await expectUniqueText(page, 'less than a minute ago')
})
