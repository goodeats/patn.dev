import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json } from '@remix-run/node'
import { z } from 'zod'
import { prisma } from '#app/utils/db.server'
import { redirectWithToast } from '#app/utils/toast.server'
import { deletePage } from './mutations'

export const INTENT = {
	deletePage: 'delete-page' as const,
}

type PagesActionArgs = {
	request: Request
	formData: FormData
}

export const DeletePageSchema = z.object({
	id: z.string(),
})

export async function deletePageAction({ formData }: PagesActionArgs) {
	const submission = await parseWithZod(formData, {
		schema: DeletePageSchema,
	})
	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id: pageId } = submission.value
	const page = await prisma.page.findFirst({
		select: { id: true, name: true, order: true },
		where: { id: pageId },
	})
	invariantResponse(page, 'Not found', { status: 404 })

	await deletePage(pageId)

	return redirectWithToast('/admin/pages', {
		type: 'success',
		title: 'Success',
		description: `"${page.name}" has been deleted.`,
	})
}
