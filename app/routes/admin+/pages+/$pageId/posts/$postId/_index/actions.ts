import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json } from '@remix-run/node'
import { prisma } from '#app/utils/db.server'
import { redirectWithToast } from '#app/utils/toast.server'
import { DeletePostSchema } from '#app/utils/zod-schema'

export const INTENT = {
	deletePost: 'delete-post' as const,
}

type ActionArgs = {
	request: Request
	formData: FormData
}

export async function deletePostAction({ formData }: ActionArgs) {
	const submission = await parseWithZod(formData, {
		schema: DeletePostSchema,
	})
	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { id: postId } = submission.value
	// get the post for title and pageId
	// title for toast message
	const post = await prisma.post.findFirst({
		select: { id: true, title: true, pageId: true },
		where: { id: postId },
	})
	invariantResponse(post, 'Post not found', { status: 404 })

	// get the page for redirect
	const page = await prisma.page.findFirst({
		select: { slug: true },
		where: { id: post.pageId },
	})
	invariantResponse(page, 'Page not found', { status: 404 })

	// delete the post
	await prisma.post.delete({
		where: { id: postId },
	})

	return redirectWithToast(`/admin/pages/${page.slug}/posts`, {
		type: 'success',
		title: 'Success',
		description: `"${post.title}" has been deleted.`,
	})
}
