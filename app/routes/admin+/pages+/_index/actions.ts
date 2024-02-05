import { parseWithZod } from '@conform-to/zod'
import { json } from '@remix-run/node'
import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { createToastHeaders } from '#app/utils/toast.server'
import { updatePageOrder } from './mutations'

export const INTENT = {
	updatePageOrder: 'update-page-order' as const,
}

type PagesActionArgs = {
	request: Request
	formData: FormData
}

export const EditPageOrderSchema = z.object({
	id: z.string(),
	direction: z.enum(['up', 'down']),
})

export async function updatePageOrderAction({ formData }: PagesActionArgs) {
	const submission = await parseWithZod(formData, {
		schema: EditPageOrderSchema.superRefine(async (data, ctx) => {
			const page = await prisma.page.findUnique({
				select: { id: true, name: true, order: true },
				where: { id: data.id },
			})
			if (!page) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Page not found`,
				})
				return
			}

			if (data.direction === 'up' && page.order === 0) {
				ctx.addIssue({
					path: ['direction'],
					code: z.ZodIssueCode.custom,
					message: `${page.name} is already at the top`,
				})
				return
			}

			const pageCount = await prisma.page.count()
			if (data.direction === 'down' && page.order === pageCount - 1) {
				ctx.addIssue({
					path: ['direction'],
					code: z.ZodIssueCode.custom,
					message: `${page.name} is already at the bottom`,
				})
				return
			}
		}),
		async: true,
	})
	if (submission.status !== 'success') {
		const directionErrors = submission.error?.direction
		const errorMessage = directionErrors?.length ? directionErrors[0] : 'whoops'
		const toastHeaders = await createToastHeaders({
			title: 'Error: Page Order',
			description: errorMessage,
		})
		return json(
			{ result: submission.reply() },
			{
				status: submission.status === 'error' ? 400 : 200,
				headers: toastHeaders,
			},
		)
	}

	const { id: pageId, direction } = submission.value
	const { page, otherPage } = await updatePageOrder(pageId, direction)

	return json(
		{ result: submission.reply() },
		{
			headers: await createToastHeaders({
				title: 'Page Order Updated',
				description: `${page.name} moved ${direction} in place of ${otherPage.name}`,
			}),
		},
	)
}
