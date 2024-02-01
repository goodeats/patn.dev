import { expect, test } from '#tests/playwright-utils.ts'
import { createPage } from './pages-utils'

test.describe('Users cannot create Admin Pages', () => {
	test('when not logged in', async ({ page }) => {
		await page.goto('/admin/pages/new')
		await expect(page).toHaveURL('/')
	})
})

test.describe('User can create Admin Pages', () => {
	test('when logged in as admin', async ({ page, login }) => {
		await login()
		await page.goto('/admin/pages/new')
		await expect(page).toHaveURL('/admin/pages/new')

		// main content
		await expect(
			page.getByRole('heading', { name: 'New Page', exact: true }),
		).toBeVisible()
	})
})

test('Users will see error if no name', async ({ page, login }) => {
	await login()
	await page.goto('/admin/pages')

	await page.getByRole('link', { name: 'add page' }).click()

	// skip name and description
	// submit
	await page.getByRole('button', { name: 'submit' }).click()

	// expect page to not be created
	await expect(page).toHaveURL('/admin/pages/new')
	const nameRequired = await page.getByText('Required').first()
	await expect(nameRequired).toBeVisible()
	const descriptionRequired = await page.getByText('Required').last()
	await expect(descriptionRequired).toBeVisible()
})

test('Users can create page that is published', async ({ page, login }) => {
	await login()
	await page.goto('/admin/pages')

	const newPage = createPage()
	await page.getByRole('link', { name: 'add page' }).click()

	// fill in form
	await page.getByRole('textbox', { name: 'name' }).fill(newPage.name)
	await page
		.getByRole('textbox', { name: 'description' })
		.fill(newPage.description)
	await page.getByLabel(/publish/i).check()

	// submit
	await page.getByRole('button', { name: 'submit' }).click()

	// expect page to be created
	await expect(page).toHaveURL(new RegExp(`/admin/pages/${newPage.slug}`))
	await expect(page.getByRole('heading', { name: newPage.name })).toBeVisible()
	const description = await page.getByText(newPage.description).first()
	await expect(description).toBeVisible()
	const published = await page.getByText('Published').first()
	await expect(published).toBeVisible()
})

test('Users can create page that is not published', async ({ page, login }) => {
	await login()
	await page.goto('/admin/pages')

	const newPage = createPage()
	await page.getByRole('link', { name: 'add page' }).click()

	// fill in form
	await page.getByRole('textbox', { name: 'name' }).fill(newPage.name)
	await page
		.getByRole('textbox', { name: 'description' })
		.fill(newPage.description)
	// leave published unchecked

	// submit
	await page.getByRole('button', { name: 'submit' }).click()

	// expect page to be created
	await expect(page).toHaveURL(new RegExp(`/admin/pages/${newPage.slug}`))
	await expect(page.getByRole('heading', { name: newPage.name })).toBeVisible()
	const description = await page.getByText(newPage.description).first()
	await expect(description).toBeVisible()
	const published = await page.getByText('Not Published').first()
	await expect(published).toBeVisible()
})
