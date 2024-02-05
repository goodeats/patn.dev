import {
	checkCheckbox,
	clickButton,
	expectHeading,
	expectUniqueText,
	fillInput,
} from '#tests/page-utils'
import { expect, test } from '#tests/playwright-utils.ts'
import { createPage, insertPage } from './pages-utils'

test.describe('Users cannot create Admin Pages', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/admin/pages/new')
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can create Admin Pages', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		const testRoute = '/admin/pages/new'
		await page.goto(testRoute)
		await expect(page).toHaveURL(testRoute)

		// main content
		await expectHeading(page, 'New Page')
	})
})

test('Users will see errors for required fields', async ({ page, login }) => {
	await login()
	const testRoute = '/admin/pages/new'
	await page.goto(testRoute)

	// skip name and description
	// submit
	await clickButton(page, 'submit')

	// expect page to not be created
	await expect(page).toHaveURL(testRoute)
	const nameRequired = await page.getByText('Required').first()
	await expect(nameRequired).toBeVisible()
	const descriptionRequired = await page.getByText('Required').last()
	await expect(descriptionRequired).toBeVisible()
})

test('Users will see error if duplicate name', async ({ page, login }) => {
	await login()
	const otherPage = await insertPage({})
	const testRoute = '/admin/pages/new'
	await page.goto(testRoute)

	// fill in form
	await fillInput(page, 'name', otherPage.name)
	await fillInput(page, 'description', otherPage.description)

	// submit
	await clickButton(page, 'submit')

	// expect page to not be created
	await expect(page).toHaveURL(testRoute)
	await expectUniqueText(page, 'Page with that name already exists')
})

test('Users can create page that is published', async ({ page, login }) => {
	await login()
	const testRoute = '/admin/pages/new'
	await page.goto(testRoute)

	const newPage = createPage()

	// fill in form
	await fillInput(page, 'name', newPage.name)
	await fillInput(page, 'description', newPage.description)
	// leave published unchecked

	// submit
	await clickButton(page, 'submit')

	// expect page to be created
	await expect(page).toHaveURL(`/admin/pages/${newPage.slug}`)
	await expectHeading(page, newPage.name)
	await expectUniqueText(page, 'Not Published')
	await expectUniqueText(page, newPage.description)
	await expectUniqueText(page, 'less than a minute ago')
})

test('Users can create page that is not published', async ({ page, login }) => {
	await login()
	const testRoute = '/admin/pages/new'
	await page.goto(testRoute)

	const newPage = createPage()

	// fill in form
	await fillInput(page, 'name', newPage.name)
	await fillInput(page, 'description', newPage.description)
	await checkCheckbox(page, 'publish')

	// submit
	await clickButton(page, 'submit')

	// expect page to be created
	await expect(page).toHaveURL(`/admin/pages/${newPage.slug}`)
	await expectHeading(page, newPage.name)
	await expectUniqueText(page, 'Published')
	await expectUniqueText(page, newPage.description)
	await expectUniqueText(page, 'less than a minute ago')
})
