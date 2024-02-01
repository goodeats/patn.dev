import { type Page } from '@playwright/test'
import { expect, type RoleType } from '#tests/playwright-utils.ts'

// https://playwright.dev/docs/locators
// https://www.programsbuzz.com/article/playwright-select-first-or-last-element

// use this when it might be content and not a heading
export const expectUniqueText = async (page: Page, text: string) => {
	const element = await page.getByText(text).first()
	await expect(element).toBeVisible()
}

export const clickLink = async (page: Page, name: string) => {
	await page.getByRole('link', { name: new RegExp(name, 'i') }).click()
}

export const expectLink = async (page: Page, name: string) => {
	await expect(
		page.getByRole('link', { name: new RegExp(name, 'i') }),
	).toBeVisible()
}

export const expectNoLink = async (page: Page, name: string) => {
	await expect(
		page.getByRole('link', { name: new RegExp(name, 'i') }),
	).not.toBeVisible()
}

export const clickButton = async (page: Page, name: string) => {
	await page.getByRole('button', { name: new RegExp(name, 'i') }).click()
}

export async function expectButton(page: Page, name: string) {
	await expect(
		page.getByRole('button', { name: new RegExp(name, 'i') }),
	).toBeVisible()
}

export async function expectNoButton(page: Page, name: string) {
	await expect(
		page.getByRole('button', { name: new RegExp(name, 'i') }),
	).not.toBeVisible()
}

interface FieldProps {
	role: RoleType
	name: string
	value: string
}

interface FillFormSubmitProps {
	page: Page
	fields: FieldProps[]
	submit?: boolean
}

export const fillSubmitForm = async ({
	page,
	fields,
	submit,
}: FillFormSubmitProps) => {
	for (const field of fields) {
		await page
			.getByRole(field.role, { name: new RegExp(field.name, 'i') })
			.fill(field.value)
	}
	if (submit) {
		await page.getByRole('button', { name: /submit/i }).click()
	}
}

export async function pageLocateTable(page: Page) {
	return await page.getByRole('main').getByRole('table')
}

export async function pageLocateTableHeader(page: Page) {
	const table = await pageLocateTable(page)
	return await table.getByRole('rowgroup').first().getByRole('row')
}

export async function expectPageTableHeaders(
	page: Page,
	columnHeaders: string[],
) {
	const tableHeader = await pageLocateTableHeader(page)
	for (let i = 0; i < columnHeaders.length; i++) {
		const columnHeader = columnHeaders[i]
		await expect(tableHeader.getByRole('cell').nth(i)).toHaveText(columnHeader)
	}
}

export async function pageLocateTableBody(page: Page) {
	const table = await pageLocateTable(page)
	return await table.getByRole('rowgroup').last()
}

export async function pageTableRowCount(page: Page) {
	const tableBody = await pageLocateTableBody(page)
	return await tableBody.getByRole('row').count()
}

export async function pageTableRow(page: Page, row: number = 0) {
	const tableBody = await pageLocateTableBody(page)
	return await tableBody.getByRole('row').nth(row)
}

export async function expectPageTableRowContent(
	page: Page,
	row: number,
	content: string[],
) {
	const tableRow = await pageTableRow(page, row)
	for (let i = 0; i < content.length; i++) {
		const cellContent = content[i]
		await expect(tableRow.getByRole('cell').nth(i)).toHaveText(cellContent)
	}
}
