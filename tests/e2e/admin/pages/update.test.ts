import { expectUniqueText } from '#tests/page-utils'
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

		await page.goto(`/admin/pages/${newPage.slug}/edit`)
		await expect(page).toHaveURL(`/admin/pages/${newPage.slug}/edit`)

		// main content
		await expect(
			page.getByRole('heading', { name: 'Edit Page', exact: true }),
		).toBeVisible()
	})
})

test('Users will see error if no name', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({})
	const testUrl = `/admin/pages/${newPage.slug}/edit`
	await page.goto(testUrl)

	// clear name and description
	await page.getByRole('textbox', { name: 'name' }).fill('')
	await page.getByRole('textbox', { name: 'description' }).fill('')
	// submit
	await page.getByRole('button', { name: 'submit' }).click()

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
	await page.getByRole('textbox', { name: 'name' }).fill(otherPage.name)
	// submit
	await page.getByRole('button', { name: 'submit' }).click()

	// expect page to not be created
	await expect(page).toHaveURL(testUrl)
	const nameAlreadyExists = await page
		.getByText('Page with that name already exists')
		.first()
	await expect(nameAlreadyExists).toBeVisible()
})

test('Users can update page that is published', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({ overrides: { published: true } })
	const testUrl = `/admin/pages/${newPage.slug}`
	await page.goto(`${testUrl}/edit`)

	const updatedPage = createPage()

	// fill in form
	await page.getByRole('textbox', { name: 'name' }).fill(updatedPage.name)
	await page
		.getByRole('textbox', { name: 'description' })
		.fill(updatedPage.description)
	await page.getByLabel(/publish/i).check()

	// submit
	await page.getByRole('button', { name: 'submit' }).click()

	// expect page to be updated
	await expect(page).toHaveURL(`/admin/pages/${updatedPage.slug}`)
	await expect(
		page.getByRole('heading', { name: updatedPage.name }),
	).toBeVisible()
	await expectUniqueText(page, 'Published')
	await expectUniqueText(page, updatedPage.description)
	await expectUniqueText(page, 'less than a minute ago')
})

test('Users can create page that is not published', async ({ page, login }) => {
	await login()
	const newPage = await insertPage({})
	const testUrl = `/admin/pages/${newPage.slug}`
	await page.goto(`${testUrl}/edit`)

	const updatedPage = createPage()

	// fill in form
	await page.getByRole('textbox', { name: 'name' }).fill(updatedPage.name)
	await page
		.getByRole('textbox', { name: 'description' })
		.fill(updatedPage.description)
	await page.getByLabel(/publish/i).uncheck()

	// submit
	await page.getByRole('button', { name: 'submit' }).click()

	// expect page to be updated
	await expect(page).toHaveURL(`/admin/pages/${updatedPage.slug}`)
	await expect(
		page.getByRole('heading', { name: updatedPage.name }),
	).toBeVisible()
	await expectUniqueText(page, 'Published')
	await expectUniqueText(page, updatedPage.description)
	await expectUniqueText(page, 'less than a minute ago')
})
